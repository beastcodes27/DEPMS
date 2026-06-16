// Data Service for CRUD Operations
import type {
  User, School, Student, Teacher, Class, Section, Subject,
  Enrollment, Grade, Attendance, Announcement, Report, DashboardStats,
  Role, SystemSettings, PaginationParams, FilterParams, PaginatedResponse
} from '@/types';

import {
  users, schools, students, teachers, classes, sections, subjects,
  enrollments, grades, attendance, announcements, reports, dashboardStats,
  roles, systemSettings, currentUser
} from '@/data/mockData';

// Generic CRUD Service Class
class CRUDService<T extends { id: string }> {
  private data: T[];

  constructor(initialData: T[]) {
    this.data = [...initialData];
  }

  // Get all items with optional filtering and pagination
  getAll(params?: PaginationParams & FilterParams): PaginatedResponse<T> {
    let result = [...this.data];

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply status filter
    if (params?.status) {
      result = result.filter(item => (item as any).status === params.status);
    }

    // Apply school filter
    if (params?.schoolId) {
      result = result.filter(item => (item as any).schoolId === params.schoolId);
    }

    // Apply class filter
    if (params?.classId) {
      result = result.filter(item => (item as any).classId === params.classId);
    }

    // Apply date range filter
    if (params?.startDate && params?.endDate) {
      result = result.filter(item => {
        const itemDate = new Date((item as any).createdAt || (item as any).date);
        return itemDate >= new Date(params.startDate!) && itemDate <= new Date(params.endDate!);
      });
    }

    const total = result.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    // Apply sorting
    if (params?.sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[params.sortBy!];
        const bValue = (b as any)[params.sortBy!];
        if (params.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get item by ID
  getById(id: string): T | undefined {
    return this.data.find(item => item.id === id);
  }

  // Create new item
  create(item: Omit<T, 'id' | 'createdAt'>): T {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    } as unknown as T;
    this.data.push(newItem);
    return newItem;
  }

  // Update item
  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates };
      return this.data[index];
    }
    return undefined;
  }

  // Delete item
  delete(id: string): boolean {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get count
  getCount(): number {
    return this.data.length;
  }
}

// Initialize services for each entity
export const userService = new CRUDService<User>(users);
export const schoolService = new CRUDService<School>(schools);
export const studentService = new CRUDService<Student>(students);
export const teacherService = new CRUDService<Teacher>(teachers);
export const classService = new CRUDService<Class>(classes);
export const sectionService = new CRUDService<Section>(sections);
export const subjectService = new CRUDService<Subject>(subjects);
export const enrollmentService = new CRUDService<Enrollment>(enrollments);
export const gradeService = new CRUDService<Grade>(grades);
export const attendanceService = new CRUDService<Attendance>(attendance);
export const announcementService = new CRUDService<Announcement>(announcements);
export const reportService = new CRUDService<Report>(reports);
export const roleService = new CRUDService<Role>(roles);

// Dashboard Service
export const dashboardService = {
  getStats: (): DashboardStats => dashboardStats,

  getRecentActivity: () => {
    return [
      { id: '1', action: 'New student enrolled', user: 'John Smith', time: '2 minutes ago', type: 'enrollment' },
      { id: '2', action: 'Grade updated', user: 'Sarah Johnson', time: '15 minutes ago', type: 'grade' },
      { id: '3', action: 'Attendance marked', user: 'Michael Brown', time: '1 hour ago', type: 'attendance' },
      { id: '4', action: 'New announcement posted', user: 'Regional Admin', time: '2 hours ago', type: 'announcement' },
      { id: '5', action: 'School profile updated', user: 'John Smith', time: '3 hours ago', type: 'school' },
    ];
  },

  getUpcomingEvents: () => {
    return [
      { id: '1', title: 'Parent-Teacher Conference', date: '2024-12-18', type: 'event' },
      { id: '2', title: 'Winter Break Begins', date: '2024-12-23', type: 'holiday' },
      { id: '3', title: 'Teacher Training Workshop', date: '2025-01-15', type: 'training' },
      { id: '4', title: 'Midterm Examinations', date: '2025-01-20', type: 'exam' },
    ];
  },
};

// Settings Service
export const settingsService = {
  getSettings: (): SystemSettings => systemSettings,

  updateSettings: (updates: Partial<SystemSettings>): SystemSettings => {
    Object.assign(systemSettings, updates);
    return systemSettings;
  },

  updateTheme: (theme: 'light' | 'dark'): void => {
    systemSettings.theme = theme;
  },
};

// Auth Service
export const authService = {
  getCurrentUser: (): User => currentUser,

  login: (email: string, _password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const user = users.find(u => u.email === email);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  },

  logout: (): Promise<void> => {
    return Promise.resolve();
  },
};

// Export all services
export default {
  users: userService,
  schools: schoolService,
  students: studentService,
  teachers: teacherService,
  classes: classService,
  sections: sectionService,
  subjects: subjectService,
  enrollments: enrollmentService,
  grades: gradeService,
  attendance: attendanceService,
  announcements: announcementService,
  reports: reportService,
  roles: roleService,
  dashboard: dashboardService,
  settings: settingsService,
  auth: authService,
};
