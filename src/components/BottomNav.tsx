import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', icon: LayoutDashboard, path: '/' },
    { name: 'Students', icon: Users, path: '/students' },
    { name: 'Content', icon: BookOpen, path: '/content' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]/50 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-full ${isActive ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]' : ''}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
