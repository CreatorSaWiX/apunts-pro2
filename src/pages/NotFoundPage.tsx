import SphereParticles404 from '../components/not-found/SphereParticles404';

const NotFoundPage = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#252028] z-0">
      <SphereParticles404 className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default NotFoundPage;
