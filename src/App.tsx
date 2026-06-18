import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Background from './components/Background';
import { ChatBot } from './components/ChatBot';
import { PerformanceMonitor } from './components/ui/PerformanceMonitor';
// import FeedbackModal from './components/FeedbackModal';
import HomePage from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { SubjectProvider } from './contexts/SubjectContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
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

function App() {
  const location = useLocation();
  const showChatBot = location.pathname.startsWith('/tema/');

  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          <SubjectProvider>
            <div className="min-h-screen text-slate-200 selection:bg-primary/30 font-sans relative">

              <Background />
              <PerformanceMonitor />
              <Navigation />
              {/* <FeedbackModal /> */}

              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center relative z-10 w-full">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:uid" element={<ProfilePage />} />
                  <Route path="/new-solution" element={<NewSolutionPage />} />
                  <Route path="/tema/:id" element={<TopicPage />} />
                  <Route path="/tema/:id/test" element={<QuizPage />} />
                  <Route path="/tema/:id/solucionaris" element={<SolutionsListPage />} />
                  <Route path="/tema/:id/solucionaris/:problemId" element={<SolutionDetailPage />} />
                  <Route path="/comunitat" element={<CommunityPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Suspense>

              <Analytics />
              {showChatBot && <ChatBot />}
            </div>
          </SubjectProvider>
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
