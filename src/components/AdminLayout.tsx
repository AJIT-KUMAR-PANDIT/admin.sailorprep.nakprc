import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--color-surface-container-low)] overflow-hidden font-sans">
      {/* Hide Sidebar on mobile (md and smaller) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <TopBar />
        
        {/* Add bottom padding on mobile to account for BottomNav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 relative w-full">
          {/* Animated Blob Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary-container)] opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob -z-10"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-[var(--color-tertiary-container)] opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>
          
          <Outlet />
        </main>
        
        {/* Show BottomNav only on mobile */}
        <BottomNav />
      </div>
    </div>
  );
};

export default AdminLayout;
