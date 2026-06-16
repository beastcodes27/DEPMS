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
import { announcementService, schoolService } from '@/services/dataService';
import type { Announcement } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    type: 'general',
    targetAudience: ['all'],
    schoolId: undefined,
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'published',
  });

  useEffect(() => {
    const allSchools = schoolService.getAll({ limit: 100 });
    setSchools(allSchools.data.map(s => ({ id: s.id, name: s.name })));
  }, []);

  const fetchAnnouncements = () => {
    setLoading(true);
    const result = announcementService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
    });
    setAnnouncements(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, limit, search, typeFilter, statusFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedAnnouncement(null);
    setFormData({
      title: '',
      content: '',
      type: 'general',
      targetAudience: ['all'],
      schoolId: undefined,
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setModalMode('edit');
    setSelectedAnnouncement(announcement);
    setFormData({ ...announcement });
    setIsModalOpen(true);
  };

  const handleView = (announcement: Announcement) => {
    setModalMode('view');
    setSelectedAnnouncement(announcement);
    setFormData({ ...announcement });
    setIsModalOpen(true);
  };

  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const announcementData = {
        ...formData,
        title: formData.title || '',
        content: formData.content || '',
        type: formData.type || 'general',
        targetAudience: formData.targetAudience || ['all'],
        publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
        status: formData.status || 'published',
        postedBy: '1',
      };

      if (modalMode === 'create') {
        announcementService.create(announcementData);
        toast.success('Announcement published successfully');
      } else {
        if (selectedAnnouncement) {
          announcementService.update(selectedAnnouncement.id, announcementData);
          toast.success('Announcement updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedAnnouncement) {
        announcementService.delete(selectedAnnouncement.id);
        toast.success('Announcement deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchAnnouncements();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      general: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      event: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      holiday: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'type', header: 'Type', width: '100px', render: (item: Announcement) => (
      <Badge variant="outline" className={`capitalize ${getTypeBadge(item.type)}`}>
        {item.type}
      </Badge>
    )},
    { key: 'schoolName', header: 'School', render: (item: Announcement) => (
      <span>{item.schoolName || 'All Schools'}</span>
    )},
    { key: 'targetAudience', header: 'Target', width: '120px', render: (item: Announcement) => (
      <span className="text-sm">{item.targetAudience.join(', ')}</span>
    )},
    { key: 'postedByName', header: 'Posted By' },
    { key: 'publishDate', header: 'Publish Date', width: '120px' },
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Announcements"
        description="Manage announcements and notifications"
        onAdd={handleAdd}
        addButtonLabel="New Announcement"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search announcements..."
          filters={[
            {
              key: 'type',
              label: 'Type',
              options: [
                { value: 'general', label: 'General' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'event', label: 'Event' },
                { value: 'holiday', label: 'Holiday' },
              ],
              value: typeFilter,
              onChange: setTypeFilter,
            },
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
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
        data={announcements}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No announcements found"
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
        title="Announcement"
        mode={modalMode}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter announcement content"
              disabled={modalMode === 'view'}
              className="rounded-xl min-h-[120px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="general" className="rounded-lg">General</SelectItem>
                  <SelectItem value="urgent" className="rounded-lg">Urgent</SelectItem>
                  <SelectItem value="event" className="rounded-lg">Event</SelectItem>
                  <SelectItem value="holiday" className="rounded-lg">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Select
                value={formData.targetAudience?.[0] || 'all'}
                onValueChange={(value) => setFormData({ ...formData, targetAudience: [value as any] })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">All</SelectItem>
                  <SelectItem value="students" className="rounded-lg">Students</SelectItem>
                  <SelectItem value="teachers" className="rounded-lg">Teachers</SelectItem>
                  <SelectItem value="parents" className="rounded-lg">Parents</SelectItem>
                  <SelectItem value="staff" className="rounded-lg">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolId">School (Optional)</Label>
            <Select
              value={formData.schoolId || ''}
              onValueChange={(value) => setFormData({ ...formData, schoolId: value || undefined })}
              disabled={modalMode === 'view'}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="" className="rounded-lg">All Schools</SelectItem>
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
              <Label htmlFor="publishDate">Publish Date *</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcementStatus">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              disabled={modalMode === 'view'}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="draft" className="rounded-lg">Draft</SelectItem>
                <SelectItem value="published" className="rounded-lg">Published</SelectItem>
                <SelectItem value="archived" className="rounded-lg">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Announcement"
        itemName={selectedAnnouncement?.title}
      />
    </div>
  );
}
