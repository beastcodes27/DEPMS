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
import { attendanceService, studentService, classService, sectionService, schoolService, teacherService } from '@/services/dataService';
import type { Attendance } from '@/types';
import { toast } from 'sonner';

export function Attendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Attendance>>({
    studentId: '',
    classId: '',
    sectionId: '',
    schoolId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    remarks: '',
    markedBy: '',
  });

  useEffect(() => {
    const allStudents = studentService.getAll({ limit: 100 });
    setStudents(allStudents.data.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}` })));

    const allClasses = classService.getAll({ limit: 100 });
    setClasses(allClasses.data.map(c => ({ id: c.id, name: c.name })));

    const allSections = sectionService.getAll({ limit: 100 });
    setSections(allSections.data.map(s => ({ id: s.id, name: s.name })));

    const allSchools = schoolService.getAll({ limit: 100 });
    setSchools(allSchools.data.map(s => ({ id: s.id, name: s.name })));

    const allTeachers = teacherService.getAll({ limit: 100 });
    setTeachers(allTeachers.data.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` })));
  }, []);

  const fetchAttendance = () => {
    setLoading(true);
    const result = attendanceService.getAll({
      page,
      limit,
      search,
    });
    setAttendance(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, limit, search, statusFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedAttendance(null);
    setFormData({
      studentId: '',
      classId: '',
      sectionId: '',
      schoolId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      remarks: '',
      markedBy: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: Attendance) => {
    setModalMode('edit');
    setSelectedAttendance(record);
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  const handleView = (record: Attendance) => {
    setModalMode('view');
    setSelectedAttendance(record);
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  const handleDelete = (record: Attendance) => {
    setSelectedAttendance(record);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    try {
      const attendanceData = {
        ...formData,
        studentId: formData.studentId || '',
        classId: formData.classId || '',
        sectionId: formData.sectionId || '',
        schoolId: formData.schoolId || '',
        date: formData.date || new Date().toISOString().split('T')[0],
        status: formData.status || 'present',
        markedBy: formData.markedBy || '',
      };

      if (modalMode === 'create') {
        attendanceService.create(attendanceData);
        toast.success('Attendance recorded successfully');
      } else {
        if (selectedAttendance) {
          attendanceService.update(selectedAttendance.id, attendanceData);
          toast.success('Attendance updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchAttendance();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedAttendance) {
        attendanceService.delete(selectedAttendance.id);
        toast.success('Attendance record deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchAttendance();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(1);
  };

  const columns = [
    { key: 'studentName', header: 'Student' },
    { key: 'className', header: 'Class' },
    { key: 'sectionName', header: 'Section' },
    { key: 'date', header: 'Date', width: '120px' },
    { key: 'status', header: 'Status', width: '100px', render: (item: Attendance) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        item.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' :
        item.status === 'absent' ? 'bg-rose-500/10 text-rose-500' :
        item.status === 'late' ? 'bg-amber-500/10 text-amber-500' :
        'bg-blue-500/10 text-blue-500'
      }`}>
        {item.status}
      </span>
    )},
    { key: 'remarks', header: 'Remarks' },
    { key: 'markedByName', header: 'Marked By' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Attendance Management"
        description="Track and manage student attendance"
        onAdd={handleAdd}
        addButtonLabel="Mark Attendance"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search attendance..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'present', label: 'Present' },
                { value: 'absent', label: 'Absent' },
                { value: 'late', label: 'Late' },
                { value: 'excused', label: 'Excused' },
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
        data={attendance}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No attendance records found"
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
        title="Attendance"
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

          <div className="grid gap-4 sm:grid-cols-2">
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
              <Label htmlFor="classId">Class *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value })}
                disabled={modalMode === 'view'}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sectionId">Section *</Label>
              <Select
                value={formData.sectionId}
                onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                disabled={modalMode === 'view'}
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
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Attendance Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="present" className="rounded-lg">Present</SelectItem>
                  <SelectItem value="absent" className="rounded-lg">Absent</SelectItem>
                  <SelectItem value="late" className="rounded-lg">Late</SelectItem>
                  <SelectItem value="excused" className="rounded-lg">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="markedBy">Marked By *</Label>
              <Select
                value={formData.markedBy}
                onValueChange={(value) => setFormData({ ...formData, markedBy: value })}
                disabled={modalMode === 'view'}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter remarks (optional)"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
        </div>
      </CRUDModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Attendance Record"
        itemName={selectedAttendance?.studentName}
      />
    </div>
  );
}
