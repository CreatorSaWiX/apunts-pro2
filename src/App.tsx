import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Background from './components/Background';
// import { PerformanceMonitor } from './components/ui/PerformanceMonitor';
// import FeedbackModal from './components/FeedbackModal';
import HomePage from './pages/HomePage';
import PageTransition from './components/ui/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { AppProviders } from './contexts/AppProviders';
import Spinner from './components/ui/Spinner';
import { Analytics } from "@vercel/analytics/react";

import { ConsentBanner } from './components/ui/ConsentBanner';
import { UpdateManager } from './components/ui/UpdateManager';

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
const ChatBot = lazy(() => import('./components/ChatBot').then(module => ({ default: module.ChatBot })));

function App() {
  const location = useLocation();
  const showChatBot = location.pathname.startsWith('/tema/');
  const hasAnalyticsConsent = localStorage.getItem('analytics-consent') === 'granted';

  return (
    <AppProviders>
      <div className="min-h-screen text-slate-200 selection:bg-primary/30 font-sans relative">
        <Background />
        {/* <PerformanceMonitor /> */}
        <Navigation />
        {/* <FeedbackModal /> */}

        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center relative z-10 w-full">
            <Spinner size="2xl" variant="primary" />
          </div>
        }>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/profile/:uid" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/new-solution" element={<PageTransition><NewSolutionPage /></PageTransition>} />
            <Route path="/tema/:id" element={<PageTransition><TopicPage /></PageTransition>} />
            <Route path="/tema/:id/test" element={<PageTransition><QuizPage /></PageTransition>} />
            <Route path="/tema/:id/solucionaris" element={<PageTransition><SolutionsListPage /></PageTransition>} />
            <Route path="/tema/:id/solucionaris/:problemId" element={<PageTransition><SolutionDetailPage /></PageTransition>} />
            <Route path="/comunitat" element={<PageTransition><CommunityPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/planner" element={<PageTransition><PlannerPage /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        </Suspense>

        {import.meta.env.PROD && hasAnalyticsConsent && <Analytics />}
        <ConsentBanner />
        <UpdateManager />
        {showChatBot && <ChatBot />}
      </div>
    </AppProviders>
  );
}

export default App;
