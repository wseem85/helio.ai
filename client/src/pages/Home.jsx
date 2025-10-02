import React from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import Hero from '../components/Hero';
import OurAiTools from '../components/OurAiTools';
import { Testimonial } from '../components/Testimonial';
import { Helmet } from 'react-helmet';
import Plans from '../components/Plans';
import Footer from '../components/Footer';
import useLanguage from '../hooks/useLanguage';

const Home = () => {
  const { t } = useLanguage();
  const imageUrl =
    window.location.hostname === 'localhost'
      ? '/helio-og-image.png'
      : 'https://helio-ai-nu.vercel.app//helio-og-image.png';
  return (
    <div>
      <Helmet>
        <title>{t('seoContent.home.title')}</title>
        <meta name="description" content={t('seoContent.home.description')} />
        <meta name="keywords" content={t('seoContent.home.keywords')} />

        {/* Open Graph */}
        <meta property="og:title" content={t('seoContent.home.ogTitle')} />
        <meta
          property="og:description"
          content={t('seoContent.home.ogDescription')}
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content="https://helio-ai-nu.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seoContent.home.ogTitle')} />
        <meta
          name="twitter:description"
          content={t('seoContent.home.ogDescription')}
        />
        <meta name="twitter:image" content={imageUrl} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://helio-ai-nu.vercel.app" />
      </Helmet>
      <Navbar />
      <Hero />
      <div className="max-w-6xl mx-auto">
        <OurAiTools />
        <Testimonial />
        <Plans />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
