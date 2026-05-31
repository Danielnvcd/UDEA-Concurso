import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative text-white selection:bg-white selection:text-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Video de fondo fijo global */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <video
          className="w-full h-full object-cover object-top opacity-60 blur-md scale-105"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          src="/assets/nuevo-fondo.mp4"
        />
        {/* Overlays para integrarlo al diseño liquid-glass */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top, transparent 0%, transparent 50%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <div className="relative mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
