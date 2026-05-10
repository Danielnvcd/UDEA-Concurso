import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Global Background System */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-[#070b0a]" />
        {/* Grid System */}
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-white/[0.03]" />
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/[0.03]" />
          <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-white/[0.03]" />
        </div>
        {/* Central Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96">
          <div 
            className="absolute inset-0 rounded-[100%]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 58, 138, 0.15) 0%, transparent 70%)',
              filter: 'blur(35px)',
            }}
          />
        </div>
      </div>

      <Navbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
