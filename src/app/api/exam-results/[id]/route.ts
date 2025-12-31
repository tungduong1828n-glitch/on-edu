import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        let result;
        if (ObjectId.isValid(id)) {
            result = await db.collection('exam_results').deleteOne({ _id: new ObjectId(id) });
        }

        if (!result || result.deletedCount === 0) {
            result = await db.collection('exam_results').deleteOne({ id: id });
        }

        if (!result || result.deletedCount === 0) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting exam result:', error);
        return NextResponse.json({ error: 'Failed to delete exam result' }, { status: 500 });
    }
}
