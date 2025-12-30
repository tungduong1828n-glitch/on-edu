'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Unit, Lesson, Exercise, Question } from '@/lib/types';
import {
    ArrowLeft, BookOpen, PenTool, CheckCircle,
    XCircle, ChevronDown, ChevronUp, RotateCcw,
    Lightbulb, Award
} from 'lucide-react';

interface Props {
    params: Promise<{ subject: string; unit: string }>;
}

function TheorySection({ lesson }: { lesson: Lesson }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="glass-card overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-white/40">Lý thuyết</p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
            </button>

            {expanded && (
                <div className="px-5 pb-5 space-y-5">
                    {lesson.theory?.sections?.map(section => (
                        <div key={section.id} className="border-l-2 border-cyan-500/30 pl-4">
                            <h4 className="font-medium text-cyan-400 mb-2">{section.title}</h4>
                            {section.content && (
                                <p className="text-white/70 mb-2 text-sm">{section.content}</p>
                            )}
                            {section.items && section.items.length > 0 && (
                                <ul className="space-y-1.5">
                                    {section.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-white/60 text-sm">
                                            <span className="text-cyan-400 mt-0.5">-</span>
                                            <span className={section.type === 'formula' ? 'font-mono bg-white/5 px-2 py-0.5 rounded text-cyan-300' : ''}>
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function FillBlankExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<Record<string, boolean[]>>({});

    const handleInputChange = (qId: string, blankIdx: number, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: {
                ...(prev[qId] || []),
                [blankIdx]: value
            }
        }));
    };

    const handleSubmit = () => {
        const newResults: Record<string, boolean[]> = {};
        let correct = 0;
        let total = 0;

        exercise.questions.forEach(q => {
            const userAnswers = answers[q.id] || [];
            const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
            const qResults: boolean[] = [];

            correctAnswers.forEach((ans, idx) => {
                const isCorrect = String(userAnswers[idx] || '').toLowerCase().trim() === String(ans).toLowerCase().trim();
                qResults.push(isCorrect);
                if (isCorrect) correct++;
                total++;
            });

            newResults[q.id] = qResults;
        });

        setResults(newResults);
        setSubmitted(true);
        onComplete(correct, total);
    };

    const handleReset = () => {
        setAnswers({});
        setResults({});
        setSubmitted(false);
    };

    const renderQuestionText = (q: Question) => {
        const blanks = Array.isArray(q.answer) ? q.answer : [q.answer];
        const parts = q.text.split(/______/);

        return (
            <div className="flex flex-wrap items-center gap-1 text-sm">
                {parts.map((part, idx) => (
                    <span key={idx}>
                        {part}
                        {idx < parts.length - 1 && (
                            <input
                                type="text"
                                className={`input-field inline-block w-28 mx-1 text-center text-sm py-1.5 ${submitted
                                        ? results[q.id]?.[idx]
                                            ? 'correct-answer'
                                            : 'incorrect-answer'
                                        : ''
                                    }`}
                                value={answers[q.id]?.[idx] || ''}
                                onChange={(e) => handleInputChange(q.id, idx, e.target.value)}
                                disabled={submitted}
                                placeholder="..."
                            />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            {exercise.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {idx + 1}
                        </span>
                        <div className="flex-1">
                            {renderQuestionText(q)}

                            {submitted && !results[q.id]?.every(r => r) && q.explanation && (
                                <div className="mt-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <div className="flex items-start gap-2 text-sm">
                                        <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="text-cyan-400 font-medium">Giải thích: </span>
                                            <span className="text-white/60">{q.explanation}</span>
                                            <div className="mt-1 text-emerald-400 font-medium">
                                                Đáp án: {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3 pt-2">
                {!submitted ? (
                    <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                        <CheckCircle className="w-4 h-4" />
                        Kiểm tra
                    </button>
                ) : (
                    <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5">
                        <RotateCcw className="w-4 h-4" />
                        Làm lại
                    </button>
                )}
            </div>
        </div>
    );
}

function MultipleChoiceExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        let correct = 0;
        exercise.questions.forEach(q => {
            if (answers[q.id] === q.answer) correct++;
        });
        setSubmitted(true);
        onComplete(correct, exercise.questions.length);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
    };

    return (
        <div className="space-y-3">
            {exercise.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {idx + 1}
                        </span>
                        <div className="flex-1">
                            <p className="mb-3 text-sm">{q.text}</p>
                            <div className="flex flex-wrap gap-2">
                                {q.options?.map(opt => {
                                    const isSelected = answers[q.id] === opt;
                                    const isCorrect = opt === q.answer;
                                    let btnClass = 'text-sm py-2 px-4 rounded-lg border transition-all ';

                                    if (submitted) {
                                        if (isCorrect) btnClass += 'correct-answer border-emerald-500';
                                        else if (isSelected && !isCorrect) btnClass += 'incorrect-answer border-red-500';
                                        else btnClass += 'border-white/10 text-white/40';
                                    } else if (isSelected) {
                                        btnClass += 'bg-cyan-500/20 border-cyan-500 text-cyan-400';
                                    } else {
                                        btnClass += 'border-white/10 hover:border-white/20 text-white/70';
                                    }

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                            className={btnClass}
                                            disabled={submitted}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            {submitted && answers[q.id] !== q.answer && q.explanation && (
                                <div className="mt-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <div className="flex items-start gap-2 text-sm">
                                        <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5" />
                                        <span className="text-white/60">{q.explanation}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3 pt-2">
                {!submitted ? (
                    <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                        <CheckCircle className="w-4 h-4" />
                        Kiểm tra
                    </button>
                ) : (
                    <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5">
                        <RotateCcw className="w-4 h-4" />
                        Làm lại
                    </button>
                )}
            </div>
        </div>
    );
}

function RewriteExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<Record<string, boolean>>({});

    const handleSubmit = () => {
        const newResults: Record<string, boolean> = {};
        let correct = 0;

        exercise.questions.forEach(q => {
            const userAns = answers[q.id]?.toLowerCase().replace(/[.,!?]/g, '').trim() || '';
            const correctAns = String(q.answer).toLowerCase().replace(/[.,!?]/g, '').trim();
            const isCorrect = userAns === correctAns;
            newResults[q.id] = isCorrect;
            if (isCorrect) correct++;
        });

        setResults(newResults);
        setSubmitted(true);
        onComplete(correct, exercise.questions.length);
    };

    const handleReset = () => {
        setAnswers({});
        setResults({});
        setSubmitted(false);
    };

    return (
        <div className="space-y-3">
            {exercise.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {idx + 1}
                        </span>
                        <div className="flex-1">
                            <p className="mb-3 text-white/70 text-sm">{q.text}</p>
                            <textarea
                                className={`input-field w-full resize-none text-sm ${submitted ? (results[q.id] ? 'correct-answer' : 'incorrect-answer') : ''
                                    }`}
                                rows={2}
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                disabled={submitted}
                                placeholder="Viết câu trả lời của bạn..."
                            />

                            {submitted && !results[q.id] && (
                                <div className="mt-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <div className="flex items-start gap-2 text-sm">
                                        <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-emerald-400 mb-1 font-medium">Đáp án: {q.answer}</div>
                                            {q.explanation && <div className="text-white/60">{q.explanation}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3 pt-2">
                {!submitted ? (
                    <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                        <CheckCircle className="w-4 h-4" />
                        Kiểm tra
                    </button>
                ) : (
                    <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5">
                        <RotateCcw className="w-4 h-4" />
                        Làm lại
                    </button>
                )}
            </div>
        </div>
    );
}

function SelectExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        let correct = 0;
        exercise.questions.forEach(q => {
            if (answers[q.id] === q.answer) correct++;
        });
        setSubmitted(true);
        onComplete(correct, exercise.questions.length);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
    };

    return (
        <div className="space-y-3">
            {exercise.questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.answer;

                return (
                    <div key={q.id} className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {idx + 1}
                            </span>
                            <div className="flex-1">
                                <p className="mb-3 text-sm">{q.text}</p>
                                <div className="flex gap-2">
                                    {q.options?.map(opt => {
                                        const isSelected = answers[q.id] === opt;
                                        const optIsCorrect = opt === q.answer;
                                        let btnClass = 'text-sm py-2 px-4 rounded-lg border transition-all ';

                                        if (submitted) {
                                            if (optIsCorrect) btnClass += 'correct-answer border-emerald-500';
                                            else if (isSelected && !optIsCorrect) btnClass += 'incorrect-answer border-red-500';
                                            else btnClass += 'border-white/10 text-white/40';
                                        } else if (isSelected) {
                                            btnClass += 'bg-cyan-500/20 border-cyan-500 text-cyan-400';
                                        } else {
                                            btnClass += 'border-white/10 hover:border-white/20 text-white/70';
                                        }

                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                className={btnClass}
                                                disabled={submitted}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {submitted && !isCorrect && q.explanation && (
                                    <div className="mt-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                        <div className="flex items-start gap-2 text-sm">
                                            <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5" />
                                            <span className="text-white/60">{q.explanation}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="flex gap-3 pt-2">
                {!submitted ? (
                    <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                        <CheckCircle className="w-4 h-4" />
                        Kiểm tra
                    </button>
                ) : (
                    <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5">
                        <RotateCcw className="w-4 h-4" />
                        Làm lại
                    </button>
                )}
            </div>
        </div>
    );
}

function ExerciseSection({ lesson }: { lesson: Lesson }) {
    const [expanded, setExpanded] = useState(true);
    const [scores, setScores] = useState<Record<string, { correct: number; total: number }>>({});

    const handleComplete = (exId: string, correct: number, total: number) => {
        setScores(prev => ({ ...prev, [exId]: { correct, total } }));
    };

    const totalScore = Object.values(scores).reduce((acc, s) => acc + s.correct, 0);
    const totalQuestions = Object.values(scores).reduce((acc, s) => acc + s.total, 0);

    return (
        <div className="glass-card overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold">Luyện tập</h3>
                        <p className="text-sm text-white/40">{lesson.exercises?.length || 0} bài tập</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {totalQuestions > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span className="text-white/70">{totalScore}/{totalQuestions}</span>
                        </div>
                    )}
                    {expanded ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
                </div>
            </button>

            {expanded && (
                <div className="px-5 pb-5 space-y-6">
                    {lesson.exercises?.map(ex => (
                        <div key={ex.id}>
                            <h4 className="font-medium text-white/70 mb-4 text-sm">{ex.instruction}</h4>

                            {ex.type === 'fill-blank' && (
                                <FillBlankExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                            {ex.type === 'multiple-choice' && (
                                <MultipleChoiceExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                            {ex.type === 'rewrite' && (
                                <RewriteExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                            {ex.type === 'select' && (
                                <SelectExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function UnitPage({ params }: Props) {
    const { subject: subjectId, unit: unitId } = use(params);
    const [unit, setUnit] = useState<Unit | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(0);

    useEffect(() => {
        fetch(`/api/units/${unitId}?subjectId=${subjectId}`)
            .then(r => r.json())
            .then(data => {
                setUnit(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [subjectId, unitId]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    <div className="h-6 skeleton rounded w-24"></div>
                    <div className="h-10 skeleton rounded w-2/3"></div>
                    <div className="glass-card h-64"></div>
                </div>
            </div>
        );
    }

    if (!unit) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài học</h1>
                <Link href={`/subject/${subjectId}`} className="btn-primary">Quay lại</Link>
            </div>
        );
    }

    const currentLesson = unit.lessons?.[activeLesson];

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <Link
                href={`/subject/${subjectId}`}
                className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </Link>

            <h1 className="text-2xl font-bold mb-2">{unit.title}</h1>
            <p className="text-white/50 mb-8">{unit.description}</p>

            {unit.lessons && unit.lessons.length > 1 && (
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
                    {unit.lessons.map((lesson, idx) => (
                        <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(idx)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeLesson === idx
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {lesson.title}
                        </button>
                    ))}
                </div>
            )}

            {currentLesson && (
                <div className="space-y-6">
                    <TheorySection lesson={currentLesson} />
                    {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                        <ExerciseSection lesson={currentLesson} />
                    )}
                </div>
            )}
        </div>
    );
}
