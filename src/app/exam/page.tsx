'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Clock, Flag, AlertCircle, Award, Menu, X, Grid, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { Unit } from '@/lib/types';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

function ExamContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const unitId = searchParams.get('unitId');
    const subjectId = searchParams.get('subjectId');
    const examId = searchParams.get('examId');

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unitTitle, setUnitTitle] = useState('');

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [viewedQuestions, setViewedQuestions] = useState<Set<string>>(new Set(['0']));
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [timeLeft, setTimeLeft] = useState(45 * 60);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const [showMobileGrid, setShowMobileGrid] = useState(false);
    const [examType, setExamType] = useState<string>('15-minute');
    const [showHint, setShowHint] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);

    // Initial Data Fetch & Restore
    useEffect(() => {
        if (examId) {
            fetch(`/api/exams/${examId}`)
                .then(r => r.json())
                .then((data) => {
                    if (data.error || !data.questions) {
                        console.error("Exam load failed", data);
                        setLoading(false);
                        return;
                    }
                    setUnitTitle(data.title);
                    setUnitTitle(data.title);
                    // Questions set handled in persistence block below
                    // setQuestions(data.questions);

                    // Override type if mode query exists
                    const modeParam = searchParams.get('mode');
                    setExamType(modeParam || data.type || '15-minute');

                    // Persistence Check
                    const key = `exam_progress_v2_${examId}`;
                    try {
                        let finalQuestions = [...data.questions];
                        const saved = localStorage.getItem(key);

                        if (saved) {
                            const p = JSON.parse(saved);

                            // Restore Question Order if exists
                            if (p.questionIds && Array.isArray(p.questionIds)) {
                                const orderMap = new Map(finalQuestions.map(q => [q.id, q]));
                                const ordered = p.questionIds
                                    .map((id: string) => orderMap.get(id))
                                    .filter((q: any) => q !== undefined);

                                // Only use ordered if length matches (integrity check)
                                if (ordered.length === finalQuestions.length) {
                                    finalQuestions = ordered;
                                } else {
                                    // Fallback shuffle if data mismatch
                                    finalQuestions.sort(() => Math.random() - 0.5);
                                }
                            } else {
                                // Legacy save (no order) -> Shuffle
                                finalQuestions.sort(() => Math.random() - 0.5);
                            }

                            if (p.answers) setAnswers(p.answers);
                            if (p.flaggedQuestions) setFlaggedQuestions(new Set(p.flaggedQuestions));

                            // Restore submission state
                            if (p.isSubmitted) {
                                setIsSubmitted(true);
                                setScore(p.score || 0);
                                setTimeLeft(0);
                            } else if (p.timeLeft && p.timeLeft > 0) {
                                setTimeLeft(p.timeLeft);
                            } else {
                                setTimeLeft((data.duration || 45) * 60);
                            }
                        } else {
                            // New Exam -> Shuffle
                            finalQuestions.sort(() => Math.random() - 0.5);
                            setTimeLeft((data.duration || 45) * 60);
                        }

                        setQuestions(finalQuestions);
                    } catch (e) {
                        console.error("Error parsing saved progress", e);
                        // Error fallback
                        setQuestions(data.questions.sort(() => Math.random() - 0.5));
                        setTimeLeft((data.duration || 45) * 60);
                    }

                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch exam data", err);
                    setLoading(false);
                });
        } else if (unitId && subjectId) {
            // Legacy Fetch Logic
            fetch(`/api/units/${unitId}?subjectId=${subjectId}`)
                .then(r => r.json())
                .then((data: Unit) => {
                    setUnitTitle(data.title);
                    const allQuestions = data.lessons?.flatMap(lesson =>
                        lesson.exercises?.flatMap(ex =>
                            ex.questions?.map(q => ({
                                ...q,
                                id: `${lesson.id}-${ex.id}-${q.id}`
                            })) || []
                        ) || []
                    ) || [];

                    setQuestions(allQuestions);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch exam data", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [unitId, subjectId, examId]);

    // Timer Countdown
    useEffect(() => {
        if (isSubmitted || loading) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSubmitted, loading]);


    // Save Progress Interval
    useEffect(() => {
        if (!examId || loading || questions.length === 0) return;
        const key = `exam_progress_v2_${examId}`;
        const saveState = () => {
            localStorage.setItem(key, JSON.stringify({
                answers,
                flaggedQuestions: Array.from(flaggedQuestions),
                timeLeft,
                isSubmitted,
                score,
                timestamp: Date.now(),
                questionIds: questions.map(q => q.id)
            }));
        };
        // Save on changes
        saveState();
    }, [answers, flaggedQuestions, timeLeft, isSubmitted, score, examId, loading, questions]);


    useEffect(() => {
        if (questions.length > 0) {
            setViewedQuestions(prev => new Set(prev).add(questions[currentQuestionIdx]?.id));
            setShowHint(false); // Reset hint on question change
        }
    }, [currentQuestionIdx, questions]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (val: string) => {
        if (isSubmitted && !isReviewMode) return; // Prevent changing if submitted (unless strictly reviewing, but usually review is read-only)
        if (isSubmitted) return;

        const qId = questions[currentQuestionIdx].id;
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const toggleFlag = () => {
        const qId = questions[currentQuestionIdx].id;
        const newFlags = new Set(flaggedQuestions);
        if (newFlags.has(qId)) newFlags.delete(qId);
        else newFlags.add(qId);
        setFlaggedQuestions(newFlags);
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.answer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setIsSubmitted(true);
        setOpenSubmitDialog(false);
        // Persisted mostly via useEffect on isSubmitted change
    };

    const handleRetry = () => {
        if (examId) {
            localStorage.removeItem(`exam_progress_v2_${examId}`);
        }
        window.location.reload();
    };

    if (loading) {
        return <div className="min-h-screen bg-gradient-mesh flex items-center justify-center font-outfit text-white">Đang tải đề thi...</div>;
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center gap-6 p-4 text-center text-white">
                <div className="p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <AlertCircle className="w-12 h-12 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold font-outfit">Chưa có câu hỏi</h2>
                <p className="text-white/60 max-w-md text-lg">Bài học này chưa có câu hỏi nào để thi thử. Vui lòng quay lại sau.</p>
                <Link href={`/dashboard`}>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Quay lại Dashboard</Button>
                </Link>
            </div>
        );
    }

    // Results View
    if (isSubmitted && !isReviewMode) {
        return (
            <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center gap-8 p-4 text-center text-white animate-in zoom-in duration-500">
                <div className="p-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)]">
                    <Award className="w-20 h-20 text-cyan-400" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold font-outfit">Kết Quả Bài Thi</h2>
                    <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                        {score} / {questions.length}
                    </div>
                    <p className="text-xl text-cyan-200">Điểm số của bạn</p>
                </div>

                <p className="text-white/60 max-w-md text-lg">
                    {score === questions.length ? "Tuyệt vời! Bạn đã làm đúng tất cả." :
                        score > questions.length / 2 ? "Làm tốt lắm! Hãy tiếp tục phát huy." :
                            "Cần cố gắng hơn nhé!"}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsReviewMode(true)}
                        className="h-12 px-8 border-white/20 text-white hover:bg-white/10 rounded-full"
                    >
                        Xem lại bài làm
                    </Button>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="h-12 px-8 text-white/70 hover:text-white hover:bg-white/5 rounded-full">Quay lại Dashboard</Button>
                    </Link>
                    <Button
                        onClick={handleRetry}
                        className="h-12 px-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg shadow-cyan-500/20"
                    >
                        Làm lại bài thi
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIdx];

    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col overflow-hidden relative selection:bg-cyan-500/30">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="hover:bg-white/5 text-white/60 hover:text-white rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Mobile Grid Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden hover:bg-white/5 text-white/60 hover:text-white rounded-full"
                        onClick={() => setShowMobileGrid(true)}
                    >
                        <Grid className="w-5 h-5" />
                    </Button>

                    <div className="h-6 w-px bg-white/10 hidden md:block" />
                    <div className="font-bold text-lg hidden md:block truncate max-w-md text-cyan-50 font-outfit tracking-wide">
                        {unitTitle}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono font-medium text-cyan-50 min-w-[60px] text-center">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {isSubmitted ? (
                        <div className="flex items-center gap-2">
                            {/* In review mode, show 'Retry' or 'Exit' */}
                            <Button
                                onClick={handleRetry}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 rounded-full"
                            >
                                Làm lại
                            </Button>
                            <Link href="/dashboard">
                                <Button
                                    className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-full px-6"
                                >
                                    Thoát
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setOpenSubmitDialog(true)}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20 border-0 rounded-full px-6 transition-all transform hover:scale-105 active:scale-95"
                        >
                            Nộp bài
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-3xl space-y-6 pb-20">
                        {/* Question Card */}
                        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            {/* Card Accent */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-50" />

                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-xl md:text-2xl font-bold font-outfit flex items-center gap-4 text-white/90">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg border border-cyan-500/20 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]">
                                        {currentQuestionIdx + 1}
                                    </span>
                                    <span>Câu hỏi {currentQuestionIdx + 1}</span>
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "rounded-full transition-all border",
                                        flaggedQuestions.has(currentQuestion.id)
                                            ? "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
                                            : "text-white/40 border-transparent hover:text-white hover:bg-white/5"
                                    )}
                                    onClick={toggleFlag}
                                >
                                    <Flag className={cn("w-4 h-4 mr-2", flaggedQuestions.has(currentQuestion.id) && "fill-current")} />
                                    {flaggedQuestions.has(currentQuestion.id) ? 'Đã ghim' : 'Ghim'}
                                </Button>
                            </div>

                            {/* Hint Section */}
                            {(examType === 'practice' || isSubmitted) && currentQuestion.explanation && (
                                <div className="mb-6">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowHint(!showHint)}
                                        className={cn("text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 gap-2", showHint && "bg-yellow-400/10")}
                                    >
                                        <Lightbulb className={cn("w-4 h-4", showHint && "fill-current")} />
                                        {showHint ? "Ẩn gợi ý / giải thích" : "Xem gợi ý"}
                                    </Button>
                                    {showHint && (
                                        <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-100/90 text-sm animate-in fade-in slide-in-from-top-2">
                                            <p className="font-bold mb-1 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Giải thích:</p>
                                            {currentQuestion.explanation}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="text-lg md:text-xl leading-relaxed mb-10 text-white/80 font-medium">
                                {currentQuestion.text}
                            </div>

                            <RadioGroup
                                value={answers[currentQuestion.id] || ''}
                                onValueChange={handleAnswer}
                                className="space-y-3"
                            >
                                {(currentQuestion.options || []).map((opt: string, idx: number) => {
                                    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
                                    const userAnswer = answers[currentQuestion.id];
                                    const isSelected = userAnswer === opt;
                                    const isCorrect = opt === currentQuestion.answer;

                                    // Feedback Logic
                                    // Show correct answer if: Submitted OR (Practice mode AND question is answered)
                                    const showResult = isSubmitted || (examType === 'practice' && !!userAnswer);

                                    let stateStyle = "border-white/5 bg-white/[0.02]";
                                    let icon = null;

                                    if (showResult) {
                                        if (isCorrect) {
                                            stateStyle = "border-green-500/50 bg-green-500/10 text-green-100";
                                            if (isSelected) icon = <CheckCircle2 className="w-5 h-5 text-green-400 absolute right-4" />;
                                        } else if (isSelected) {
                                            stateStyle = "border-red-500/50 bg-red-500/10 text-red-100";
                                            icon = <XCircle className="w-5 h-5 text-red-400 absolute right-4" />;
                                        }
                                    } else if (isSelected) {
                                        stateStyle = "border-cyan-500/50 bg-cyan-950/10 shadow-[0_0_0_1px_rgba(6,182,212,0.3)]";
                                    }

                                    return (
                                        <div key={idx} className="relative group">
                                            <div className={cn(
                                                "absolute inset-0 rounded-2xl transition-opacity duration-300",
                                                isSelected && !showResult ? "bg-cyan-500/10 opacity-100" : "opacity-0 group-hover:opacity-10"
                                            )} />
                                            <Label
                                                htmlFor={`opt-${idx}`}
                                                className={cn(
                                                    "relative flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-200",
                                                    !showResult && "group-hover:border-white/20",
                                                    stateStyle
                                                )}
                                            >
                                                <RadioGroupItem value={opt} id={`opt-${idx}`} className="sr-only" disabled={isSubmitted} />
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 transition-all shrink-0",
                                                    showResult && isCorrect ? "bg-green-500 text-white" :
                                                        showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                                                            isSelected ? "bg-cyan-500 text-white shadow-lg" : "bg-white/10 text-white/40 group-hover:bg-white/20 group-hover:text-white/80"
                                                )}>
                                                    {labels[idx] || idx + 1}
                                                </div>
                                                <div className={cn(
                                                    "text-base md:text-lg transition-colors flex-1 mr-6",
                                                    showResult && isCorrect ? "text-green-50" :
                                                        showResult && isSelected && !isCorrect ? "text-red-50" :
                                                            isSelected ? "text-cyan-50" : "text-white/60 group-hover:text-white/90"
                                                )}>
                                                    {opt}
                                                </div>
                                                {icon}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>

                            {/* Navigation Buttons */}
                            <div className="mt-10 flex justify-between pt-6 border-t border-white/5">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIdx === 0}
                                    className="rounded-full border-white/10 hover:bg-white/5 hover:text-white text-white/50"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" /> Trước
                                </Button>
                                <Button
                                    onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                    disabled={currentQuestionIdx === questions.length - 1}
                                    className={cn(
                                        "rounded-full px-6 transition-all",
                                        currentQuestionIdx === questions.length - 1
                                            ? "bg-white/10 text-white/30 cursor-not-allowed"
                                            : "bg-white/10 hover:bg-white/20 text-white"
                                    )}
                                >
                                    Sau <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modern Sidebar */}
                <aside className="w-[320px] bg-black/40 backdrop-blur-2xl border-l border-white/5 hidden lg:flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white font-outfit mb-1">Danh sách câu hỏi</h3>
                        <p className="text-sm text-white/40">Tổng số: <span className="text-cyan-400 font-mono">{questions.length}</span> câu</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentQuestionIdx;
                                const isFlagged = flaggedQuestions.has(q.id);

                                // Sidebar color logic
                                const userAnswer = answers[q.id];
                                const isCorrect = userAnswer === q.answer;
                                const showResult = isSubmitted || (examType === 'practice' && !!userAnswer);

                                let bgStyle = "bg-white/5 text-white/30 border-white/5 hover:bg-white/10 hover:end-white/10 hover:text-white/70";

                                if (showResult) {
                                    if (isCorrect) bgStyle = "bg-green-500/20 text-green-400 border-green-500/30";
                                    else if (userAnswer) bgStyle = "bg-red-500/20 text-red-400 border-red-500/30";
                                    else bgStyle = "bg-white/5 text-white/30 border-white/5"; // Unanswered
                                } else if (isAnswered) {
                                    bgStyle = "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30";
                                }

                                if (isFlagged) bgStyle = "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20";
                                if (isCurrent) bgStyle = "bg-cyan-600 text-white border-cyan-400/50 shadow-[0_0_15px_-3px_rgba(6,182,212,0.6)] scale-110 z-10";


                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIdx(idx)}
                                        className={cn(
                                            "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative group border",
                                            bgStyle
                                        )}
                                    >
                                        {idx + 1}
                                        {isFlagged && (
                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" /> Đã làm
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <div className="w-3 h-3 rounded bg-cyan-600 border border-cyan-400/50" /> Đang chọn
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Chưa làm
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /> Đã ghim
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Mobile Question Sidebar Overlay */}
                {showMobileGrid && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md lg:hidden flex justify-end animate-in fade-in duration-200">
                        <div className="w-[85%] max-w-[320px] h-full bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-outfit mb-1">Danh sách câu hỏi</h3>
                                    <p className="text-sm text-white/40">Tổng số: <span className="text-cyan-400 font-mono">{questions.length}</span> câu</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowMobileGrid(false)} className="hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <div className="grid grid-cols-5 gap-3">
                                    {questions.map((q, idx) => {
                                        const isAnswered = !!answers[q.id];
                                        const isCurrent = idx === currentQuestionIdx;
                                        const isFlagged = flaggedQuestions.has(q.id);

                                        // Sidebar color logic
                                        const userAnswer = answers[q.id];
                                        const isCorrect = userAnswer === q.answer;
                                        const showResult = isSubmitted || (examType === 'practice' && !!userAnswer);

                                        let bgStyle = "bg-white/5 text-white/30 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white/70";

                                        if (showResult) {
                                            if (isCorrect) bgStyle = "bg-green-500/20 text-green-400 border-green-500/30";
                                            else if (userAnswer) bgStyle = "bg-red-500/20 text-red-400 border-red-500/30";
                                            else bgStyle = "bg-white/5 text-white/30 border-white/5"; // Unanswered
                                        } else if (isAnswered) {
                                            bgStyle = "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30";
                                        }

                                        if (isFlagged) bgStyle = "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20";
                                        if (isCurrent) bgStyle = "bg-cyan-600 text-white border-cyan-400/50 shadow-[0_0_15px_-3px_rgba(6,182,212,0.6)] scale-110 z-10";

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
                                                    setCurrentQuestionIdx(idx);
                                                    setShowMobileGrid(false);
                                                }}
                                                className={cn(
                                                    "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative group border",
                                                    bgStyle
                                                )}
                                            >
                                                {idx + 1}
                                                {isFlagged && (
                                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" /> Đã làm
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        <div className="w-3 h-3 rounded bg-cyan-600 border border-cyan-400/50" /> Đang chọn
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Chưa làm
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /> Đã ghim
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Confirmation Dialog */}
            <Dialog open={openSubmitDialog} onOpenChange={setOpenSubmitDialog}>
                <DialogContent className="bg-[#09090b]/95 backdrop-blur-xl border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold font-outfit">Xác nhận nộp bài?</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Bạn đã hoàn thành <span className="text-cyan-400 font-bold">{Object.keys(answers).length}/{questions.length}</span> câu hỏi.
                            <br />
                            Bạn có chắc chắn muốn nộp bài ngay bây giờ không?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpenSubmitDialog(false)} className="hover:bg-white/5 text-white">Huỷ</Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 rounded-full px-6"
                        >
                            Nộp bài
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ExamPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-mesh flex items-center justify-center font-outfit text-white">Đang tải...</div>}>
            <ExamContent />
        </Suspense>
    );
}
