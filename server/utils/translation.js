const axios = require('axios');

const translateArabicToEnglish = async (text) => {
  try {
    const response = await axios.get(
      'https://api.mymemory.translated.net/get',
      {
        params: {
          q: text,
          langpair: 'ar|en',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const translatedText = response.data.responseData.translatedText;

    // If translation fails, return original text
    if (!translatedText || translatedText === text) {
      console.log('Translation returned original text, using fallback');
      return text;
    }

    console.log(`Translation: "${text}" -> "${translatedText}"`);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error.message);
    // Return original text if translation fails
    return text;
  }
};

module.exports = { translateArabicToEnglish };
