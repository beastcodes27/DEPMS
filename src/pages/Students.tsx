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
import { studentService, schoolService, classService, sectionService } from '@/services/dataService';
import type { Student } from '@/types';
import { toast } from 'sonner';

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelationship: '',
    schoolId: '',
    classId: '',
    sectionId: '',
    status: 'active',
  });

  useEffect(() => {
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

  const fetchStudents = () => {
    setLoading(true);
    const result = studentService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
      schoolId: schoolFilter,
    });
    setStudents(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [page, limit, search, statusFilter, schoolFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      guardianRelationship: '',
      schoolId: '',
      classId: '',
      sectionId: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleView = (student: Student) => {
    setModalMode('view');
    setSelectedStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const studentData = {
        ...formData,
        studentId: formData.studentId || `STD${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || 'male',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        guardianName: formData.guardianName || '',
        guardianPhone: formData.guardianPhone || '',
        guardianRelationship: formData.guardianRelationship || '',
        schoolId: formData.schoolId || '',
        classId: formData.classId || '',
        sectionId: formData.sectionId || '',
        status: formData.status || 'active',
        enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0],
      };

      if (modalMode === 'create') {
        studentService.create(studentData);
        toast.success('Student enrolled successfully');
      } else {
        if (selectedStudent) {
          studentService.update(selectedStudent.id, studentData);
          toast.success('Student updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedStudent) {
        studentService.delete(selectedStudent.id);
        toast.success('Student deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchStudents();
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
    { key: 'studentId', header: 'ID', width: '80px' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'gender', header: 'Gender', width: '80px', render: (item: Student) => (
      <span className="capitalize">{item.gender}</span>
    )},
    { key: 'schoolName', header: 'School' },
    { key: 'className', header: 'Class', width: '100px' },
    { key: 'sectionName', header: 'Section', width: '100px' },
    { key: 'guardianName', header: 'Guardian' },
    { key: 'guardianPhone', header: 'Guardian Phone', width: '130px' },
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Student Management"
        description="Manage student enrollments and information"
        onAdd={handleAdd}
        addButtonLabel="Enroll Student"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search students..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'graduated', label: 'Graduated' },
                { value: 'transferred', label: 'Transferred' },
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
        data={students}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No students found"
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
        title="Student"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male" className="rounded-lg">Male</SelectItem>
                  <SelectItem value="female" className="rounded-lg">Female</SelectItem>
                  <SelectItem value="other" className="rounded-lg">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <h4 className="text-sm font-medium mb-3">Address Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter state"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="Enter zip code"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <h4 className="text-sm font-medium mb-3">Guardian Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name *</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Enter guardian name"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                <Input
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="Enter guardian phone"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  placeholder="Enter guardian email"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianRelationship">Relationship *</Label>
                <Input
                  id="guardianRelationship"
                  value={formData.guardianRelationship}
                  onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                  placeholder="e.g., Father, Mother"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <h4 className="text-sm font-medium mb-3">Academic Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
                    <SelectItem value="inactive" className="rounded-lg">Inactive</SelectItem>
                    <SelectItem value="graduated" className="rounded-lg">Graduated</SelectItem>
                    <SelectItem value="transferred" className="rounded-lg">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        itemName={`${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
      />
    </div>
  );
}
