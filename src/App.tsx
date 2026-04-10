import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Background from './components/Background';
// import { PerformanceMonitor } from './components/ui/PerformanceMonitor';
import FeedbackModal from './components/FeedbackModal';

// LACY LOADING PAGES: Split the gigantic React bundle into tiny specific chunks 
// This allows the browser to show the initial HTML / FCP (First Contentful Paint) immediately on mobile
import HomePage from './pages/HomePage';
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const SolutionsListPage = lazy(() => import('./pages/SolutionsListPage'));
const SolutionDetailPage = lazy(() => import('./pages/SolutionDetailPage'));
const NewSolutionPage = lazy(() => import('./pages/NewSolutionPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
import { AuthProvider } from './contexts/AuthContext';
import { SubjectProvider } from './contexts/SubjectContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <LanguageProvider>
      <SubjectProvider>
      <AuthProvider>
        <div className="min-h-screen text-slate-200 selection:bg-primary/30 font-sans relative">

          <Background />
          {/* <PerformanceMonitor /> */}
          <Navigation />
          <FeedbackModal />

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
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
          <Analytics />
          {/* <SpeedInsights /> */}
        </div>
      </AuthProvider>
    </SubjectProvider>
    </LanguageProvider>
  );
}

export default App;
