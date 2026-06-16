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
import { teacherService, schoolService } from '@/services/dataService';
import type { Teacher } from '@/types';
import { toast } from 'sonner';

export function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Teacher>>({
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
    qualification: '',
    specialization: '',
    experience: 0,
    joiningDate: '',
    schoolId: '',
    subjects: [],
    status: 'active',
  });

  useEffect(() => {
    const allSchools = schoolService.getAll({ limit: 100 });
    setSchools(allSchools.data.map(s => ({ id: s.id, name: s.name })));
  }, []);

  const fetchTeachers = () => {
    setLoading(true);
    const result = teacherService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
      schoolId: schoolFilter,
    });
    setTeachers(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, limit, search, statusFilter, schoolFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedTeacher(null);
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
      qualification: '',
      specialization: '',
      experience: 0,
      joiningDate: '',
      schoolId: '',
      subjects: [],
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setModalMode('edit');
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setIsModalOpen(true);
  };

  const handleView = (teacher: Teacher) => {
    setModalMode('view');
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setIsModalOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const teacherData = {
        ...formData,
        teacherId: formData.teacherId || `TCH${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || 'male',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        qualification: formData.qualification || '',
        specialization: formData.specialization || '',
        experience: formData.experience || 0,
        joiningDate: formData.joiningDate || '',
        schoolId: formData.schoolId || '',
        subjects: formData.subjects || [],
        status: formData.status || 'active',
      };

      if (modalMode === 'create') {
        teacherService.create(teacherData);
        toast.success('Teacher added successfully');
      } else {
        if (selectedTeacher) {
          teacherService.update(selectedTeacher.id, teacherData);
          toast.success('Teacher updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedTeacher) {
        teacherService.delete(selectedTeacher.id);
        toast.success('Teacher deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchTeachers();
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
    { key: 'teacherId', header: 'ID', width: '80px' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', width: '130px' },
    { key: 'schoolName', header: 'School' },
    { key: 'specialization', header: 'Specialization' },
    { key: 'experience', header: 'Exp (Years)', width: '100px' },
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teacher Management"
        description="Manage teaching staff across all schools"
        onAdd={handleAdd}
        addButtonLabel="Add Teacher"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search teachers..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'on_leave', label: 'On Leave' },
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
        data={teachers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No teachers found"
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
        title="Teacher"
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
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="phone">Phone *</Label>
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
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
              <Label htmlFor="gender">Gender</Label>
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
            <h4 className="text-sm font-medium mb-3">Professional Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., M.Ed. Mathematics"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Mathematics, Science"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  placeholder="Enter years of experience"
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolId">School *</Label>
                <Select
                  value={formData.schoolId}
                  onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
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
                    <SelectItem value="on_leave" className="rounded-lg">On Leave</SelectItem>
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
        title="Delete Teacher"
        itemName={`${selectedTeacher?.firstName} ${selectedTeacher?.lastName}`}
      />
    </div>
  );
}
