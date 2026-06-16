import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/crud/PageHeader';
import { DataTable } from '@/components/crud/DataTable';
import { SearchFilter } from '@/components/crud/SearchFilter';
import { Pagination } from '@/components/crud/Pagination';
import { CRUDModal } from '@/components/crud/CRUDModal';
import { DeleteConfirmation } from '@/components/crud/DeleteConfirmation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { enrollmentService, studentService, schoolService, classService, sectionService } from '@/services/dataService';
import type { Enrollment } from '@/types';
import { toast } from 'sonner';

export function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Enrollment>>({
    studentId: '',
    schoolId: '',
    classId: '',
    sectionId: '',
    academicYear: '2024-2025',
    rollNumber: '',
    status: 'active',
  });

  useEffect(() => {
    const allStudents = studentService.getAll({ limit: 100 });
    setStudents(allStudents.data.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}` })));

    const allSchools = schoolService.getAll({ limit: 100 });
    setSchools(allSchools.data.map(s => ({ id: s.id, name: s.name })));
  }, []);

  useEffect(() => {
    if (schoolFilter || formData.schoolId) {
      const allClasses = classService.getAll({
        schoolId: schoolFilter || formData.schoolId,
        limit: 100
      });
      setClasses(allClasses.data.map(c => ({ id: c.id, name: c.name })));
    }
  }, [schoolFilter, formData.schoolId]);

  useEffect(() => {
    if (formData.classId) {
      const allSections = sectionService.getAll({
        classId: formData.classId,
        limit: 100
      });
      setSections(allSections.data.map(s => ({ id: s.id, name: s.name })));
    }
  }, [formData.classId]);

  const fetchEnrollments = () => {
    setLoading(true);
    const result = enrollmentService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
      schoolId: schoolFilter,
    });
    setEnrollments(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
  }, [page, limit, search, statusFilter, schoolFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedEnrollment(null);
    setFormData({
      studentId: '',
      schoolId: '',
      classId: '',
      sectionId: '',
      academicYear: '2024-2025',
      rollNumber: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (enrollment: Enrollment) => {
    setModalMode('edit');
    setSelectedEnrollment(enrollment);
    setFormData({ ...enrollment });
    setIsModalOpen(true);
  };

  const handleView = (enrollment: Enrollment) => {
    setModalMode('view');
    setSelectedEnrollment(enrollment);
    setFormData({ ...enrollment });
    setIsModalOpen(true);
  };

  const handleDelete = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const enrollmentData = {
        ...formData,
        studentId: formData.studentId || '',
        schoolId: formData.schoolId || '',
        classId: formData.classId || '',
        sectionId: formData.sectionId || '',
        academicYear: formData.academicYear || '2024-2025',
        rollNumber: formData.rollNumber || '',
        status: formData.status || 'active',
        enrollmentDate: new Date().toISOString().split('T')[0],
      };

      if (modalMode === 'create') {
        enrollmentService.create(enrollmentData);
        toast.success('Student enrolled successfully');
      } else {
        if (selectedEnrollment) {
          enrollmentService.update(selectedEnrollment.id, enrollmentData);
          toast.success('Enrollment updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchEnrollments();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedEnrollment) {
        enrollmentService.delete(selectedEnrollment.id);
        toast.success('Enrollment deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchEnrollments();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSchoolFilter('');
    setPage(1);
  };

  const columns = [
    { key: 'rollNumber', header: 'Roll #', width: '80px' },
    { key: 'studentName', header: 'Student Name' },
    { key: 'schoolName', header: 'School' },
    { key: 'className', header: 'Class' },
    { key: 'sectionName', header: 'Section' },
    { key: 'academicYear', header: 'Academic Year', width: '120px' },
    { key: 'enrollmentDate', header: 'Enrollment Date', width: '130px' },
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Enrollment Management"
        description="Manage student enrollments in classes and sections"
        onAdd={handleAdd}
        addButtonLabel="New Enrollment"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search enrollments..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'dropped', label: 'Dropped' },
              ],
              value: statusFilter,
              onChange: setStatusFilter,
            },
            {
              key: 'school',
              label: 'School',
              options: schools.map(s => ({ value: s.id, label: s.name })),
              value: schoolFilter,
              onChange: setSchoolFilter,
            },
          ]}
          onClearFilters={clearFilters}
          showClearButton={true}
        />
      </div>

      <DataTable
        data={enrollments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No enrollments found"
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        totalItems={total}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
      />

      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enrollment"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
              disabled={modalMode === 'view'}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id} className="rounded-lg">
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolId">School *</Label>
            <Select
              value={formData.schoolId}
              onValueChange={(value) => setFormData({ ...formData, schoolId: value, classId: '', sectionId: '' })}
              disabled={modalMode === 'view'}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id} className="rounded-lg">
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="classId">Class *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value, sectionId: '' })}
                disabled={modalMode === 'view' || !formData.schoolId}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id} className="rounded-lg">
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionId">Section *</Label>
              <Select
                value={formData.sectionId}
                onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                disabled={modalMode === 'view' || !formData.classId}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id} className="rounded-lg">
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year *</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="e.g., 2024-2025"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number *</Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g., 9A001"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollmentStatus">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              disabled={modalMode === 'view'}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="active" className="rounded-lg">Active</SelectItem>
                <SelectItem value="completed" className="rounded-lg">Completed</SelectItem>
                <SelectItem value="dropped" className="rounded-lg">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Enrollment"
        itemName={selectedEnrollment?.studentName}
      />
    </div>
  );
}
