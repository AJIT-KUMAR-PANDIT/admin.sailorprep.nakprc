import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Ship } from 'lucide-react';
import { pb } from '../lib/pb';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Students', icon: Users, path: '/students' },
    { name: 'Content', icon: BookOpen, path: '/content' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 glass-panel h-screen sticky top-0 flex flex-col border-r border-[var(--color-outline-variant)]">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[var(--color-primary)] text-[var(--color-on-primary)] p-2 rounded-xl">
          <Ship size={24} />
        </div>
        <h1 className="text-xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-md)' }}>
          SailorPrep <span className="text-[var(--color-primary)]">Admin</span>
        </h1>
      </div>
      
      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] premium-shadow'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--color-outline-variant)]">
        <button 
          onClick={() => pb.authStore.clear()}
          className="flex items-center gap-3 px-4 py-3 w-full text-[var(--color-error)] hover:bg-[var(--color-error-container)] hover:text-[var(--color-on-error-container)] rounded-xl transition-all font-medium cursor-pointer"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
