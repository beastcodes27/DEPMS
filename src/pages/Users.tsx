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
import { userService } from '@/services/dataService';
import type { User } from '@/types';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
  });

  const fetchUsers = () => {
    setLoading(true);
    const result = userService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
    });
    setUsers(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, roleFilter, statusFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleView = (user: User) => {
    setModalMode('view');
    setSelectedUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const userData = {
        ...formData,
        name: formData.name || '',
        email: formData.email || '',
        role: formData.role || 'staff',
        status: formData.status || 'active',
      };

      if (modalMode === 'create') {
        userService.create(userData);
        toast.success('User created successfully');
      } else {
        if (selectedUser) {
          userService.update(selectedUser.id, userData);
          toast.success('User updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedUser) {
        userService.delete(selectedUser.id);
        toast.success('User deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      regional_admin: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      school_admin: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      teacher: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      staff: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return colors[role] || colors.staff;
  };

  const columns = [
    { key: 'name', header: 'User', render: (item: User) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {getInitials(item.name)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.name}</span>
      </div>
    )},
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', width: '140px', render: (item: User) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getRoleBadge(item.role)}`}>
        {item.role.replace('_', ' ')}
      </span>
    )},
    { key: 'lastLogin', header: 'Last Login', width: '150px', render: (item: User) => (
      <span>{item.lastLogin ? new Date(item.lastLogin).toLocaleString() : 'Never'}</span>
    )},
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Management"
        description="Manage system users and their roles"
        onAdd={handleAdd}
        addButtonLabel="Add User"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users..."
          filters={[
            {
              key: 'role',
              label: 'Role',
              options: [
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'regional_admin', label: 'Regional Admin' },
                { value: 'school_admin', label: 'School Admin' },
                { value: 'teacher', label: 'Teacher' },
                { value: 'staff', label: 'Staff' },
              ],
              value: roleFilter,
              onChange: setRoleFilter,
            },
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
          ]}
          onClearFilters={clearFilters}
          showClearButton={true}
        />
      </div>

      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No users found"
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
        title="User"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
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
              placeholder="Enter email address"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="super_admin" className="rounded-lg">Super Admin</SelectItem>
                  <SelectItem value="regional_admin" className="rounded-lg">Regional Admin</SelectItem>
                  <SelectItem value="school_admin" className="rounded-lg">School Admin</SelectItem>
                  <SelectItem value="teacher" className="rounded-lg">Teacher</SelectItem>
                  <SelectItem value="staff" className="rounded-lg">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userStatus">Status</Label>
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

          {modalMode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="rounded-xl"
              />
            </div>
          )}
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        itemName={selectedUser?.name}
      />
    </div>
  );
}
