'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subject, Unit, Exam } from '@/lib/types';
import {
    BookOpen, Plus, Edit2, FileText, Users, TrendingUp, Search, Menu, X, Trash2,
    ChevronLeft, ChevronRight, PenTool, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { AdminSidebar } from "@/components/admin/sidebar";
import { StatCard } from "@/components/admin/stat-card";
import { AreaChart } from "@/components/admin/area-chart";
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Record<string, Unit[]>>({});
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [openExamDialog, setOpenExamDialog] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [newExam, setNewExam] = useState<Partial<Exam>>({
        title: '',
        duration: 15,
        type: '15-minute',
        subjectId: ''
    });

    const toggleSelectRow = (id: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedRows(newSelected);
    };

    const toggleSelectAll = (ids: string[]) => {
        if (selectedRows.size === ids.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(ids));
        }
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`Bạn có chắc muốn xóa ${selectedRows.size} mục đã chọn?`)) return;
        try {
            const res = await fetch('/api/exams', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedRows) })
            });
            if (res.ok) {
                setExams(exams.filter(e => !selectedRows.has(e.id)));
                setSelectedRows(new Set());
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleCreateExam = async () => {
        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExam)
            });
            if (res.ok) {
                const exam = await res.json();
                setExams([exam, ...exams]);
                setOpenExamDialog(false);
                setNewExam({ title: '', duration: 15, type: '15-minute', subjectId: '' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetch('/api/subjects')
            .then(r => r.json())
            .then(async (subjectsData) => {
                setSubjects(subjectsData);
                const unitsMap: Record<string, Unit[]> = {};
                for (const subject of subjectsData) {
                    const unitsData = await fetch(`/api/units?subjectId=${subject.id}`).then(r => r.json());
                    unitsMap[subject.id] = unitsData;
                }
                setUnits(unitsMap);
                fetch('/api/exams').then(r => r.json()).then(setExams);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const totalUnits = Object.values(units).reduce((acc, u) => acc + u.length, 0);
    const totalExercises = Object.values(units).reduce((acc, subjectUnits) =>
        acc + subjectUnits.reduce((uAcc, u) =>
            uAcc + (u.lessons?.reduce((lAcc, l) => lAcc + (l.exercises?.length || 0), 0) || 0), 0
        ), 0
    );

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredExams = exams.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedExams = filteredExams.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil(filteredExams.length / rowsPerPage);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <div className="hidden lg:block">
                <AdminSidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onLogout={handleLogout}
                />
            </div>

            {isMobileNavOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden">
                    <div className="fixed inset-y-0 left-0 w-72 border-r bg-background shadow-2xl animate-in slide-in-from-left duration-300">
                        <AdminSidebar
                            activeSection={activeSection}
                            onSectionChange={(s) => { setActiveSection(s); setIsMobileNavOpen(false); }}
                            onLogout={handleLogout}
                        />
                    </div>
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-background/80"
                        onClick={() => setIsMobileNavOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            <main className="flex-1 overflow-auto">
                <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileNavOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="hidden lg:flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <span className="font-semibold">Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm..."
                                className="w-64 pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Dialog open={openExamDialog} onOpenChange={setOpenExamDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" /> Tạo mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tạo Đề thi mới</DialogTitle>
                                    <DialogDescription>Nhập thông tin cơ bản cho đề thi.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Tên đề thi</Label>
                                        <Input
                                            id="title"
                                            value={newExam.title}
                                            onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                            placeholder="VD: Kiểm tra 15 phút - Unit 1"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="duration">Thời gian (phút)</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            value={newExam.duration}
                                            onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Loại đề thi</Label>
                                        <Select
                                            value={newExam.type}
                                            onChange={(e) => setNewExam({ ...newExam, type: e.target.value as any })}
                                            options={[
                                                { value: "15-minute", label: "15 Phút" },
                                                { value: "45-minute", label: "45 Phút" },
                                                { value: "midterm-1", label: "Giữa kỳ 1" },
                                                { value: "final-1", label: "Cuối kỳ 1" },
                                                { value: "practice", label: "Luyện tập" },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpenExamDialog(false)}>Hủy</Button>
                                    <Button onClick={handleCreateExam}>Tạo mới</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                <div className="p-4 lg:p-6 space-y-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {activeSection === 'dashboard' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard
                                            title="Tổng Môn học"
                                            value={subjects.length}
                                            description="Tăng từ tháng trước"
                                            icon={BookOpen}
                                        />
                                        <StatCard
                                            title="Tổng Bài học"
                                            value={totalUnits}
                                            description="Cần bổ sung thêm"
                                            icon={FileText}
                                        />
                                        <StatCard
                                            title="Tổng Bài tập"
                                            value={totalExercises}
                                            description="Hoàn thành tốt"
                                            icon={TrendingUp}
                                        />
                                        <StatCard
                                            title="Đề thi"
                                            value={exams.length}
                                            description={`${exams.length > 0 ? '+' + exams.length : '0'} đề thi có sẵn`}
                                            icon={PenTool}
                                        />
                                    </div>

                                    <AreaChart />

                                    <Tabs defaultValue="subjects" className="w-full">
                                        <TabsList>
                                            <TabsTrigger value="subjects">Môn học</TabsTrigger>
                                            <TabsTrigger value="exams">Đề thi</TabsTrigger>
                                            <TabsTrigger value="content">Nội dung</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="subjects" className="mt-4">
                                            <div className="rounded-lg border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-12">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300"
                                                                    checked={selectedRows.size === subjects.length && subjects.length > 0}
                                                                    onChange={() => toggleSelectAll(subjects.map(s => s.id))}
                                                                />
                                                            </TableHead>
                                                            <TableHead>Tên môn học</TableHead>
                                                            <TableHead>Loại</TableHead>
                                                            <TableHead>Trạng thái</TableHead>
                                                            <TableHead>Bài học</TableHead>
                                                            <TableHead className="text-right"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {subjects.map((subject) => {
                                                            const subjectUnits = units[subject.id] || [];
                                                            return (
                                                                <TableRow key={subject.id}>
                                                                    <TableCell>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300"
                                                                            checked={selectedRows.has(subject.id)}
                                                                            onChange={() => toggleSelectRow(subject.id)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline">Môn học</Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                                                                            Hoạt động
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>{subjectUnits.length}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Link href={`/admin/subject/${subject.id}`}>
                                                                            <Button variant="ghost" size="icon">
                                                                                <Edit2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="exams" className="mt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-sm text-muted-foreground">
                                                    {selectedRows.size > 0 && (
                                                        <span>{selectedRows.size} mục đã chọn</span>
                                                    )}
                                                </div>
                                                {selectedRows.size > 0 && (
                                                    <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="rounded-lg border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-12">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300"
                                                                    checked={selectedRows.size === paginatedExams.length && paginatedExams.length > 0}
                                                                    onChange={() => toggleSelectAll(paginatedExams.map(e => e.id))}
                                                                />
                                                            </TableHead>
                                                            <TableHead>Tên đề thi</TableHead>
                                                            <TableHead>Loại</TableHead>
                                                            <TableHead>Thời gian</TableHead>
                                                            <TableHead>Số câu</TableHead>
                                                            <TableHead className="text-right"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {paginatedExams.map((exam) => (
                                                            <TableRow key={exam.id}>
                                                                <TableCell>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="h-4 w-4 rounded border-gray-300"
                                                                        checked={selectedRows.has(exam.id)}
                                                                        onChange={() => toggleSelectRow(exam.id)}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-medium">{exam.title}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline">{exam.type}</Badge>
                                                                </TableCell>
                                                                <TableCell>{exam.duration} phút</TableCell>
                                                                <TableCell>{exam.questions?.length || exam.questionCount || 0}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <Link href={`/admin/exams/${exam.id}`}>
                                                                        <Button variant="ghost" size="icon">
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>Hiển thị</span>
                                                    <Select
                                                        value={rowsPerPage.toString()}
                                                        onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                                                        options={[
                                                            { value: "5", label: "5" },
                                                            { value: "10", label: "10" },
                                                            { value: "20", label: "20" },
                                                        ]}
                                                        className="w-16"
                                                    />
                                                    <span>mục</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        Trang {currentPage} / {totalPages || 1}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={currentPage === 1}
                                                            onClick={() => setCurrentPage(p => p - 1)}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={currentPage >= totalPages}
                                                            onClick={() => setCurrentPage(p => p + 1)}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="content" className="mt-4">
                                            <div className="rounded-lg border p-8 text-center text-muted-foreground">
                                                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                                <p>Chọn mục "Môn học" hoặc "Đề thi" để quản lý nội dung.</p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}

                            {activeSection === 'subjects' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold">Môn học</h1>
                                            <p className="text-muted-foreground">Quản lý các môn học trong hệ thống.</p>
                                        </div>
                                        <Link href="/admin/subject/new">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" /> Thêm môn học
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredSubjects.map(subject => {
                                            const subjectUnits = units[subject.id] || [];
                                            return (
                                                <Link key={subject.id} href={`/admin/subject/${subject.id}`} className="block">
                                                    <div className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-all cursor-pointer group">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="p-2 rounded-lg bg-primary/10">
                                                                <BookOpen className="h-5 w-5 text-primary" />
                                                            </div>
                                                            <Badge variant="outline">
                                                                {subjectUnits.length} bài học
                                                            </Badge>
                                                        </div>
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors">{subject.name}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{subject.description}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'exams' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold">Quản lý Đề thi</h1>
                                            <p className="text-muted-foreground">Tạo và quản lý các đề thi.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div
                                            className="rounded-xl border-2 border-dashed bg-muted/5 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all min-h-[160px]"
                                            onClick={() => setOpenExamDialog(true)}
                                        >
                                            <div className="p-3 rounded-full bg-primary/10 mb-3">
                                                <Plus className="h-6 w-6 text-primary" />
                                            </div>
                                            <p className="font-semibold">Tạo đề thi mới</p>
                                            <p className="text-sm text-muted-foreground">Bắt đầu biên soạn đề thi</p>
                                        </div>
                                        {exams.map((exam) => (
                                            <Link key={exam.id} href={`/admin/exams/${exam.id}`} className="block">
                                                <div className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-all cursor-pointer">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <Badge variant="outline">{exam.type}</Badge>
                                                        <span className="text-sm text-muted-foreground">{exam.duration} phút</span>
                                                    </div>
                                                    <h3 className="font-semibold">{exam.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {exam.questions?.length || exam.questionCount || 0} câu hỏi
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'content' && (
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl font-bold">Quản lý Nội dung</h1>
                                        <p className="text-muted-foreground">Chi tiết các bài học và bài tập theo môn.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {subjects.map(subject => {
                                            const subjectUnits = units[subject.id] || [];
                                            return (
                                                <div key={subject.id} className="rounded-xl border bg-card">
                                                    <div className="flex items-center justify-between p-4 border-b">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-primary/10">
                                                                <BookOpen className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <span className="font-semibold">{subject.name}</span>
                                                        </div>
                                                        <Link href={`/admin/subject/${subject.id}/unit/new`}>
                                                            <Button variant="outline" size="sm">
                                                                <Plus className="mr-2 h-4 w-4" /> Thêm bài
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                    <div className="p-4">
                                                        {subjectUnits.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {subjectUnits.map((unit, idx) => (
                                                                    <Link
                                                                        key={unit.id}
                                                                        href={`/admin/subject/${subject.id}/unit/${unit.id}`}
                                                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-muted-foreground font-mono text-sm w-6">{idx + 1}</span>
                                                                            <span className="font-medium">{unit.title}</span>
                                                                        </div>
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {unit.lessons?.length || 0} mục
                                                                        </span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                                Chưa có nội dung
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
