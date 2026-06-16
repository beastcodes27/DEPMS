import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { Schools } from '@/pages/Schools';
import { Students } from '@/pages/Students';
import { Teachers } from '@/pages/Teachers';
import { Classes } from '@/pages/Classes';
import { Subjects } from '@/pages/Subjects';
import { Enrollments } from '@/pages/Enrollments';
import { Grades } from '@/pages/Grades';
import { Attendance } from '@/pages/Attendance';
import { Reports } from '@/pages/Reports';
import { Announcements } from '@/pages/Announcements';
import { Users } from '@/pages/Users';
import { Roles } from '@/pages/Roles';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="schools" element={<Schools />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="classes" element={<Classes />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="enrollments" element={<Enrollments />} />
              <Route path="grades" element={<Grades />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="users" element={<Users />} />
              <Route path="roles" element={<Roles />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              borderRadius: '12px',
            },
          }}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
