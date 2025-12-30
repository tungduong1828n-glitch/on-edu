import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subject } from '@/lib/models';
import { defaultSubjects } from '@/lib/sampleData';

export async function GET() {
    try {
        const db = await connectToDatabase();

        if (db) {
            const subjects = await Subject.find({ isActive: true }).sort({ order: 1 });
            if (subjects.length === 0) {
                await Subject.insertMany(defaultSubjects);
                return NextResponse.json(defaultSubjects);
            }
            return NextResponse.json(subjects);
        }

        return NextResponse.json(defaultSubjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json(defaultSubjects);
    }
}

export async function POST(request: Request) {
    try {
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const data = await request.json();
        const subject = new Subject(data);
        await subject.save();

        return NextResponse.json(subject, { status: 201 });
    } catch (error) {
        console.error('Error creating subject:', error);
        return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
    }
}
