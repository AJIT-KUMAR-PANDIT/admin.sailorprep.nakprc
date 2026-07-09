import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--color-surface-container-low)] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Animated Blob Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary-container)] opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob -z-10"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-[var(--color-tertiary-container)] opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
