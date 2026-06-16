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
import { gradeService, studentService, subjectService, classService, teacherService } from '@/services/dataService';
import type { Grade } from '@/types';
import { toast } from 'sonner';

export function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState<Partial<Grade>>({
    studentId: '',
    subjectId: '',
    classId: '',
    examType: 'quiz',
    marks: 0,
    maxMarks: 100,
    percentage: 0,
    grade: '',
    remarks: '',
    examDate: '',
    teacherId: '',
    academicYear: '2024-2025',
  });

  useEffect(() => {
    const allStudents = studentService.getAll({ limit: 100 });
    setStudents(allStudents.data.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}` })));

    const allSubjects = subjectService.getAll({ limit: 100 });
    setSubjects(allSubjects.data.map(s => ({ id: s.id, name: s.name })));

    const allClasses = classService.getAll({ limit: 100 });
    setClasses(allClasses.data.map(c => ({ id: c.id, name: c.name })));

    const allTeachers = teacherService.getAll({ limit: 100 });
    setTeachers(allTeachers.data.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` })));
  }, []);

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const fetchGrades = () => {
    setLoading(true);
    const result = gradeService.getAll({
      page,
      limit,
      search,
    });
    setGrades(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchGrades();
  }, [page, limit, search, examTypeFilter]);

  const handleAdd = () => {
    setModalMode('create');
    setSelectedGrade(null);
    setFormData({
      studentId: '',
      subjectId: '',
      classId: '',
      examType: 'quiz',
      marks: 0,
      maxMarks: 100,
      percentage: 0,
      grade: '',
      remarks: '',
      examDate: '',
      teacherId: '',
      academicYear: '2024-2025',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (grade: Grade) => {
    setModalMode('edit');
    setSelectedGrade(grade);
    setFormData({ ...grade });
    setIsModalOpen(true);
  };

  const handleView = (grade: Grade) => {
    setModalMode('view');
    setSelectedGrade(grade);
    setFormData({ ...grade });
    setIsModalOpen(true);
  };

  const handleDelete = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDeleteOpen(true);
  };

  const handleMarksChange = (marks: number, maxMarks: number) => {
    const percentage = maxMarks > 0 ? Math.round((marks / maxMarks) * 100) : 0;
    const grade = calculateGrade(percentage);
    setFormData(prev => ({
      ...prev,
      marks,
      maxMarks,
      percentage,
      grade,
    }));
  };

  const handleSubmit = () => {
    try {
      const gradeData = {
        ...formData,
        studentId: formData.studentId || '',
        subjectId: formData.subjectId || '',
        classId: formData.classId || '',
        examType: formData.examType || 'quiz',
        marks: formData.marks || 0,
        maxMarks: formData.maxMarks || 100,
        percentage: formData.percentage || 0,
        grade: formData.grade || 'F',
        examDate: formData.examDate || new Date().toISOString().split('T')[0],
        teacherId: formData.teacherId || '',
        academicYear: formData.academicYear || '2024-2025',
      };

      if (modalMode === 'create') {
        gradeService.create(gradeData);
        toast.success('Grade recorded successfully');
      } else {
        if (selectedGrade) {
          gradeService.update(selectedGrade.id, gradeData);
          toast.success('Grade updated successfully');
        }
      }
      setIsModalOpen(false);
      fetchGrades();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedGrade) {
        gradeService.delete(selectedGrade.id);
        toast.success('Grade deleted successfully');
      }
      setIsDeleteOpen(false);
      fetchGrades();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setExamTypeFilter('');
    setPage(1);
  };

  const columns = [
    { key: 'studentName', header: 'Student' },
    { key: 'subjectName', header: 'Subject' },
    { key: 'className', header: 'Class' },
    { key: 'examType', header: 'Exam Type', width: '100px', render: (item: Grade) => (
      <span className="capitalize">{item.examType}</span>
    )},
    { key: 'marks', header: 'Marks', width: '100px', render: (item: Grade) => (
      <span>{item.marks} / {item.maxMarks}</span>
    )},
    { key: 'percentage', header: '%', width: '70px', render: (item: Grade) => (
      <span>{item.percentage}%</span>
    )},
    { key: 'grade', header: 'Grade', width: '80px', render: (item: Grade) => (
      <span className={`font-semibold ${
        item.grade === 'A' ? 'text-emerald-500' :
        item.grade === 'B' ? 'text-blue-500' :
        item.grade === 'C' ? 'text-amber-500' :
        item.grade === 'D' ? 'text-orange-500' :
        'text-rose-500'
      }`}>{item.grade}</span>
    )},
    { key: 'examDate', header: 'Exam Date', width: '120px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Grade Management"
        description="Record and manage student grades"
        onAdd={handleAdd}
        addButtonLabel="Record Grade"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search grades..."
          filters={[
            {
              key: 'examType',
              label: 'Exam Type',
              options: [
                { value: 'quiz', label: 'Quiz' },
                { value: 'midterm', label: 'Midterm' },
                { value: 'final', label: 'Final' },
                { value: 'assignment', label: 'Assignment' },
                { value: 'project', label: 'Project' },
              ],
              value: examTypeFilter,
              onChange: setExamTypeFilter,
            },
          ]}
          onClearFilters={clearFilters}
          showClearButton={true}
        />
      </div>

      <DataTable
        data={grades}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        emptyMessage="No grades found"
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
        title="Grade"
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
              <Label htmlFor="subjectId">Subject *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id} className="rounded-lg">
                      {subject.name}
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
              <Label htmlFor="examType">Exam Type *</Label>
              <Select
                value={formData.examType}
                onValueChange={(value: any) => setFormData({ ...formData, examType: value })}
                disabled={modalMode === 'view'}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="quiz" className="rounded-lg">Quiz</SelectItem>
                  <SelectItem value="midterm" className="rounded-lg">Midterm</SelectItem>
                  <SelectItem value="final" className="rounded-lg">Final</SelectItem>
                  <SelectItem value="assignment" className="rounded-lg">Assignment</SelectItem>
                  <SelectItem value="project" className="rounded-lg">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher *</Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks Obtained *</Label>
              <Input
                id="marks"
                type="number"
                value={formData.marks}
                onChange={(e) => handleMarksChange(parseInt(e.target.value) || 0, formData.maxMarks || 100)}
                placeholder="Enter marks"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMarks">Max Marks *</Label>
              <Input
                id="maxMarks"
                type="number"
                value={formData.maxMarks}
                onChange={(e) => handleMarksChange(formData.marks || 0, parseInt(e.target.value) || 100)}
                placeholder="Enter max marks"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                id="percentage"
                value={`${formData.percentage}% (${formData.grade})`}
                disabled
                className="rounded-xl bg-muted"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date *</Label>
              <Input
                id="examDate"
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="e.g., 2024-2025"
                disabled={modalMode === 'view'}
                className="rounded-xl"
              />
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
        title="Delete Grade"
        itemName={`${selectedGrade?.studentName} - ${selectedGrade?.subjectName}`}
      />
    </div>
  );
}
