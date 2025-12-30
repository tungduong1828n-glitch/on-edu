'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subject, Unit, Exam } from '@/lib/types';
import {
    BookOpen, Plus, Edit2,
    LayoutDashboard, FileText, Settings,
    Calculator, Atom, FlaskConical, Landmark,
    Users, TrendingUp, LogOut, Search, Menu, X, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Record<string, Unit[]>>({});
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [examSearchTerm, setExamSearchTerm] = useState('');
    const [openExamDialog, setOpenExamDialog] = useState(false);
    const [selectedExams, setSelectedExams] = useState<Set<string>>(new Set());
    const [newExam, setNewExam] = useState<Partial<Exam>>({
        title: '',
        duration: 15,
        type: '15-minute',
        subjectId: ''
    });
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const toggleSelectExam = (id: string) => {
        const newSelected = new Set(selectedExams);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedExams(newSelected);
    };

    const toggleSelectAllExams = () => {
        if (selectedExams.size === filteredExams.length) {
            setSelectedExams(new Set());
        } else {
            setSelectedExams(new Set(filteredExams.map(e => e.id)));
        }
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`Bạn có chắc muốn xóa ${selectedExams.size} đề thi đã chọn?`)) return;

        try {
            const res = await fetch('/api/exams', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedExams) })
            });

            if (res.ok) {
                setExams(exams.filter(e => !selectedExams.has(e.id)));
                setSelectedExams(new Set());
            }
        } catch (error) {
            console.error("Failed to delete exams", error);
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

    // ... (fetch logic remains same)
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

                // Fetch exams
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
        e.title.toLowerCase().includes(examSearchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card/50 hidden lg:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            EduAdmin
                        </h2>
                        {/* Added ModeToggle here for easy access in sidebar context if header is hidden, 
                though header is global now, having it here might be redundant but user asked for it specifically. 
                Actually, since I added a global header, I don't strictly need it here, 
                but I'll leave it out to avoid clutter since it's up top. 
                Wait, global header is Sticky. */}
                    </div>

                    <nav className="space-y-1">
                        <Button
                            variant={activeSection === 'dashboard' ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => setActiveSection('dashboard')}
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Tổng quan
                        </Button>

                        <Button
                            variant={activeSection === 'subjects' ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => setActiveSection('subjects')}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Môn học
                        </Button>

                        <Button
                            variant={activeSection === 'content' ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => setActiveSection('content')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Nội dung
                        </Button>

                        <Button
                            variant={activeSection === 'exams' ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm font-medium"
                            onClick={() => setActiveSection('exams')}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Quản lý Đề thi
                        </Button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                    </Button>
                </div>
            </aside>

            {/* Mobile Nav Overlay */}
            {isMobileNavOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden">
                    <div className="fixed inset-y-0 left-0 w-72 border-r bg-background p-6 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                EduAdmin
                            </h2>
                            <Button size="icon" variant="ghost" onClick={() => setIsMobileNavOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            <Button
                                variant={activeSection === 'dashboard' ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-sm font-medium"
                                onClick={() => { setActiveSection('dashboard'); setIsMobileNavOpen(false); }}
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Tổng quan
                            </Button>
                            <Button
                                variant={activeSection === 'subjects' ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-sm font-medium"
                                onClick={() => { setActiveSection('subjects'); setIsMobileNavOpen(false); }}
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Môn học
                            </Button>
                            <Button
                                variant={activeSection === 'content' ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-sm font-medium"
                                onClick={() => { setActiveSection('content'); setIsMobileNavOpen(false); }}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Nội dung
                            </Button>
                            <Button
                                variant={activeSection === 'exams' ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-sm font-medium"
                                onClick={() => { setActiveSection('exams'); setIsMobileNavOpen(false); }}
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Quản lý Đề thi
                            </Button>
                        </nav>
                        <div className="pt-6 border-t mt-auto">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="lg:hidden flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            EduAdmin
                        </h2>
                        <Button variant="outline" size="sm" onClick={() => setIsMobileNavOpen(true)}>
                            <Menu className="w-4 h-4 mr-2" /> Menu
                        </Button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {activeSection === 'dashboard' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                                            <p className="text-muted-foreground mt-1">Tổng quan hệ thống và hoạt động gần đây.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Tổng Môn học</CardTitle>
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{subjects.length}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Tổng Bài học</CardTitle>
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{totalUnits}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Tổng Bài tập</CardTitle>
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{totalExercises}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Học sinh</CardTitle>
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">1,234</div>
                                                <p className="text-xs text-muted-foreground">
                                                    +180 từ tháng trước
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="col-span-4 border-border/50">
                                        <CardHeader>
                                            <CardTitle>Môn học & Nội dung</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {subjects.slice(0, 5).map(subject => {
                                                    const subjectUnits = units[subject.id] || [];
                                                    return (
                                                        <Link key={subject.id} href={`/admin/subject/${subject.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors`}>
                                                                    <BookOpen className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium group-hover:text-primary transition-colors">{subject.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{subjectUnits.length} bài học</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                                <Edit2 className="h-4 w-4" />
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeSection === 'subjects' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight">Môn học</h1>
                                            <p className="text-muted-foreground mt-1">Quản lý các môn học trong hệ thống.</p>
                                        </div>
                                        <Link href="/admin/subject/new">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" /> Thêm Môn học
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1 max-w-sm">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Tìm kiếm môn học..."
                                                className="pl-8"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredSubjects.map(subject => {
                                            const subjectUnits = units[subject.id] || [];
                                            return (
                                                <Card key={subject.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{subject.name}</CardTitle>
                                                        <Link href={`/admin/subject/${subject.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">{subject.description}</p>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            {subjectUnits.length} cuốn sách / bài học
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'content' && (
                                <div className="space-y-6">
                                    {/* ... (content section remains largely the same, minor polish) */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight">Quản lý Nội dung</h1>
                                            <p className="text-muted-foreground mt-1">Chi tiết các bài học và bài tập theo môn.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {subjects.map(subject => {
                                            const subjectUnits = units[subject.id] || [];
                                            return (
                                                <Card key={subject.id}>
                                                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                                                <BookOpen className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <CardTitle className="text-xl">{subject.name}</CardTitle>
                                                        </div>
                                                        <Link href={`/admin/subject/${subject.id}/unit/new`}>
                                                            <Button variant="outline" size="sm">
                                                                <Plus className="mr-2 h-4 w-4" /> Thêm Bài
                                                            </Button>
                                                        </Link>
                                                    </CardHeader>
                                                    <CardContent className="pt-6">
                                                        {subjectUnits.length > 0 ? (
                                                            <div className="grid gap-2">
                                                                {subjectUnits.map((unit, idx) => (
                                                                    <Link key={unit.id} href={`/admin/subject/${subject.id}/unit/${unit.id}`} className="block">
                                                                        <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/80 border border-transparent hover:border-border transition-all">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-muted-foreground font-mono text-sm w-6">{idx + 1}</span>
                                                                                <span className="font-medium">{unit.title}</span>
                                                                            </div>
                                                                            <div className="text-sm text-muted-foreground">
                                                                                {unit.lessons?.length || 0} mục
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/5">
                                                                Chưa có nội dung
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'exams' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/50 p-4 rounded-lg border backdrop-blur-sm sticky top-0 z-10">
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className="relative flex-1 max-w-sm">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="search"
                                                    placeholder="Tìm kiếm đề thi..."
                                                    className="pl-8"
                                                    value={examSearchTerm}
                                                    onChange={(e) => setExamSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {selectedExams.size > 0 && (
                                                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa ({selectedExams.size})
                                                </Button>
                                            )}

                                            <Dialog open={openExamDialog} onOpenChange={setOpenExamDialog}>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Plus className="mr-2 h-4 w-4" /> Tạo Đề thi mới
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Tạo Đề thi mới</DialogTitle>
                                                        <DialogDescription>
                                                            Nhập thông tin cơ bản cho đề thi mới.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="title">Tên kỳ thi</Label>
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
                                                            <select
                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                value={newExam.type}
                                                                onChange={(e) => setNewExam({ ...newExam, type: e.target.value as any })}
                                                            >
                                                                <option value="15-minute">15 Phút</option>
                                                                <option value="45-minute">45 Phút (1 tiết)</option>
                                                                <option value="midterm-1">Giữa kỳ 1</option>
                                                                <option value="final-1">Cuối kỳ 1</option>
                                                                <option value="midterm-2">Giữa kỳ 2</option>
                                                                <option value="final-2">Cuối kỳ 2</option>
                                                                <option value="practice">Luyện tập</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setOpenExamDialog(false)}>Hủy</Button>
                                                        <Button onClick={handleCreateExam}>Tạo mới</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-1">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-primary text-primary focus:ring-primary accent-primary cursor-pointer"
                                            checked={filteredExams.length > 0 && selectedExams.size === filteredExams.length}
                                            onChange={toggleSelectAllExams}
                                            id="select-all"
                                        />
                                        <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer select-none">
                                            Chọn tất cả ({filteredExams.length})
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <Card
                                            className="hover:border-primary/50 transition-all cursor-pointer group border-dashed border-2 bg-muted/5"
                                            onClick={() => setOpenExamDialog(true)}
                                        >
                                            <CardContent className="flex flex-col items-center justify-center py-12 text-center h-full">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Plus className="w-6 h-6 text-primary" />
                                                </div>
                                                <h3 className="font-semibold text-lg">Tạo đề thi mới</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Bắt đầu biên soạn đề thi từ ngân hàng câu hỏi</p>
                                            </CardContent>
                                        </Card>

                                        {filteredExams.map((exam) => (
                                            <div key={exam.id} className="relative group/card h-full">
                                                <div className="absolute top-3 left-3 z-20">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-cyan-600 cursor-pointer shadow-sm"
                                                        checked={selectedExams.has(exam.id)}
                                                        onChange={() => toggleSelectExam(exam.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <Link href={`/admin/exams/${exam.id}`} className="block h-full">
                                                    <Card className={`hover:border-primary/50 transition-all cursor-pointer group h-full ${selectedExams.has(exam.id) ? 'border-primary bg-primary/5' : ''}`}>
                                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-10">
                                                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1" title={exam.title}>
                                                                {exam.title}
                                                            </CardTitle>
                                                            <Button variant="ghost" size="icon">
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                        </CardHeader>
                                                        <CardContent className="pl-10">
                                                            <div className="flex gap-2 mb-4 flex-wrap">
                                                                <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-0.5 rounded font-medium">Active</span>
                                                                <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded font-medium">{exam.duration} phút</span>
                                                                <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded font-medium uppercase">{exam.type}</span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{exam.questions?.length || exam.questionCount || 0} câu hỏi</p>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            </div>
                                        ))}
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
