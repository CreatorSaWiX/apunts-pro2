import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SphereParticles404 from '../components/not-found/SphereParticles404';
import SphereParticles404Tweaks from '../components/not-found/SphereParticles404Tweaks';
import type { SphereParticles404API } from '../components/not-found/types';

const NotFoundPage = () => {
  const [api, setApi] = useState<SphereParticles404API | null>(null);
  const location = useLocation();

  // Show GUI only when URL ends with /test or has ?test
  const isTestMode = location.pathname.endsWith('/test') || location.search.includes('test');

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
      <SphereParticles404
        onReady={setApi}
        showStats={isTestMode}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
      {isTestMode && api && <SphereParticles404Tweaks api={api} />}
    </div>
  );
};

export default NotFoundPage;
