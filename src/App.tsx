import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import TopicPage from './components/TopicPage';
import Background from './components/Background';
import TopicCarousel from './components/TopicCarousel';
import SolutionsListPage from './components/SolutionsListPage';
import SolutionDetailPage from './components/SolutionDetailPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import NewSolutionPage from './components/NewSolutionPage';
import { AuthProvider } from './contexts/AuthContext';

const HomePage = () => {
  // Lock scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="h-screen w-full relative z-10 flex flex-col overflow-hidden">

      {/* Top: Compact Hero */}
      <div className="flex-none pt-10 z-20 pointer-events-none">
        {/* Make Hero text clickable but container passive */}
        <div className="pointer-events-auto">
          <Hero />
        </div>
      </div>

      {/* Middle: Carousel Area */}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col justify-center -mt-4 pb-16">
        <TopicCarousel />
      </div>

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen text-slate-200 selection:bg-sky-500/30 font-sans relative">

        <Background />
        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:uid" element={<ProfilePage />} />
          <Route path="/new-solution" element={<NewSolutionPage />} />
          <Route path="/tema/:id" element={<TopicPage />} />
          <Route path="/tema/:id/solucionaris" element={<SolutionsListPage />} />
          <Route path="/tema/:id/solucionaris/:problemId" element={<SolutionDetailPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
