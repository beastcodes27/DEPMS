import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/crud/PageHeader';
import { DataTable } from '@/components/crud/DataTable';
import { SearchFilter } from '@/components/crud/SearchFilter';
import { Pagination } from '@/components/crud/Pagination';
import { CRUDModal } from '@/components/crud/CRUDModal';
import { DeleteConfirmation } from '@/components/crud/DeleteConfirmation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { subjectService, schoolService, teacherService } from '@/services/dataService';
import type { Subject } from '@/types';
import { toast } from 'sonner';

export function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    code: '',
    description: '',
    credits: 3,
    schoolId: '',
    teacherIds: [],
    status: 'active',
  });

  useEffect(() => {
    const allSchools = schoolService.getAll({ limit: 100 });
    setSchools(allSchools.data.map(s => ({ id: s.id, name: s.name })));
  }, []);

  useEffect(() => {
    if (formData.schoolId) {
      const allTeachers = teacherService.getAll({
        schoolId: formData.schoolId,
        limit: 100
      });
      setTeachers(allTeachers.data.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` })));
    }
  }, [formData.schoolId]);

  const fetchSubjects = () => {
    setLoading(true);
    const result = subjectService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
      schoolId: schoolFilter,
    });
    setSubjects(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, [page, limit, search, statusFilter, schoolFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedSubject(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      credits: 3,
      schoolId: '',
      teacherIds: [],
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setModalMode('edit');
    setSelectedSubject(subject);
    setFormData({ ...subject });
    setIsModalOpen(true);
  };

  const handleView = (subject: Subject) => {
    setModalMode('view');
    setSelectedSubject(subject);
    setFormData({ ...subject });
    setIsModalOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const subjectData = {
        ...formData,
        name: formData.name || '',
        code: formData.code || '',
        credits: formData.credits || 3,
        schoolId: formData.schoolId || '',
        teacherIds: formData.teacherIds || [],
        status: formData.status || 'active',
      };

      if (modalMode === 'create') {
        subjectService.create(subjectData);
        toast.success('Subject created successfully');
      } else {
        if (selectedSubject) {
          subjectService.update(selectedSubject.id, subjectData);
          toast.success('Subject updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedSubject) {
        subjectService.delete(selectedSubject.id);
        toast.success('Subject deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchSubjects();
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
    { key: 'code', header: 'Code', width: '80px' },
    { key: 'name', header: 'Subject Name' },
    { key: 'schoolName', header: 'School' },
    { key: 'credits', header: 'Credits', width: '80px' },
    { key: 'teacherNames', header: 'Teachers', render: (item: Subject) => (
      <span className="text-sm">{item.teacherNames?.join(', ') || '-'}</span>
    )},
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Subject Management"
        description="Manage subjects and assign teachers"
        onAdd={handleAdd}
        addButtonLabel="Add Subject"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search subjects..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
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
        data={subjects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No subjects found"
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
        title="Subject"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter subject name"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Subject Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., MATH"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter subject description"
              disabled={modalMode === 'view'}
              className="rounded-xl min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
              placeholder="Enter credits"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolId">School *</Label>
            <Select
              value={formData.schoolId}
              onValueChange={(value) => setFormData({ ...formData, schoolId: value, teacherIds: [] })}
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
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="teachers">Assigned Teachers</Label>
            <Select
              value={formData.teacherIds?.[0] || ''}
              onValueChange={(value) => setFormData({ ...formData, teacherIds: value ? [value] : [] })}
              disabled={modalMode === 'view' || !formData.schoolId}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id} className="rounded-lg">
                    {teacher.name}
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Subject"
        itemName={selectedSubject?.name}
      />
    </div>
  );
}
