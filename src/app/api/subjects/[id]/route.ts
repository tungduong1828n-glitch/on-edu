import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subject } from '@/lib/models';
import { defaultSubjects } from '@/lib/sampleData';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();

        if (db) {
            const subject = await Subject.findOne({ id, isActive: true });
            if (subject) {
                return NextResponse.json(subject);
            }
        }

        const subject = defaultSubjects.find(s => s.id === id);
        if (subject) {
            return NextResponse.json(subject);
        }

        return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    } catch (error) {
        console.error('Error fetching subject:', error);
        return NextResponse.json({ error: 'Failed to fetch subject' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const data = await request.json();
        const subject = await Subject.findOneAndUpdate(
            { id },
            { $set: data },
            { new: true, upsert: true }
        );

        return NextResponse.json(subject);
    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        await Subject.findOneAndUpdate({ id }, { $set: { isActive: false } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
    }
}
