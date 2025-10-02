const OpenAI = require('openai');
const sql = require('../config/db.js');
const fs = require('fs');
const pdf = require('pdf-parse/lib/pdf-parse.js');
const { clerkClient } = require('@clerk/express');
const { default: axios } = require('axios');
const cloudinary = require('cloudinary').v2;
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
const ideaCategories = [
  'Child',
  'Teenager',
  'Young Adult',
  'Adult',
  'Student',
  'Professional',
  'Expert',
];
const generateArticle = async (req, res) => {
  const userId = req.userId;
  const { prompt, length, language } = req.body; // Add language parameter
  const plan = req.plan;
  const free_usage = req.free_usage;

  const isArabic = language === 'ar';
  try {
    // Validation
    if (!prompt || !length) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'يرجى تقديم كل من الموضوع وطول المقال'
          : 'Please provide both topic and article length.',
      });
    }

    if (plan !== 'premium' && free_usage >= 2) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'تم الوصول إلى الحد المسموح. يرجى الترقية إلى الإصدار المميز لمواصلة استخدام التطبيق.'
          : 'Limit reached. Please upgrade to Premium to continue using our app.',
      });
    }

    // Determine response language
    const responseLanguage = isArabic ? 'Arabic' : 'English';

    // Simplified token calculation - be more generous with tokens
    let maxTokens;
    if (length <= 600) {
      maxTokens = 2000; // Short articles
    } else if (length <= 1000) {
      maxTokens = 3500; // Medium articles
    } else {
      maxTokens = 5000; // Long articles
    }

    console.log(
      `Generating article - Target: ${length} words, Max tokens: ${maxTokens}, Language: ${responseLanguage}`
    );

    // Language-aware prompts
    const systemPrompt = isArabic
      ? `أنت كاتب محتوى محترف. أنشئ مقالات كاملة ومنظمة جيدًا تحتوي على:
- عنوان واضح ومقدمة
- محتوى رئيسي منظم مع عناوين فرعية
- خاتمة مناسبة تلخص المقال
- حوالي ${length} كلمة
- تنسيق Markdown للعناوين

مهم: اكتب دائمًا مقالاً كاملاً لا ينتهي فجأة. اشمل خاتمة نهائية واضحة. يجب أن تكون الإجابة باللغة العربية فقط.`
      : `You are a professional content writer. Create complete, well-structured articles with:
- A clear title and introduction
- Well-organized main content with subheadings
- A proper conclusion that wraps up the article
- Approximately ${length} words
- Markdown formatting for headers

IMPORTANT: Always write a complete article that doesn't end abruptly. Include a definitive conclusion. Your response must be in English only.`;

    const userPrompt = isArabic
      ? `اكتب مقالاً شاملاً من ${length} كلمة عن: ${prompt}

هيكل المقال:
1. عنوان جذاب (استخدم # للعنوان الرئيسي)
2. فقرة مقدمة
3. محتوى رئيسي مع عناوين فرعية (استخدم ## للأقسام الرئيسية)
4. فقرة خاتمة

تأكد أن المقال كامل ومفيد.`
      : `Write a comprehensive ${length}-word article about: ${prompt}

Structure it with:
1. An engaging title (use # for the main title)
2. Introduction paragraph
3. Main content with subheadings (use ## for main sections)
4. Conclusion paragraph

Make sure the article is complete and informative.`;

    // API call with better error handling
    let response;
    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Article generation attempt ${attempt}/3`);

        response = await openai.chat.completions.create({
          model: 'gemini-2.0-flash',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: maxTokens,
          top_p: 0.9,
        });

        console.log('Article generation successful');
        break;
      } catch (apiError) {
        lastError = apiError;
        console.error(`Attempt ${attempt} failed:`, {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
        });

        if (attempt === 3) {
          return res.status(500).json({
            status: 'error',
            message: isArabic
              ? `فشلت العملية بعد 3 محاولات. الخطأ الأخير: ${apiError.message}`
              : `Failed after 3 attempts. Last error: ${apiError.message}`,
          });
        }

        // Wait before retry (1s, 2s, 4s)
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message ||
      !response.choices[0].message.content
    ) {
      return res.status(500).json({
        status: 'error',
        message: isArabic
          ? 'فشل الرد من واجهة الذكاء الاصطناعي، يرجى المحاولة مرة أخرى'
          : 'AI API failed to response try again',
      });
    }

    let content = response.choices[0].message.content;

    // Simple completeness check
    const wordCount = content.trim().split(/\s+/).length;
    const endsProperlyPattern = /[.!?؟]\s*$/;
    const hasMinimumLength = wordCount >= length * 0.6;
    const endsProperlyFormatted = endsProperlyPattern.test(content.trim());

    console.log(
      `Article generated - Words: ${wordCount}, Target: ${length}, Ends properly: ${endsProperlyFormatted}, Language: ${responseLanguage}`
    );

    // Save to database
    await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'article')`;

    // Update free usage if not premium
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    const finalWordCount = content.trim().split(/\s+/).length;

    res.status(200).json({
      status: 'success',
      content,
      metadata: {
        wordCount: finalWordCount,
        targetLength: length,
        language: responseLanguage,
      },
    });
  } catch (err) {
    console.error('Generate Article Error:', err);

    res.status(500).json({
      status: 'error',
      message: isArabic
        ? `فشل إنشاء المقال ${err.message}`
        : `Failed to generate article: ${err.message}`,
      details: {
        timestamp: new Date().toISOString(),
        userId: req.userId,
        prompt: req.body.prompt?.substring(0, 100) + '...',
        targetLength: req.body.length,
        language: req.body.language,
        errorType: err.name,
      },
    });
  }
};

const simplifyIdea = async (req, res) => {
  const userId = req.userId;
  const { selectedCategory, subject, language } = req.body; // Add language parameter
  const plan = req.plan;
  const isArabic = language === 'ar';
  const free_usage = req.free_usage;
  try {
    console.log('reached the controller');

    if (!selectedCategory || !subject) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'يجب تحديد الموضوع + الفئة العمرية (طفل، مراهق، ..)'
          : 'You need to specify the subject + the age category (Child, Teenager, ..)',
      });
    }

    if (!ideaCategories.includes(selectedCategory)) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? `فئة عمرية غير صالحة، يجب أن تكون واحدة من: ${ideaCategories.join(
              ', '
            )}`
          : `Invalid Age Category, Must be one of: ${ideaCategories.join(
              ', '
            )}`,
      });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'تم الوصول إلى الحد المسموح. يرجى الترقية إلى الإصدار المميز لمواصلة استخدام التطبيق.'
          : 'Limit reached. Please upgrade to Premium to continue using our app.',
      });
    }

    // Determine response language
    const responseLanguage = isArabic ? 'Arabic' : 'English';

    // Enhanced category prompts with language support
    const categoryPrompts = {
      Child: isArabic
        ? 'اشرح هذا الموضوع كما لو كنت تشرح لطفل فضولي عمره 8 سنوات. استخدم كلمات بسيطة وأمثلة ممتعة، وربما قارنه بأشياء يعرفها الطفل مثل الألعاب أو الألوان أو الحيوانات.'
        : 'Explain this like you would to a curious 8-year-old child. Use simple words, fun examples, and maybe compare it to things they know like toys, games, or animals.',

      Teenager: isArabic
        ? 'اشرح هذا لمراهق. استخدم أمثلة من وسائل التواصل الاجتماعي والثقافة الشعبية أو الحياة المدرسية. اجعل الشرح جذابًا وغير رسمي جدًا.'
        : 'Explain this to a teenager. Use relatable examples from social media, pop culture, or school life. Keep it engaging and not too formal.',

      'Young Adult': isArabic
        ? 'اشرح هذا لشخص في أوائل العشرينات. استخدم أمثلة معاصرة وافترض وجود بعض الخبرة الحياتية الأساسية.'
        : 'Explain this to someone in their early twenties. Use contemporary examples and assume some basic life experience.',

      Adult: isArabic
        ? 'قدم شرحًا واضحًا وعمليًا يمكن للشخص البالغ العادي فهمه وتطبيقه في حياته اليومية.'
        : 'Provide a clear, practical explanation that an average adult can understand and apply in their daily life.',

      Student: isArabic
        ? 'اشرح هذا كما لو كان لطالب يحتاج إلى فهمه لأغراض أكاديمية. اشمل المفاهيم الرئيسية ونقاط التعلم المهمة.'
        : 'Explain this as if for a student who needs to understand it for academic purposes. Include key concepts and learning points.',

      Professional: isArabic
        ? 'قدم شرحًا على المستوى المهني مع سياق الصناعة والتطبيقات العملية في بيئة العمل.'
        : 'Provide a professional-level explanation with industry context and practical applications in a work environment.',

      Expert: isArabic
        ? 'أعط شرحًا شاملاً وتقنيًا يفترض معرفة عميقة في المجال. اشمل الفروق الدقيقة والمفاهيم المتقدمة.'
        : 'Give a comprehensive, technical explanation that assumes deep knowledge in the field. Include nuances and advanced concepts.',
    };

    // Create language-aware system prompt
    const languageInstruction = isArabic
      ? ' يجب أن تكون إجابتك باللغة العربية فقط, استخدم الفصحى العصرية و يمكن استخدام بعض الكلمات العامية الدارجة.'
      : 'Your response must be in English only.';

    const systemPrompt = `You are an expert communicator who can explain complex ideas to different audiences. ${categoryPrompts[selectedCategory]}

    IMPORTANT: ${languageInstruction}
    
    Format your response with clear structure and use markdown formatting where appropriate.`;

    const userPrompt = isArabic
      ? `من فضلك اشرح: ${subject}`
      : `Please explain: ${subject}`;

    // Enhanced API call with language consideration
    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500, // Increased for better explanations
      top_p: 0.9,
    });

    const content = response.choices[0].message.content;

    // Save to database
    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},${subject},${content},'simplified_idea')`;

    // Update free usages
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    // Send the response
    res.status(200).json({
      status: 'success',
      content,
      category: selectedCategory,
      subject,
      language: responseLanguage,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'error',
      message: isArabic
        ? `فشلت العملية: ${error.message}`
        : `Operation failed: ${error.message}`,
    });
  }
};

const generateImage = async (req, res) => {
  const userId = req.userId;
  const { prompt, style, publish, language } = req.body;
  const plan = req.plan;
  const isArabic = language === 'Arabic';
  try {
    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'يجب تقديم نص يصف ما تريد إنشاءه'
          : 'You need to provide a prompt describes what you need to generate',
      });
    }
    // we need to make this feature available only for preimum subscribtions
    if (plan !== 'premium') {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'عذرًا، إنشاء الصور متاح فقط للاشتراكات المميزة، يرجى الاشتراك في الخطة المميزة للمتابعة'
          : 'Sorry, Generating Images only supported on Premium subscriptions, Please subscribe to Premium plan to continue',
      });
    }
    const styleEnhancements = {
      Realistic: 'photorealistic, high quality, detailed',
      'Ghibli style':
        'Studio Ghibli style, anime, hand-drawn animation, beautiful scenery',
      'Anime style': 'anime style, manga, Japanese animation, vibrant colors',
      'Cartoon style': 'cartoon style, animated, colorful, fun',
      'Fantasy style': 'fantasy art, magical, ethereal, mystical',
      '3D style': '3D rendered, digital art, modern, clean',
      'Portrait style':
        'portrait photography, professional lighting, detailed face',
    };
    let enhancedPrompt = prompt;
    if (style && styleEnhancements[style]) {
      enhancedPrompt = `${prompt}, ${styleEnhancements[style]}`;
    }

    // Generating the image
    // openai does this but not for free
    // we will use Clipdrop api
    const form = new FormData();
    form.append('prompt', enhancedPrompt);
    // form.append('image_file', image);
    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      form,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );
    // we get image as binary , still need somewhere to save , so we will save it as Buffer
    // then convert it into string to send it later to the cloud
    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      'binary'
    ).toString('base64')}`;

    // uploading image to cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    // save creation into database
    await sql`INSERT INTO creations(user_id,prompt,content,type,publish) VALUES(${userId},${prompt},${secure_url},'image',${
      publish ?? false
    })`;
    // update free usages
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    // send the response
    res.status(200).json({
      status: 'success',
      content: secure_url,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 'error',
      message: isArabic
        ? `فشلت العملية: ${error.message}`
        : `Operation failed: ${error.message}`,
    });
  }
};
// Removebackground API
const removeBackground = async (req, res) => {
  const userId = req.userId;
  const image = req.file;
  const plan = req.plan;

  const language = req.body.language;
  const isArabic = language === 'Arabic';
  try {
    if (!image) {
      return res.status(400).json({
        status: 'error',
        message: isArabic ? 'يجب رفع صورة' : 'You need to provide an image',
      });
    }

    if (plan !== 'premium') {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'عذرًا، إزالة خلفية الصور متاحة فقط للاشتراكات المميزة'
          : 'Sorry, Removing Image Background only supported on Premium subscriptions',
      });
    }
    // Cloudinary removes background but it is not effiecient ,
    // there are a toll called cloudinary_ai but it is limitted
    //offers only 15 background removal on the free plan
    // that is why we are going to use Remove.bg API
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image_file', fs.createReadStream(image.path), {
      filename: image.originalname,
      contentType: image.mimitype,
    });
    form.append('size', 'auto');
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      form,
      {
        headers: {
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          ...form.getHeaders(),
        },
        responseType: 'arraybuffer',
      }
    );
    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString('base64')}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      resource_type: 'image',
      format: 'png',
    });
    //clearing temporary file
    fs.unlinkSync(image.path);
    // insert into database
    await sql`INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},'remove image background',${secure_url},'background_removal')`;
    // update free usages
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    // send the response
    res.status(200).json({
      status: 'success',
      content: secure_url,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: isArabic
        ? `فشلت إزالة الخلفية: ${error.message}`
        : `Background removal failed: ${error.message}`,
    });
  }
};

const transformContent = async (req, res) => {
  const userId = req.userId;
  const { content, platform, language } = req.body;

  const plan = req.plan;
  const free_usage = req.free_usage;
  const isArabic = language === 'ar';
  try {
    const responseLanguage = isArabic ? 'Arabic' : 'English';
    // Validation
    if (!content || !platform) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'المحتوى والمنصة مطلوبان'
          : 'Input content and platform are required',
      });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'تم الوصول إلى الحد المسموح. يرجى الترقية إلى الإصدار المميز لمواصلة استخدام التطبيق.'
          : 'Limit reached. Please upgrade to Premium to continue using our app.',
      });
    }

    // Platform-specific transformation prompts
    const platformPrompts = {
      instagram: isArabic
        ? `حول هذا المحتوى إلى منشور جذاب على إنستغرام. اجعله وصفيًا بصريًا، استخدم الإيموجي حيثما يناسب، أضف الهاشتاقات المناسبة، واجعله موجزًا لكن آسرًا. قم بتنسيقه لتحقيق أفضل تفاعل على إنستغرام. المحتوى المراد تحويله: "${content}"`
        : `Transform this content into an engaging Instagram post. Make it visually descriptive, use emojis where appropriate, include relevant hashtags, and keep it concise but captivating. Format it for optimal Instagram engagement. Content to transform: "${content}"`,

      linkedin: isArabic
        ? `حول هذا المحتوى إلى منشور احترافي على لينكدإن. استخدم نبرة احترافية، أضف رؤى صناعية، أضف هاشتاقات مهنية مناسبة، وقم بتنظيمه ليتناسب مع الشبكات المهنية. اجعله مفيدًا للمحترفين. المحتوى المراد تحويله: "${content}"`
        : `Transform this content into a professional LinkedIn post. Use a professional tone, include industry insights, add relevant professional hashtags, and structure it for business networking. Make it valuable for professionals. Content to transform: "${content}"`,

      facebook: isArabic
        ? `حول هذا المحتوى إلى منشور ودّي على فيسبوك. استخدم نبرة محادثة، اجعله جذابًا لجمهور واسع، أضف أسئلة لتشجيع التعليقات، وأضف الهاشتاقات المناسبة. المحتوى المراد تحويله: "${content}"`
        : `Transform this content into a friendly Facebook post. Use a conversational tone, make it engaging for a broad audience, include questions to encourage comments, and add relevant hashtags. Content to transform: "${content}"`,

      twitter: isArabic
        ? `حول هذا المحتوى إلى سلسلة تغريدات موجزة على تويتر. قم بتقسيمها إلى أجزاء بحجم التغريدة (280 حرفًا لكل منها)، استخدم الهاشتاقات بشكل استراتيجي، واجعله جذابًا للاستهلاك السريع. ابدأ بتغريدة رئيسية واستمر بالردود. المحتوى المراد تحويله: "${content}"`
        : `Transform this content into a concise Twitter thread. Break it into tweet-sized chunks (280 characters each), use hashtags strategically, make it engaging for quick consumption. Start with a main tweet and continue with replies. Content to transform: "${content}"`,

      tiktok: isArabic
        ? `حول هذا المحتوى إلى نص/وصف لفيديو تيك توك. اجعله عصريًا، استخدم لغة فيرالية، أضف جاذبية، أضف هاشتاقات ومقترحات صوت مناسبة. اجعله قصيرًا وجذابًا ومُحسّنًا لمحتوى الفيديو. المحتوى المراد تحويله: "${content}"`
        : `Transform this content into a TikTok video script/caption. Make it trendy, use viral language, include hooks, add relevant hashtags and sound suggestions. Keep it short, engaging and optimized for video content. Content to transform: "${content}"`,
    };
    let response;
    // Generate content for each selected platform
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Article generation attempt ${attempt}/3`);
        response = await openai.chat.completions.create({
          model: 'gemini-2.0-flash',
          messages: [
            {
              role: 'system',
              content: isArabic
                ? `أنت مدير وسائل تواصل اجتماعي خبير متخصص في إنشاء محتوى ${platform}. أنشئ محتوى جذابًا ومُحسنًا للمنصة يلقى صدى لدى الجمهور المستهدف.`
                : `You are an expert social media manager specializing in ${platform} content creation. Create engaging, platform-optimized content that resonates with the target audience.`,
            },
            {
              role: 'user',
              content: platformPrompts[platform],
            },
          ],
          temperature: 0.8, // Slightly higher temperature for creative variations
          max_tokens: 800,
          top_p: 0.9,
        });
        console.log('Article generation successful');
        break;
      } catch (apiError) {
        console.error(`Attempt ${attempt} failed:`, {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
        });

        if (attempt === 3) {
          throw new Error(
            `Failed after 3 attempts. Last error: ${apiError.message}`
          );
        }

        // Wait before retry (1s, 2s, 4s)
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message
    ) {
      return res.status(500).json({
        status: 'error',
        message: isArabic
          ? 'فشل الرد من واجهة الذكاء الاصطناعي، يرجى المحاولة مرة أخرى'
          : 'AI API failed to response try again',
      });
    }
    const result = response.choices[0].message.content;

    const type = `content_transform_${platform}`;

    await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${content}, ${result}, ${type})`;

    // Save each transformation to database

    // Update free usage for non-premium users
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1, // Count as one usage regardless of platform count
        },
      });
    }

    res.status(200).json({
      status: 'success',
      post: result,
      platform,
      originalContent: content,
    });
  } catch (error) {
    console.log('Content transformation error:', error.message);
    res.status(400).json({
      status: 'error',
      message: isArabic
        ? `فشل تحويل المحتوى: ${error.message}`
        : `Content transformation failed: ${error.message}`,
    });
  }
};

const reviewResume = async (req, res) => {
  const userId = req.userId;
  const resume = req.file;
  const language = req.body.language;
  const isArabic = language === 'Arabic';

  const plan = req.plan;
  try {
    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'تم الوصول إلى الحد المسموح. يرجى الترقية إلى الإصدار المميز لمواصلة استخدام التطبيق.'
          : 'Limit reached. Please upgrade to Premium to continue using our app.',
      });
    }
    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        status: 'error',
        message: isArabic
          ? 'الحد الأقصى المسموح به للملف هو (5 ميجابايت)، يرجى استخدام ملف بحجم أصغر'
          : 'The maximum size that is acceptable is (5MB) for the pdf file, use smaller sized file',
      });
    }
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);
    const prompt = isArabic
      ? `قم بمراجعة شاملة لهذه السيرة الذاتية وقم بتقييمها من 10 بناءً على:
  
🎯 **التأثير والوضوح** (30%):
- وضوح الهيكل وسهولة القراءة
- قوة البيان الشخصي/الملخص
- فعالية تنظيم المحتوى

📊 **الإنجازات والنتائج** (30%):
- التركيز على الإنجازات بدلاً من المهام الروتينية
- وجود نتائج قابلة للقياس وأرقام ملموسة
- استخدام أفعال قوية توضح التأثير

🔍 **تحسين نظام التوظيف الآلي** (25%):
- توافق الكلمات المفتاحية مع متطلبات الوظائف المستهدفة
- استخدام مصطلحات صناعية مناسبة
- تحسين لإرشادات أنظمة التتبع

🎨 **التنسيق والمظهر** (15%):
- نظافة التنسيق واحترافيته
- تناسق الخطوط والمسافات
- سهولة المسح الضوئي والقراءة

**المطلوب:**
1. قدم تقييمًا شاملًا من 10/10 مع تفصيل النقاط
2. اذكر 3 نقاط قوة رئيسية
3. اذكر 3 مجالات للتحسين
4. قدم توصيات عملية قابلة للتطبيق

**ملاحظة مهمة:** يجب أن يكون الرد باللغة العربية بالكامل.

السيرة الذاتية المراد مراجعتها:\n\n${pdfData.text}`
      : `Conduct a comprehensive review of this resume and provide a solid rating out of 10 based on:

🎯 **Impact & Clarity** (30%):
- Structure clarity and readability
- Strength of personal statement/summary
- Effective content organization

📊 **Achievements & Results** (30%):
- Focus on achievements vs routine duties
- Presence of measurable results and quantifiable data
- Use of strong action verbs demonstrating impact

🔍 **ATS Optimization** (25%):
- Keyword alignment with target job requirements
- Appropriate industry terminology
- Compliance with tracking system guidelines

🎨 **Formatting & Presentation** (15%):
- Clean and professional formatting
- Consistent fonts and spacing
- Easy scanning and readability

**Required:**
1. Provide overall rating out of 10 with detailed breakdown
2. List 3 key strengths
3. List 3 areas for improvement
4. Offer actionable, practical recommendations

**Important:** The response must be entirely in English.

Resume to review:\n\n${pdfData.text}`;
    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
    });
    const content = response.choices[0].message.content;
    // save to database
    await sql`INSERT INTO creations(user_id, prompt,content,type) VALUES(${userId},'Review This Resume',${content},'resume_review')`;
    // in case user has free plan we need to update usages on clerk
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.status(200).json({
      status: 'success',
      content,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 'error',
      message: isArabic
        ? `فشلت العملية: ${error.message}`
        : `Operation failed: ${error.message}`,
    });
  }
};

module.exports = {
  generateArticle,
  simplifyIdea,
  generateImage,
  removeBackground,
  transformContent,
  reviewResume,
};
