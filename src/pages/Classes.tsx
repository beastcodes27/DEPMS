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
import { classService, schoolService, teacherService, sectionService } from '@/services/dataService';
import type { Class, Section } from '@/types';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('classes');

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [classList, setClassList] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [classFormData, setClassFormData] = useState<Partial<Class>>({
    name: '',
    code: '',
    gradeLevel: 1,
    schoolId: '',
    classTeacherId: '',
    capacity: 30,
    academicYear: '2024-2025',
    status: 'active',
  });

  const [sectionFormData, setSectionFormData] = useState<Partial<Section>>({
    name: '',
    code: '',
    classId: '',
    schoolId: '',
    roomNumber: '',
    capacity: 30,
    status: 'active',
  });

  useEffect(() => {
    const allSchools = schoolService.getAll({ limit: 100 });
    setSchools(allSchools.data.map(s => ({ id: s.id, name: s.name })));
  }, []);

  useEffect(() => {
    if (schoolFilter || classFormData.schoolId) {
      const allTeachers = teacherService.getAll({
        schoolId: schoolFilter || classFormData.schoolId,
        limit: 100
      });
      setTeachers(allTeachers.data.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` })));

      const allClasses = classService.getAll({
        schoolId: schoolFilter || classFormData.schoolId,
        limit: 100
      });
      setClassList(allClasses.data.map(c => ({ id: c.id, name: c.name })));
    }
  }, [schoolFilter, classFormData.schoolId]);

  const fetchClasses = () => {
    setLoading(true);
    const result = classService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
      schoolId: schoolFilter,
    });
    setClasses(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  const fetchSections = () => {
    setLoading(true);
    const result = sectionService.getAll({
      page,
      limit,
      search,
      status: statusFilter,
      schoolId: schoolFilter,
    });
    setSections(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'classes') {
      fetchClasses();
    } else {
      fetchSections();
    }
  }, [page, limit, search, statusFilter, schoolFilter, activeTab]);

  const handleAddClass = () => {
    setModalMode('create');
    setSelectedClass(null);
    setClassFormData({
      name: '',
      code: '',
      gradeLevel: 1,
      schoolId: '',
      classTeacherId: '',
      capacity: 30,
      academicYear: '2024-2025',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleAddSection = () => {
    setModalMode('create');
    setSelectedSection(null);
    setSectionFormData({
      name: '',
      code: '',
      classId: '',
      schoolId: '',
      roomNumber: '',
      capacity: 30,
      status: 'active',
    });
    setIsSectionModalOpen(true);
  };

  const handleEditClass = (cls: Class) => {
    setModalMode('edit');
    setSelectedClass(cls);
    setClassFormData({ ...cls });
    setIsModalOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setModalMode('edit');
    setSelectedSection(section);
    setSectionFormData({ ...section });
    setIsSectionModalOpen(true);
  };

  const handleViewClass = (cls: Class) => {
    setModalMode('view');
    setSelectedClass(cls);
    setClassFormData({ ...cls });
    setIsModalOpen(true);
  };

  const handleViewSection = (section: Section) => {
    setModalMode('view');
    setSelectedSection(section);
    setSectionFormData({ ...section });
    setIsSectionModalOpen(true);
  };

  const handleDeleteClass = (cls: Class) => {
    setSelectedClass(cls);
    setIsDeleteOpen(true);
  };

  const handleSubmitClass = () => {
    try {
      const classData = {
        ...classFormData,
        name: classFormData.name || '',
        code: classFormData.code || '',
        gradeLevel: classFormData.gradeLevel || 1,
        schoolId: classFormData.schoolId || '',
        capacity: classFormData.capacity || 30,
        academicYear: classFormData.academicYear || '2024-2025',
        status: classFormData.status || 'active',
        studentCount: classFormData.studentCount || 0,
      };

      if (modalMode === 'create') {
        classService.create(classData);
        toast.success('Class created successfully');
      } else {
        if (selectedClass) {
          classService.update(selectedClass.id, classData);
          toast.success('Class updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleSubmitSection = () => {
    try {
      const sectionData = {
        ...sectionFormData,
        name: sectionFormData.name || '',
        code: sectionFormData.code || '',
        classId: sectionFormData.classId || '',
        schoolId: sectionFormData.schoolId || '',
        capacity: sectionFormData.capacity || 30,
        status: sectionFormData.status || 'active',
        studentCount: sectionFormData.studentCount || 0,
      };

      if (modalMode === 'create') {
        sectionService.create(sectionData);
        toast.success('Section created successfully');
      } else {
        if (selectedSection) {
          sectionService.update(selectedSection.id, sectionData);
          toast.success('Section updated successfully');
        }
      }
      setIsSectionModalOpen(false);
      fetchSections();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedClass) {
        classService.delete(selectedClass.id);
        toast.success('Class deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchClasses();
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

  const classColumns = [
    { key: 'code', header: 'Code', width: '80px' },
    { key: 'name', header: 'Class Name' },
    { key: 'gradeLevel', header: 'Grade', width: '80px' },
    { key: 'schoolName', header: 'School' },
    { key: 'classTeacherName', header: 'Class Teacher' },
    { key: 'capacity', header: 'Capacity', width: '90px' },
    { key: 'studentCount', header: 'Students', width: '90px' },
    { key: 'academicYear', header: 'Academic Year', width: '120px' },
    { key: 'status', header: 'Status', width: '100px' },
  ];

  const sectionColumns = [
    { key: 'code', header: 'Code', width: '80px' },
    { key: 'name', header: 'Section Name' },
    { key: 'className', header: 'Class' },
    { key: 'schoolName', header: 'School' },
    { key: 'roomNumber', header: 'Room', width: '90px' },
    { key: 'capacity', header: 'Capacity', width: '90px' },
    { key: 'studentCount', header: 'Students', width: '90px' },
    { key: 'status', header: 'Status', width: '100px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Class & Section Management"
        description="Manage classes and sections across all schools"
        onAdd={activeTab === 'classes' ? handleAddClass : handleAddSection}
        addButtonLabel={activeTab === 'classes' ? 'Add Class' : 'Add Section'}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl">
          <TabsTrigger value="classes" className="rounded-lg">Classes</TabsTrigger>
          <TabsTrigger value="sections" className="rounded-lg">Sections</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={`Search ${activeTab}...`}
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

        <TabsContent value="classes" className="mt-4">
          <DataTable
            data={classes}
            columns={classColumns}
            onEdit={handleEditClass}
            onDelete={handleDeleteClass}
            onView={handleViewClass}
            loading={loading}
            emptyMessage="No classes found"
          />
        </TabsContent>

        <TabsContent value="sections" className="mt-4">
          <DataTable
            data={sections}
            columns={sectionColumns}
            onEdit={handleEditSection}
            onView={handleViewSection}
            loading={loading}
            emptyMessage="No sections found"
          />
        </TabsContent>
      </Tabs>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        totalItems={total}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
      />

      {/* Class Modal */}
      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Class"
        mode={modalMode}
        onSubmit={handleSubmitClass}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={classFormData.name}
              onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
              placeholder="e.g., Grade 9"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Class Code *</Label>
            <Input
              id="code"
              value={classFormData.code}
              onChange={(e) => setClassFormData({ ...classFormData, code: e.target.value })}
              placeholder="e.g., G9"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level *</Label>
            <Input
              id="gradeLevel"
              type="number"
              value={classFormData.gradeLevel}
              onChange={(e) => setClassFormData({ ...classFormData, gradeLevel: parseInt(e.target.value) || 1 })}
              placeholder="Enter grade level"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolId">School *</Label>
            <Select
              value={classFormData.schoolId}
              onValueChange={(value) => setClassFormData({ ...classFormData, schoolId: value })}
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
            <Label htmlFor="classTeacherId">Class Teacher</Label>
            <Select
              value={classFormData.classTeacherId}
              onValueChange={(value) => setClassFormData({ ...classFormData, classTeacherId: value })}
              disabled={modalMode === 'view' || !classFormData.schoolId}
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
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={classFormData.capacity}
              onChange={(e) => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) || 30 })}
              placeholder="Enter capacity"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              value={classFormData.academicYear}
              onChange={(e) => setClassFormData({ ...classFormData, academicYear: e.target.value })}
              placeholder="e.g., 2024-2025"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={classFormData.status}
              onValueChange={(value: any) => setClassFormData({ ...classFormData, status: value })}
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

      {/* Section Modal */}
      <CRUDModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Section"
        mode={modalMode}
        onSubmit={handleSubmitSection}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sectionName">Section Name *</Label>
            <Input
              id="sectionName"
              value={sectionFormData.name}
              onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
              placeholder="e.g., Section A"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionCode">Section Code *</Label>
            <Input
              id="sectionCode"
              value={sectionFormData.code}
              onChange={(e) => setSectionFormData({ ...sectionFormData, code: e.target.value })}
              placeholder="e.g., 9A"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionSchoolId">School *</Label>
            <Select
              value={sectionFormData.schoolId}
              onValueChange={(value) => setSectionFormData({ ...sectionFormData, schoolId: value, classId: '' })}
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
              value={sectionFormData.classId}
              onValueChange={(value) => setSectionFormData({ ...sectionFormData, classId: value })}
              disabled={modalMode === 'view' || !sectionFormData.schoolId}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {classList.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id} className="rounded-lg">
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              value={sectionFormData.roomNumber}
              onChange={(e) => setSectionFormData({ ...sectionFormData, roomNumber: e.target.value })}
              placeholder="e.g., 101"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionCapacity">Capacity</Label>
            <Input
              id="sectionCapacity"
              type="number"
              value={sectionFormData.capacity}
              onChange={(e) => setSectionFormData({ ...sectionFormData, capacity: parseInt(e.target.value) || 30 })}
              placeholder="Enter capacity"
              disabled={modalMode === 'view'}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionStatus">Status</Label>
            <Select
              value={sectionFormData.status}
              onValueChange={(value: any) => setSectionFormData({ ...sectionFormData, status: value })}
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
        title="Delete Class"
        itemName={selectedClass?.name}
      />
    </div>
  );
}
