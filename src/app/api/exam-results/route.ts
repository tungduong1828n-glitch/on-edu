import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const examId = searchParams.get('examId');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = {};
        if (examId) {
            query = { examId };
        }

        const results = await db
            .collection('exam_results')
            .find(query)
            .sort({ submittedAt: -1 })
            .limit(limit)
            .toArray();

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching exam results:', error);
        return NextResponse.json({ error: 'Failed to fetch exam results' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const body = await request.json();

        const result = {
            id: `result-${Date.now()}`,
            examId: body.examId,
            examTitle: body.examTitle || 'Unknown Exam',
            userId: body.userId || 'anonymous',
            userName: body.userName || 'Nguoi dung',
            score: body.score || 0,
            totalQuestions: body.totalQuestions || 0,
            correctAnswers: body.correctAnswers || 0,
            wrongAnswers: body.wrongAnswers || 0,
            timeSpent: body.timeSpent || 0,
            answers: body.answers || [],
            submittedAt: new Date(),
            createdAt: new Date(),
        };

        await db.collection('exam_results').insertOne(result);

        return NextResponse.json({ success: true, id: result.id });
    } catch (error) {
        console.error('Error saving exam result:', error);
        return NextResponse.json({ error: 'Failed to save exam result' }, { status: 500 });
    }
}
