import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          'lg:ml-20',
          !isCollapsed && 'lg:ml-64'
        )}
      >
        <Header />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© 2024 Department of Education. All rights reserved.</p>
            <p>Regional School Management System v1.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
