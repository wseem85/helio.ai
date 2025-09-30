import React, { useContext, useState } from 'react';
// import { AdminContext, DoctorContext } from '../context/contexts';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  Eraser,
  FileUser,
  Hash,
  Image,
  LayoutDashboard,
  Lightbulb,
  Menu,
  PanelRightClose,
  PenLine,
  Repeat2,
  Scissors,
  Users,
} from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

// import { assets } from '../assets/assets';

const SideBar = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const { isRTL, t, getFlexDirection } = useLanguage();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed z-20 
          ${isRTL ? 'right-0' : 'left-0'}
          top-16 md:top-20
          w-60 xl:w-64
          h-screen
          bg-black-medium/95 backdrop-blur-sm
          border-r border-white/10
          overflow-y-auto
          transition-all duration-300 ease-in-out`}
      >
        <nav className="p-4 space-y-2">
          <NavLink
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai'}
            onClick={() => scrollTo(0, 0)}
          >
            <LayoutDashboard size={20} />
            <span>{t('navigation.dashboard')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/generate-article'}
            onClick={() => scrollTo(0, 0)}
          >
            <PenLine size={20} />
            <span>{t('navigation.generateArticle')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/simplify-idea'}
            onClick={() => scrollTo(0, 0)}
          >
            <Lightbulb size={20} />
            <span>{t('navigation.simplifyIdea')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/generate-image'}
            onClick={() => scrollTo(0, 0)}
          >
            <Image size={20} />
            <span>{t('navigation.generateImages')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/remove-background'}
            onClick={() => scrollTo(0, 0)}
          >
            <Eraser size={20} />
            <span>{t('navigation.removeBackground')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/content-transformer'}
            onClick={() => scrollTo(0, 0)}
          >
            <Repeat2 size={20} />
            <span>{t('navigation.contentTransformer')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-e-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/analayse-resume'}
            onClick={() => scrollTo(0, 0)}
          >
            <FileUser size={20} />
            <span>{t('navigation.analyzeResume')}</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              text-sm md:text-base font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-brand/20 text-brand border-l-4 border-brand'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
            to={'/ai/community'}
            onClick={() => scrollTo(0, 0)}
          >
            <Users size={20} />
            <span>{t('navigation.community')}</span>
          </NavLink>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <div
        className={`md:hidden fixed top-20 ${
          isRTL ? 'right-4' : 'left-4'
        } z-30`}
      >
        <motion.button
          onClick={() => setShowSideBar(true)}
          className="p-2 rounded-lg bg-brand-dark backdrop-blur-sm cursor 
            border border-white/10 hover:bg-brand hover:text-white
            transition-all duration-200"
          animate={{
            x: [0, 3, 0], // Subtle movement animation
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={18} />
        </motion.button>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <AnimatePresence>
          {showSideBar && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSideBar(false)}
                className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40"
              />

              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: isRTL ? 300 : -300 }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? 300 : -300 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                }}
                className={`fixed top-16 ${isRTL ? 'right-0' : 'left-0'} 
                  h-screen w-72 z-50
                  bg-black-medium/98 backdrop-blur-md
                  border-r border-white/10
                  overflow-y-auto`}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <button
                    onClick={() => setShowSideBar(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <PanelRightClose size={18} />
                  </button>
                </div>

                <nav className="p-4 space-y-2">
                  <NavLink
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <LayoutDashboard size={18} />
                    <span>{t('navigation.dashboard')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/generate-article'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <PenLine size={18} />
                    <span>{t('navigation.generateArticle')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/simplify-idea'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <Lightbulb size={18} />
                    <span>{t('navigation.simplifyIdea')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/generate-image'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <Image size={18} />
                    <span>{t('navigation.generateImages')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/remove-background'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <Eraser size={18} />
                    <span>{t('navigation.removeBackground')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/content-transformer'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <Repeat2 size={18} />
                    <span>{t('navigation.contentTransformer')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/analayse-resume'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <FileUser size={18} />
                    <span>{t('navigation.analyzeResume')}</span>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                    to={'/ai/community'}
                    onClick={() => {
                      setShowSideBar(false);
                      scrollTo(0, 0);
                    }}
                  >
                    <Users size={18} />
                    <span>{t('navigation.community')}</span>
                  </NavLink>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SideBar;
