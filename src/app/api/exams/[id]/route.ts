import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Exam } from '@/lib/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const exam = await Exam.findOne({ id });
        if (!exam) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        const data = await request.json();

        // If updating questions, ensure questionCount is updated
        if (data.questions) {
            data.questionCount = data.questions.length;
        }

        const exam = await Exam.findOneAndUpdate(
            { id },
            { $set: data },
            { new: true }
        );

        if (!exam) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        await Exam.findOneAndDelete({ id });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
