import React from 'react';
import { AiToolsData } from '../assets/assets';
import ToolBox from './ToolBox';
import { Lightbulb, NotebookPen, Repeat2 } from 'lucide-react';

import useLanguage from '../hooks/useLanguage';

const OurAiTools = () => {
  const { t, isRTL } = useLanguage();
  return (
    <div className="mt-8 px-2 sm:mx-4 py-4 space-y-2">
      <h2 className="text-3xl tracking-widest text-center">
        {t('tools.heading')}
      </h2>
      <p className="text-white/80 tracking-wide text-center">
        {t('tools.desc')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 lg:gap-8 mx-8 px-6 place-items-center">
        <ToolBox
          title={t('tools.aiArticleWriter.title')}
          description={t('tools.aiArticleWriter.description')}
          path="/ai/generate-article"
        >
          <NotebookPen
            className="w-12 h-12   p-3 rounded-xl"
            style={{
              background: `linear-gradient(to right,#cc2b5e,#753a88)`,
              color: 'white',
            }}
          />
        </ToolBox>
        <ToolBox
          title={t('tools.simplifyIdea.title')}
          description={t('tools.simplifyIdea.description')}
          path="/ai/simplify-idea"
        >
          <Lightbulb
            className="w-12 h-12   p-3 rounded-xl"
            style={{
              background: `linear-gradient(to right,#2193b0,#6dd5ed)`,
              color: 'white',
            }}
          />
        </ToolBox>
        <ToolBox
          title={t('tools.aiImageGeneration.title')}
          description={t('tools.aiImageGeneration.description')}
          path="/ai/generate-image"
        >
          <NotebookPen
            className="w-12 h-12   p-3 rounded-xl"
            style={{
              background: `linear-gradient(to right,#20C363,#099c69)`,
              color: 'white',
            }}
          />
        </ToolBox>
        <ToolBox
          title={t('tools.backgroundRemoval.title')}
          description={t('tools.backgroundRemoval.description')}
          path="/ai/remove-background"
        >
          <NotebookPen
            className="w-12 h-12   p-3 rounded-xl"
            style={{
              background: `linear-gradient(to right,#de6262,#ffb88c)`,
              color: 'white',
            }}
          />
        </ToolBox>
        <ToolBox
          title={t('tools.contentTransformer.title')}
          description={t('tools.contentTransformer.description')}
          path="/ai/content-transformer"
        >
          <Repeat2
            className="w-12 h-12   p-3 rounded-xl"
            style={{
              background: `linear-gradient(to right,#ff512f,#dd2476)`,
              color: 'white',
            }}
          />
        </ToolBox>
        <ToolBox
          title={t('tools.resumeReviewer.title')}
          description={t('tools.resumeReviewer.description')}
          path="/ai/analayse-resume"
        >
          <NotebookPen
            className="w-12 h-12   p-3 rounded-xl"
            style={{
              background: `linear-gradient(to right,#614385,#516395)`,
              color: 'white',
            }}
          />
        </ToolBox>
      </div>
    </div>
  );
};

export default OurAiTools;
