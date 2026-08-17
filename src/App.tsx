import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
// import { PerformanceMonitor } from './components/ui/system/PerformanceMonitor';
import HomePage from './pages/HomePage';
import PageTransition from './components/ui/system/PageTransition';
import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion';
const loadFeatures = () => import('framer-motion').then(res => res.domMax);
import { AppProviders } from './contexts/AppProviders';
import Spinner from './components/ui/Spinner';
import { Analytics } from "@vercel/analytics/react";

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const SolutionsListPage = lazy(() => import('./pages/SolutionsListPage'));
const SolutionDetailPage = lazy(() => import('./pages/SolutionDetailPage'));
const NewSolutionPage = lazy(() => import('./pages/NewSolutionPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ChatBot = lazy(() => import('./components/chatbot/index').then(module => ({ default: module.ChatBot })));

function App() {
  const location = useLocation();
  const showChatBot = location.pathname.startsWith('/tema/');

  // Force reload if new version is available
  useEffect(() => {
    const handlePreloadError = () => { window.location.reload(); };
    window.addEventListener('vite:preloadError', handlePreloadError as EventListener);
    return () => { window.removeEventListener('vite:preloadError', handlePreloadError as EventListener); };
  }, []);

  return (
    <AppProviders>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadFeatures} strict>
          <div className="min-h-screen text-slate-200 selection:bg-primary/30 font-sans relative">
    
            {/* <PerformanceMonitor /> */}
            <Navigation />

            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><LoginPage /></Suspense></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><ProfilePage /></Suspense></PageTransition>} />
                <Route path="/profile/:username" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><ProfilePage /></Suspense></PageTransition>} />
                <Route path="/new-solution" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><NewSolutionPage /></Suspense></PageTransition>} />
                <Route path="/tema/:id" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><TopicPage /></Suspense></PageTransition>} />
                <Route path="/tema/:id/test" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><QuizPage /></Suspense></PageTransition>} />
                <Route path="/tema/:id/solucionaris" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><SolutionsListPage /></Suspense></PageTransition>} />
                <Route path="/tema/:id/solucionaris/:problemId" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><SolutionDetailPage /></Suspense></PageTransition>} />
                <Route path="/comunitat" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><CommunityPage /></Suspense></PageTransition>} />
                <Route path="/register" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><RegisterPage /></Suspense></PageTransition>} />
                <Route path="/planner" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><PlannerPage /></Suspense></PageTransition>} />
                <Route path="/settings" element={<PageTransition><Suspense fallback={<div className="min-h-screen flex items-center justify-center w-full"><Spinner size="2xl" variant="primary" /></div>}><SettingsPage /></Suspense></PageTransition>} />
              </Routes>
            </AnimatePresence>

            {import.meta.env.PROD && <Analytics />}
            {showChatBot && <Suspense fallback={null}><ChatBot /></Suspense>}
          </div>
        </LazyMotion>
      </MotionConfig>
    </AppProviders>
  );
}

export default App;
