'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Clock, Flag, AlertCircle, Award, Menu, X, Grid, Lightbulb, CheckCircle2, XCircle, Sparkles, Timer, Zap } from 'lucide-react';
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
                    const modeParam = searchParams.get('mode');
                    setExamType(modeParam || data.type || '15-minute');

                    const key = `exam_progress_v2_${examId}`;
                    try {
                        let finalQuestions = [...data.questions];
                        const saved = localStorage.getItem(key);

                        if (saved) {
                            const p = JSON.parse(saved);
                            if (p.questionIds && Array.isArray(p.questionIds)) {
                                const orderMap = new Map(finalQuestions.map(q => [q.id, q]));
                                const ordered = p.questionIds
                                    .map((id: string) => orderMap.get(id))
                                    .filter((q: any) => q !== undefined);
                                if (ordered.length === finalQuestions.length) {
                                    finalQuestions = ordered;
                                } else {
                                    finalQuestions.sort(() => Math.random() - 0.5);
                                }
                            } else {
                                finalQuestions.sort(() => Math.random() - 0.5);
                            }
                            if (p.answers) setAnswers(p.answers);
                            if (p.flaggedQuestions) setFlaggedQuestions(new Set(p.flaggedQuestions));
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
                            finalQuestions.sort(() => Math.random() - 0.5);
                            setTimeLeft((data.duration || 45) * 60);
                        }
                        setQuestions(finalQuestions);
                    } catch (e) {
                        console.error("Error parsing saved progress", e);
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
        saveState();
    }, [answers, flaggedQuestions, timeLeft, isSubmitted, score, examId, loading, questions]);

    useEffect(() => {
        if (questions.length > 0) {
            setViewedQuestions(prev => new Set(prev).add(questions[currentQuestionIdx]?.id));
            setShowHint(false);
        }
    }, [currentQuestionIdx, questions]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (val: string) => {
        if (isSubmitted && !isReviewMode) return;
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

    const handleSubmit = async () => {
        let correctCount = 0;
        let wrongCount = 0;
        const answersDetail: { questionId: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[] = [];

        questions.forEach(q => {
            const userAnswer = answers[q.id] || '';
            const isCorrect = userAnswer === q.answer;
            if (isCorrect) correctCount++;
            else wrongCount++;

            answersDetail.push({
                questionId: q.id,
                userAnswer,
                correctAnswer: q.answer as string,
                isCorrect
            });
        });

        const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
        setScore(correctCount);
        setIsSubmitted(true);
        setOpenSubmitDialog(false);

        const initialTime = examType === '15-minute' ? 15 * 60 :
            examType === '45-minute' ? 45 * 60 : 45 * 60;
        const timeSpentSeconds = initialTime - timeLeft;

        try {
            await fetch('/api/exam-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: examId,
                    examTitle: unitTitle,
                    score: scorePercent,
                    totalQuestions: questions.length,
                    correctAnswers: correctCount,
                    wrongAnswers: wrongCount,
                    timeSpent: timeSpentSeconds,
                    answers: answersDetail
                })
            });
        } catch (error) {
            console.error('Failed to save exam result:', error);
        }
    };

    const handleRetry = () => {
        if (examId) {
            localStorage.removeItem(`exam_progress_v2_${examId}`);
        }
        window.location.reload();
    };

    const progressPercent = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center font-outfit text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                    <span className="text-white/60">Đang tải đề thi...</span>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6 p-4 text-center text-white">
                <div className="p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 backdrop-blur-md">
                    <AlertCircle className="w-12 h-12 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold font-outfit">Chưa có câu hỏi</h2>
                <p className="text-white/60 max-w-md text-lg">Bài học này chưa có câu hỏi nào để thi thử. Vui lòng quay lại sau.</p>
                <Link href={`/dashboard`}>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-6">Quay lại Dashboard</Button>
                </Link>
            </div>
        );
    }

    if (isSubmitted && !isReviewMode) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-8 p-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-2xl opacity-50" />
                        <div className="relative p-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 backdrop-blur-xl">
                            <Award className="w-20 h-20 text-cyan-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold font-outfit">Kết Quả Bài Thi</h2>
                        <div className="relative">
                            <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 font-outfit">
                                {score}/{questions.length}
                            </div>
                            <div className="text-lg text-cyan-400 font-medium mt-2">{percentage}% đúng</div>
                        </div>
                    </div>

                    <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <p className="text-white/60 max-w-md text-lg">
                        {score === questions.length ? "Tuyệt vời! Bạn đã làm đúng tất cả." :
                            score > questions.length / 2 ? "Làm tốt lắm! Hãy tiếp tục phát huy." :
                                "Cần cố gắng hơn nhé!"}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsReviewMode(true)}
                            className="h-12 px-8 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full"
                        >
                            Xem lại bài làm
                        </Button>
                        <Button
                            onClick={handleRetry}
                            className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/25"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Làm lại bài thi
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIdx];

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col overflow-hidden relative selection:bg-cyan-500/30">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-cyan-500/5 to-transparent" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            <header className="h-18 border-b border-white/5 bg-[#030712]/80 backdrop-blur-2xl shrink-0 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/exams">
                        <Button variant="ghost" size="icon" className="hover:bg-white/5 text-white/60 hover:text-white rounded-full h-10 w-10">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden hover:bg-white/5 text-white/60 hover:text-white rounded-full h-10 w-10"
                        onClick={() => setShowMobileGrid(true)}
                    >
                        <Grid className="w-5 h-5" />
                    </Button>

                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
                    <div className="hidden md:block">
                        <p className="text-xs text-cyan-400/80 uppercase tracking-wider">Đề thi</p>
                        <p className="font-bold text-white/90 truncate max-w-md font-outfit">{unitTitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                        <div className="relative">
                            <Timer className="w-4 h-4 text-cyan-400" />
                            {timeLeft < 300 && <div className="absolute inset-0 animate-ping bg-red-500/50 rounded-full" />}
                        </div>
                        <span className={cn(
                            "font-mono font-bold text-lg min-w-[72px] text-center transition-colors",
                            timeLeft < 300 ? "text-red-400" : timeLeft < 600 ? "text-yellow-400" : "text-cyan-400"
                        )}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {isSubmitted ? (
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleRetry}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 rounded-full h-10"
                            >
                                Lam lại
                            </Button>
                            <Link href="/exams">
                                <Button className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-full h-10 px-5">
                                    Thoát
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setOpenSubmitDialog(true)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 border-0 rounded-full h-10 px-6 transition-all hover:scale-105 active:scale-95"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Nộp bài
                        </Button>
                    )}
                </div>
            </header>

            <div className="h-1 bg-white/5">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="flex-1 flex overflow-hidden relative z-10">
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-3xl space-y-6 pb-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/5 rounded-3xl blur-xl" />
                            <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="flex justify-between items-start mb-8 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-500/30 rounded-xl blur-lg" />
                                            <span className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg font-bold shadow-lg">
                                                {currentQuestionIdx + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 uppercase tracking-wider">Câu hỏi</p>
                                            <h2 className="text-xl md:text-2xl font-bold font-outfit text-white">
                                                {currentQuestionIdx + 1} / {questions.length}
                                            </h2>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "rounded-full transition-all border h-10 px-4",
                                            flaggedQuestions.has(currentQuestion.id)
                                                ? "text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10"
                                                : "text-white/40 border-white/10 hover:text-white hover:bg-white/5"
                                        )}
                                        onClick={toggleFlag}
                                    >
                                        <Flag className={cn("w-4 h-4 mr-2", flaggedQuestions.has(currentQuestion.id) && "fill-current")} />
                                        {flaggedQuestions.has(currentQuestion.id) ? 'Đã ghim' : 'Ghim'}
                                    </Button>
                                </div>

                                {(examType === 'practice' || isSubmitted) && currentQuestion.explanation && (
                                    <div className="mb-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowHint(!showHint)}
                                            className={cn("text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 gap-2 rounded-full", showHint && "bg-yellow-400/10")}
                                        >
                                            <Lightbulb className={cn("w-4 h-4", showHint && "fill-current")} />
                                            {showHint ? "Ẩn gợi ý / giải thích" : "Xem gợi ý"}
                                        </Button>
                                        {showHint && (
                                            <div className="mt-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-100/90 text-sm animate-in fade-in slide-in-from-top-2">
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
                                        const showResult = isSubmitted || (examType === 'practice' && !!userAnswer);

                                        let stateStyle = "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]";
                                        let labelStyle = "bg-white/10 text-white/40";
                                        let icon = null;

                                        if (showResult) {
                                            if (isCorrect) {
                                                stateStyle = "border-green-500/50 bg-green-500/10";
                                                labelStyle = "bg-green-500 text-white";
                                                if (isSelected) icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
                                            } else if (isSelected) {
                                                stateStyle = "border-red-500/50 bg-red-500/10";
                                                labelStyle = "bg-red-500 text-white";
                                                icon = <XCircle className="w-5 h-5 text-red-400" />;
                                            }
                                        } else if (isSelected) {
                                            stateStyle = "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]";
                                            labelStyle = "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30";
                                        }

                                        return (
                                            <div key={idx} className="group">
                                                <Label
                                                    htmlFor={`opt-${idx}`}
                                                    className={cn(
                                                        "flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-200",
                                                        stateStyle
                                                    )}
                                                >
                                                    <RadioGroupItem value={opt} id={`opt-${idx}`} className="sr-only" disabled={isSubmitted} />
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mr-4 transition-all shrink-0",
                                                        labelStyle
                                                    )}>
                                                        {labels[idx] || idx + 1}
                                                    </div>
                                                    <div className="text-base md:text-lg transition-colors flex-1 text-white/80">
                                                        {opt}
                                                    </div>
                                                    {icon}
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </RadioGroup>

                                <div className="mt-10 flex justify-between pt-6 border-t border-white/5">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIdx === 0}
                                        className="rounded-full border-white/10 hover:bg-white/5 hover:text-white text-white/50 h-11 px-6"
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-1" /> Trước
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={currentQuestionIdx === questions.length - 1}
                                        className={cn(
                                            "rounded-full h-11 px-6 transition-all",
                                            currentQuestionIdx === questions.length - 1
                                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                                : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-white border border-cyan-500/20"
                                        )}
                                    >
                                        Sau <ChevronRight className="w-5 h-5 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="w-[300px] bg-[#030712]/90 backdrop-blur-2xl border-l border-white/5 hidden lg:flex flex-col">
                    <div className="p-5 border-b border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-white font-outfit">Danh sách câu hỏi</h3>
                            <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2 py-1 rounded-full">{questions.length} câu</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            <span>Đã làm: {Object.keys(answers).length}/{questions.length}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentQuestionIdx;
                                const isFlagged = flaggedQuestions.has(q.id);
                                const userAnswer = answers[q.id];
                                const isCorrect = userAnswer === q.answer;
                                const showResult = isSubmitted || (examType === 'practice' && !!userAnswer);

                                let bgStyle = "bg-white/[0.03] text-white/30 border-white/5 hover:bg-white/[0.08] hover:text-white/70";

                                if (showResult) {
                                    if (isCorrect) bgStyle = "bg-green-500/20 text-green-400 border-green-500/30";
                                    else if (userAnswer) bgStyle = "bg-red-500/20 text-red-400 border-red-500/30";
                                } else if (isAnswered) {
                                    bgStyle = "bg-blue-500/20 text-blue-300 border-blue-500/30";
                                }

                                if (isFlagged && !showResult) bgStyle = "bg-amber-500/10 text-amber-500 border-amber-500/30";
                                if (isCurrent) bgStyle = "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/30 scale-110 z-10";

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIdx(idx)}
                                        className={cn(
                                            "aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all relative border",
                                            bgStyle
                                        )}
                                    >
                                        {idx + 1}
                                        {isFlagged && (
                                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-5 border-t border-white/5 bg-white/[0.01]">
                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                            <div className="flex items-center gap-2 text-white/50">
                                <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" /> Đã làm
                            </div>
                            <div className="flex items-center gap-2 text-white/50">
                                <div className="w-3 h-3 rounded bg-gradient-to-br from-cyan-500 to-blue-600" /> Đang xem
                            </div>
                            <div className="flex items-center gap-2 text-white/50">
                                <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Chưa làm
                            </div>
                            <div className="flex items-center gap-2 text-white/50">
                                <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /> Đã ghim
                            </div>
                        </div>
                    </div>
                </aside>

                {showMobileGrid && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md lg:hidden flex justify-end animate-in fade-in duration-200"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowMobileGrid(false);
                        }}
                    >
                        <div className="w-[85%] max-w-[320px] h-full bg-[#030712] border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-white font-outfit">Danh sach cau hoi</h3>
                                    <p className="text-xs text-white/40 mt-1">Da lam: {Object.keys(answers).length}/{questions.length}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowMobileGrid(false)} className="hover:bg-white/10 rounded-full h-10 w-10">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((q, idx) => {
                                        const isAnswered = !!answers[q.id];
                                        const isCurrent = idx === currentQuestionIdx;
                                        const isFlagged = flaggedQuestions.has(q.id);
                                        const userAnswer = answers[q.id];
                                        const isCorrect = userAnswer === q.answer;
                                        const showResult = isSubmitted || (examType === 'practice' && !!userAnswer);

                                        let bgStyle = "bg-white/[0.03] text-white/30 border-white/5 hover:bg-white/[0.08]";

                                        if (showResult) {
                                            if (isCorrect) bgStyle = "bg-green-500/20 text-green-400 border-green-500/30";
                                            else if (userAnswer) bgStyle = "bg-red-500/20 text-red-400 border-red-500/30";
                                        } else if (isAnswered) {
                                            bgStyle = "bg-blue-500/20 text-blue-300 border-blue-500/30";
                                        }

                                        if (isFlagged && !showResult) bgStyle = "bg-amber-500/10 text-amber-500 border-amber-500/30";
                                        if (isCurrent) bgStyle = "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/30 scale-110 z-10";

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
                                                    setCurrentQuestionIdx(idx);
                                                    setShowMobileGrid(false);
                                                }}
                                                className={cn(
                                                    "aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all relative border",
                                                    bgStyle
                                                )}
                                            >
                                                {idx + 1}
                                                {isFlagged && (
                                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={openSubmitDialog} onOpenChange={setOpenSubmitDialog}>
                <DialogContent className="bg-[#030712]/95 backdrop-blur-2xl border-white/10 text-white max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-lg" />
                    <DialogHeader className="relative">
                        <DialogTitle className="text-xl font-bold font-outfit flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-cyan-500/10">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                            </div>
                            Xac nhan nop bai?
                        </DialogTitle>
                        <DialogDescription className="text-white/60 mt-4">
                            Ban da hoan thanh <span className="text-cyan-400 font-bold">{Object.keys(answers).length}/{questions.length}</span> cau hoi.
                            <br />
                            {Object.keys(answers).length < questions.length && (
                                <span className="text-yellow-400">Con {questions.length - Object.keys(answers).length} cau chua lam!</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="relative mt-4">
                        <Button variant="ghost" onClick={() => setOpenSubmitDialog(false)} className="hover:bg-white/5 text-white rounded-full">Huy</Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 rounded-full px-6"
                        >
                            Nop bai
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ExamPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#030712] flex items-center justify-center font-outfit text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                    <span className="text-white/60">Dang tai...</span>
                </div>
            </div>
        }>
            <ExamContent />
        </Suspense>
    );
}
