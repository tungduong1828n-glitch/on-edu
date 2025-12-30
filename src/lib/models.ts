import mongoose, { Schema, Model } from 'mongoose';

const SubjectSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'book' },
    color: { type: String, default: '#3B82F6' },
    gradient: { type: String, default: 'from-blue-500 to-indigo-600' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TheorySectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['formula', 'usage', 'note', 'example', 'text'], default: 'text' },
    content: { type: String, default: '' },
    items: [{ type: String }],
}, { _id: false });

const QuestionSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    blanks: [{ type: String }],
    options: [{ type: String }],
    answer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String },
    pairs: [{
        left: { type: String },
        right: { type: String },
    }],
}, { _id: false });

const ExerciseSchema = new Schema({
    id: { type: String, required: true },
    type: {
        type: String,
        enum: ['fill-blank', 'multiple-choice', 'rewrite', 'match', 'select', 'unscramble'],
        required: true
    },
    instruction: { type: String, required: true },
    questions: [QuestionSchema],
}, { _id: false });

const LessonSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    theory: {
        sections: [TheorySectionSchema],
    },
    exercises: [ExerciseSchema],
}, { _id: false });

const UnitSchema = new Schema({
    id: { type: String, required: true },
    subjectId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    lessons: [LessonSchema],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

UnitSchema.index({ subjectId: 1, id: 1 }, { unique: true });

export const Subject: Model<any> = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
export const Unit: Model<any> = mongoose.models.Unit || mongoose.model('Unit', UnitSchema);
