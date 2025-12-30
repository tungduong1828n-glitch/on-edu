import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Unit } from '@/lib/models';
import { sampleEnglishUnits } from '@/lib/sampleData';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');

        const db = await connectToDatabase();

        if (db) {
            const query = subjectId ? { id, subjectId } : { id };
            const unit = await Unit.findOne(query);
            if (unit) {
                return NextResponse.json(unit);
            }
        }

        const unit = sampleEnglishUnits.find(u => u.id === id);
        if (unit) {
            return NextResponse.json(unit);
        }

        return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    } catch (error) {
        console.error('Error fetching unit:', error);
        return NextResponse.json({ error: 'Failed to fetch unit' }, { status: 500 });
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
        const unit = await Unit.findOneAndUpdate(
            { id },
            { $set: data },
            { new: true, upsert: true }
        );

        return NextResponse.json(unit);
    } catch (error) {
        console.error('Error updating unit:', error);
        return NextResponse.json({ error: 'Failed to update unit' }, { status: 500 });
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

        await Unit.findOneAndUpdate({ id }, { $set: { isActive: false } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting unit:', error);
        return NextResponse.json({ error: 'Failed to delete unit' }, { status: 500 });
    }
}
