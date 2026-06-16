// Department of Education - Regional School Management System Types

// User & Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export type UserRole = 'super_admin' | 'regional_admin' | 'school_admin' | 'teacher' | 'staff';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// School Types
export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  principalName: string;
  establishedDate: string;
  status: 'active' | 'inactive';
  type: 'public' | 'private' | 'charter';
  studentCount: number;
  teacherCount: number;
  createdAt: string;
}

// Student Types
export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianRelationship: string;
  schoolId: string;
  schoolName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  photoUrl?: string;
  createdAt: string;
}

// Teacher Types
export interface Teacher {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  qualification: string;
  specialization: string;
  experience: number;
  joiningDate: string;
  schoolId: string;
  schoolName?: string;
  subjects: string[];
  status: 'active' | 'inactive' | 'on_leave';
  photoUrl?: string;
  createdAt: string;
}

// Class & Section Types
export interface Class {
  id: string;
  name: string;
  code: string;
  gradeLevel: number;
  schoolId: string;
  schoolName?: string;
  classTeacherId?: string;
  classTeacherName?: string;
  capacity: number;
  studentCount: number;
  academicYear: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Section {
  id: string;
  name: string;
  code: string;
  classId: string;
  className?: string;
  schoolId: string;
  schoolName?: string;
  roomNumber?: string;
  capacity: number;
  studentCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  schoolId: string;
  schoolName?: string;
  teacherIds: string[];
  teacherNames?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  studentId: string;
  studentName?: string;
  schoolId: string;
  schoolName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  academicYear: string;
  enrollmentDate: string;
  rollNumber: string;
  status: 'active' | 'completed' | 'dropped';
  createdAt: string;
}

// Grade Types
export interface Grade {
  id: string;
  studentId: string;
  studentName?: string;
  subjectId: string;
  subjectName?: string;
  classId: string;
  className?: string;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment' | 'project';
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  examDate: string;
  teacherId: string;
  teacherName?: string;
  academicYear: string;
  createdAt: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  studentName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  schoolId: string;
  schoolName?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  markedBy: string;
  markedByName?: string;
  createdAt: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'holiday';
  targetAudience: ('all' | 'students' | 'teachers' | 'parents' | 'staff')[];
  schoolId?: string;
  schoolName?: string;
  postedBy: string;
  postedByName?: string;
  publishDate: string;
  expiryDate?: string;
  status: 'draft' | 'published' | 'archived';
  attachments?: string[];
  createdAt: string;
}

// Report Types
export interface Report {
  id: string;
  name: string;
  type: 'enrollment' | 'attendance' | 'grades' | 'financial' | 'custom';
  description?: string;
  filters: Record<string, any>;
  generatedBy: string;
  generatedByName?: string;
  generatedAt: string;
  downloadUrl?: string;
  status: 'pending' | 'completed' | 'failed';
}

// Dashboard Statistics
export interface DashboardStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeEnrollments: number;
  averageAttendance: number;
  recentEnrollments: number;
  pendingApprovals: number;
}

// Settings Types
export interface SystemSettings {
  theme: 'light' | 'dark';
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  academicYear: string;
  gradingScale: GradingScale[];
}

export interface GradingScale {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  description?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface FilterParams {
  search?: string;
  status?: string;
  schoolId?: string;
  classId?: string;
  startDate?: string;
  endDate?: string;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: NavItem[];
  permissions?: string[];
}
