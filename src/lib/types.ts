export interface Subject {
    _id?: string;
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
    order: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Lesson {
    id: string;
    title: string;
    theory: TheoryContent;
    exercises: Exercise[];
}

export interface TheoryContent {
    sections: TheorySection[];
}

export interface TheorySection {
    id: string;
    title: string;
    type: 'formula' | 'usage' | 'note' | 'example' | 'text';
    content: string;
    items?: string[];
}

export interface Unit {
    _id?: string;
    id: string;
    subjectId: string;
    title: string;
    description: string;
    order: number;
    lessons: Lesson[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Exercise {
    id: string;
    type: 'fill-blank' | 'multiple-choice' | 'rewrite' | 'match' | 'select' | 'unscramble';
    instruction: string;
    questions: Question[];
}

export interface Question {
    id: string;
    text: string;
    blanks?: string[];
    options?: string[];
    answer: string | string[];
    explanation?: string;
    pairs?: { left: string; right: string }[];
}

export interface UserProgress {
    odule: string;
    lessonId: string;
    completed: boolean;
    score: number;
    lastAttempt: Date;
}
