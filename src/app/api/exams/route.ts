import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Exam } from '@/lib/models';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const subjectId = searchParams.get('subjectId');

        console.log('[GET /api/exams] Starting request...');
        console.log('[GET /api/exams] MONGODB_URI exists:', !!process.env.MONGODB_URI);

        const db = await connectToDatabase();
        if (!db) {
            console.error('[GET /api/exams] Failed to connect to database - MONGODB_URI may not be set');
            return NextResponse.json({
                error: 'Database connection failed',
                message: 'MONGODB_URI environment variable may not be configured'
            }, { status: 500 });
        }

        console.log('[GET /api/exams] Database connected successfully');

        let query: Record<string, unknown> = { isActive: true };
        if (type) query.type = type;
        if (subjectId) query.subjectId = subjectId;

        const exams = await Exam.find(query).sort({ createdAt: -1 });
        console.log('[GET /api/exams] Found', exams.length, 'exams');
        return NextResponse.json(exams);

    } catch (error) {
        console.error('[GET /api/exams] Error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const data = await request.json();

        // Generate a simple ID if not provided
        if (!data.id) {
            data.id = `exam-${Date.now()}`;
        }

        if (!data.questionCount && data.questions) {
            data.questionCount = data.questions.length;
        }

        const exam = new Exam(data);
        await exam.save();

        return NextResponse.json(exam, { status: 201 });
    } catch (error) {
        console.error('Error creating exam:', error);
        return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid IDs provided' }, { status: 400 });
        }

        await Exam.deleteMany({ id: { $in: ids } });

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        console.error('Error deleting exams:', error);
        return NextResponse.json({ error: 'Failed to delete exams' }, { status: 500 });
    }
}
