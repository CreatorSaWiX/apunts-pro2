import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import PageTransition from './components/ui/system/PageTransition';
import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion';
const loadFeatures = () => import('framer-motion').then(res => res.domMax);
import { AppProviders } from './contexts/AppProviders';
import Spinner from './components/ui/Spinner';
import { Analytics } from "@vercel/analytics/react";
import ProtectedRoute from './components/ProtectedRoute';
import { SWOfflineIndicator } from './components/ui/system/SWOfflineIndicator';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const SolutionsListPage = lazy(() => import('./pages/SolutionsListPage'));
const SolutionDetailPage = lazy(() => import('./pages/SolutionDetailPage'));

const QuizPage = lazy(() => import('./pages/QuizPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ChatBot = lazy(() => import('./components/chatbot/index').then(module => ({ default: module.ChatBot })));

const SuspendedPage = ({ children }: { children: React.ReactNode }) => (
  <PageTransition>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center w-full">
        <Spinner size="2xl" variant="primary" />
      </div>
    }>
      {children}
    </Suspense>
  </PageTransition>
);

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

            <Navigation />

            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/login" element={<SuspendedPage><LoginPage /></SuspendedPage>} />
                <Route path="/profile" element={<ProtectedRoute><SuspendedPage><ProfilePage /></SuspendedPage></ProtectedRoute>} />
                <Route path="/profile/:username" element={<ProtectedRoute><SuspendedPage><ProfilePage /></SuspendedPage></ProtectedRoute>} />
                <Route path="/tema/:id" element={<SuspendedPage><TopicPage /></SuspendedPage>} />
                <Route path="/tema/:id/test" element={<SuspendedPage><QuizPage /></SuspendedPage>} />
                <Route path="/tema/:id/solucionaris" element={<ProtectedRoute><SuspendedPage><SolutionsListPage /></SuspendedPage></ProtectedRoute>} />
                <Route path="/tema/:id/solucionaris/:problemId" element={<ProtectedRoute><SuspendedPage><SolutionDetailPage /></SuspendedPage></ProtectedRoute>} />
                <Route path="/comunitat" element={<ProtectedRoute><SuspendedPage><CommunityPage /></SuspendedPage></ProtectedRoute>} />
                <Route path="/register" element={<SuspendedPage><RegisterPage /></SuspendedPage>} />
                <Route path="/planner" element={<ProtectedRoute><SuspendedPage><PlannerPage /></SuspendedPage></ProtectedRoute>} />
                <Route path="/settings" element={<SuspendedPage><SettingsPage /></SuspendedPage>} />
              </Routes>
            </AnimatePresence>

            {import.meta.env.PROD && <Analytics />}
            {showChatBot && <Suspense fallback={null}><ChatBot /></Suspense>}
            <SWOfflineIndicator />
          </div>
        </LazyMotion>
      </MotionConfig>
    </AppProviders>
  );
}

export default App;
