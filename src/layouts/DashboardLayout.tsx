import { Outlet, NavLink, Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function DashboardLayout() {

  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', end: true },
    { to: '/dashboard/projects', icon: 'folder', label: 'Proyek Saya' },
    { to: '/dashboard/dataset', icon: 'database', label: 'Dataset' },
    { to: '/dashboard/settings', icon: 'settings', label: 'Pengaturan' },
  ];

  const renderMobileLink = (item: { to: string, icon: string, label: string, end?: boolean }) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 no-underline transition-colors ${
          isActive ? 'text-primary' : 'text-secondary'
        }`
      }
    >
      <span className="text-2xl material-symbols-outlined">{item.icon}</span>
      <span className="text-[10px] uppercase font-semibold tracking-wider">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-primary flex-col sticky top-0 h-screen z-10">
        <div className="p-8 border-b border-primary">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <Logo size="md" />
            <div className="text-2xl font-bold tracking-tighter uppercase text-primary">PRINTX</div>
          </Link>
        </div>
        <nav className="flex-1 py-6 flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-4 py-4 px-8 uppercase text-sm font-semibold tracking-wider transition-all ${
                  isActive
                    ? 'text-primary bg-surface-container-high border-l-4 border-primary'
                    : 'text-secondary border-l-4 border-transparent hover:bg-surface-container hover:text-primary'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-8 border-t border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-bold text-sm uppercase">JD</div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold">Jane Doe</div>
              <div className="text-[10px] uppercase text-secondary tracking-widest">Premium Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-24 lg:pb-0 min-w-0">
        {/* Mobile Header - Compact & Sticky */}
        <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-primary z-50 px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <Logo size="sm" />
            <div className="text-xl font-bold tracking-tighter uppercase text-primary">PRINTX</div>
          </Link>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-xl">search</button>
            <button className="material-symbols-outlined text-xl">account_circle</button>
          </div>
        </header>

        {/* Content provided by Routes */}
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-margin pt-8 md:pt-12">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary h-20 z-100 flex justify-around items-center px-4 pb-safe">
        {navItems.slice(0, 2).map(renderMobileLink)}
        {renderMobileLink({ to: '/dashboard/project/new', icon: 'add_box', label: 'Baru' })}
        {navItems.slice(2).map(renderMobileLink)}
      </nav>
    </div>
  );
}
