import { Search, Bell } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="h-20 glass-panel sticky top-0 z-10 flex items-center justify-between px-8 border-b border-[var(--color-outline-variant)]">
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-outline)]">
          <Search size={20} />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-[var(--color-outline-variant)] rounded-full bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] placeholder-[var(--color-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
          placeholder="Search students, tests, pyq..."
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all relative cursor-pointer">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--color-error)] rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-[var(--color-outline-variant)] mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-[var(--color-surface-variant)] transition-all">
          <div className="w-10 h-10 rounded-full bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] flex items-center justify-center font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--color-on-surface)]">Admin User</span>
            <span className="text-xs text-[var(--color-outline)]">Superadmin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
