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
import { schoolService } from '@/services/dataService';
import type { School } from '@/types';
import { toast } from 'sonner';

export function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    principalName: '',
    type: 'public',
    status: 'active',
  });

  const fetchSchools = () => {
    setLoading(true);
    const result = schoolService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
    });
    setSchools(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, [page, limit, search, statusFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedSchool(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      principalName: '',
      type: 'public',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (school: School) => {
    setModalMode('edit');
    setSelectedSchool(school);
    setFormData({ ...school });
    setIsModalOpen(true);
  };

  const handleView = (school: School) => {
    setModalMode('view');
    setSelectedSchool(school);
    setFormData({ ...school });
    setIsModalOpen(true);
  };

  const handleDelete = (school: School) => {
    setSelectedSchool(school);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const schoolData = {
        ...formData,
        name: formData.name || '',
        code: formData.code || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        phone: formData.phone || '',
        email: formData.email || '',
        principalName: formData.principalName || '',
        type: formData.type || 'public',
        status: formData.status || 'active',
        establishedDate: formData.establishedDate || new Date().toISOString().split('T')[0],
        studentCount: formData.studentCount || 0,
        teacherCount: formData.teacherCount || 0,
      };

      if (modalMode === 'create') {
        schoolService.create(schoolData);
        toast.success('School created successfully');
      } else {
        if (selectedSchool) {
          schoolService.update(selectedSchool.id, schoolData);
          toast.success('School updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchSchools();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedSchool) {
        schoolService.delete(selectedSchool.id);
        toast.success('School deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchSchools();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setPage(1);
  };

  const columns = [
    { key: 'code', header: 'Code', width: '80px' },
    { key: 'name', header: 'School Name' },
    { key: 'principalName', header: 'Principal' },
    { key: 'city', header: 'City', width: '120px' },
    { key: 'phone', header: 'Phone', width: '130px' },
    { key: 'type', header: 'Type', width: '100px', render: (item: School) => (
      <span className="capitalize">{item.type}</span>
    )},
    { key: 'status', header: 'Status', width: '100px' },
    { key: 'studentCount', header: 'Students', width: '90px' },
    { key: 'teacherCount', header: 'Teachers', width: '90px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="School Management"
        description="Manage all schools under the regional office"
        onAdd={handleAdd}
        addButtonLabel="Add School"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search schools..."
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
              key: 'type',
              label: 'Type',
              options: [
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                { value: 'charter', label: 'Charter' },
              ],
              value: typeFilter,
              onChange: setTypeFilter,
            },
          ]}
          onClearFilters={clearFilters}
          showClearButton={true}
        />
      </div>

      <DataTable
        data={schools}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No schools found"
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
        title="School"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">School Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter school name"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">School Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., SCH001"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
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
            <Label htmlFor="principalName">Principal Name</Label>
            <Input
              id="principalName"
              value={formData.principalName}
              onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
              placeholder="Enter principal name"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">School Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              disabled={modalMode === 'view'}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="public" className="rounded-lg">Public</SelectItem>
                <SelectItem value="private" className="rounded-lg">Private</SelectItem>
                <SelectItem value="charter" className="rounded-lg">Charter</SelectItem>
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
        title="Delete School"
        itemName={selectedSchool?.name}
      />
    </div>
  );
}
