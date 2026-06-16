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
import { Checkbox } from '@/components/ui/checkbox';
import { roleService } from '@/services/dataService';
import type { Role, Permission } from '@/types';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const modules = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'schools', name: 'Schools' },
  { id: 'students', name: 'Students' },
  { id: 'teachers', name: 'Teachers' },
  { id: 'classes', name: 'Classes' },
  { id: 'subjects', name: 'Subjects' },
  { id: 'enrollments', name: 'Enrollments' },
  { id: 'grades', name: 'Grades' },
  { id: 'attendance', name: 'Attendance' },
  { id: 'reports', name: 'Reports' },
  { id: 'announcements', name: 'Announcements' },
  { id: 'users', name: 'Users' },
  { id: 'roles', name: 'Roles' },
  { id: 'settings', name: 'Settings' },
];

const actions = ['create', 'read', 'update', 'delete'] as const;

export function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
  });

  const fetchRoles = () => {
    setLoading(true);
    const result = roleService.getAll({
      page,
      limit,
      search,
    });
    setRoles(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, [page, limit, search]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setModalMode('edit');
    setSelectedRole(role);
    setFormData({ ...role });
    setIsModalOpen(true);
  };

  const handleView = (role: Role) => {
    setModalMode('view');
    setSelectedRole(role);
    setFormData({ ...role });
    setIsModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const togglePermission = (module: string, action: string) => {
    const currentPermissions = formData.permissions || [];
    const existingPermission = currentPermissions.find(p => p.module === module);

    let newPermissions: Permission[];

    if (existingPermission) {
      const hasAction = existingPermission.actions.includes(action as any);
      if (hasAction) {
        // Remove action
        const updatedActions = existingPermission.actions.filter(a => a !== action);
        if (updatedActions.length === 0) {
          newPermissions = currentPermissions.filter(p => p.module !== module);
        } else {
          newPermissions = currentPermissions.map(p =>
            p.module === module ? { ...p, actions: updatedActions } : p
          );
        }
      } else {
        // Add action
        newPermissions = currentPermissions.map(p =>
          p.module === module
            ? { ...p, actions: [...p.actions, action as any] }
            : p
        );
      }
    } else {
      // Create new permission
      newPermissions = [
        ...currentPermissions,
        { id: Math.random().toString(36).substr(2, 9), module, actions: [action as any] },
      ];
    }

    setFormData({ ...formData, permissions: newPermissions });
  };

  const hasPermission = (module: string, action: string): boolean => {
    const permission = formData.permissions?.find(p => p.module === module);
    return permission?.actions.includes(action as any) || false;
  };

  const handleSubmit = () => {
    try {
      const roleData = {
        ...formData,
        name: formData.name || '',
        description: formData.description || '',
        permissions: formData.permissions || [],
      };

      if (modalMode === 'create') {
        roleService.create(roleData);
        toast.success('Role created successfully');
      } else {
        if (selectedRole) {
          roleService.update(selectedRole.id, roleData);
          toast.success('Role updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedRole) {
        roleService.delete(selectedRole.id);
        toast.success('Role deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchRoles();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setPage(1);
  };

  const columns = [
    { key: 'name', header: 'Role Name', render: (item: Role) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">{item.name}</span>
      </div>
    )},
    { key: 'description', header: 'Description' },
    { key: 'permissions', header: 'Permissions', render: (item: Role) => (
      <span className="text-sm text-muted-foreground">
        {item.permissions.length} modules
      </span>
    )},
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Role & Permission Management"
        description="Manage user roles and their permissions"
        onAdd={handleAdd}
        addButtonLabel="Add Role"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search roles..."
          onClearFilters={clearFilters}
          showClearButton={true}
        />
      </div>

      <DataTable
        data={roles}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No roles found"
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
        title="Role"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter role name"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter role description"
              disabled={modalMode === 'view'}
              className="rounded-xl min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="border border-border/50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 text-xs font-medium uppercase tracking-wider">
                <div>Module</div>
                <div className="text-center">Create</div>
                <div className="text-center">Read</div>
                <div className="text-center">Update</div>
                <div className="text-center">Delete</div>
              </div>
              <div className="divide-y divide-border/50">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="grid grid-cols-5 gap-2 p-3 items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="text-sm font-medium">{module.name}</div>
                    {actions.map((action) => (
                      <div key={action} className="flex justify-center">
                        <Checkbox
                          checked={hasPermission(module.id, action)}
                          onCheckedChange={() => togglePermission(module.id, action)}
                          disabled={modalMode === 'view'}
                          className="rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        itemName={selectedRole?.name}
      />
    </div>
  );
}
