import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Background from './components/Background';
// import { PerformanceMonitor } from './components/ui/PerformanceMonitor';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TopicPage from './pages/TopicPage';
import SolutionsListPage from './pages/SolutionsListPage';
import SolutionDetailPage from './pages/SolutionDetailPage';
import NewSolutionPage from './pages/NewSolutionPage';
import QuizPage from './pages/QuizPage';
import { AuthProvider } from './contexts/AuthContext';
import { SubjectProvider } from './contexts/SubjectContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <SubjectProvider>
      <AuthProvider>
        <div className="min-h-screen text-slate-200 selection:bg-primary/30 font-sans relative">

          <Background />
          {/* <PerformanceMonitor /> */}
          <Navigation />

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
          <Analytics />
          <SpeedInsights />
        </div>
      </AuthProvider>
    </SubjectProvider>
  );
}

export default App;
