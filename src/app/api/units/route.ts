import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Unit } from '@/lib/models';
import { sampleEnglishUnits } from '@/lib/sampleData';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');

        const db = await connectToDatabase();

        if (db) {
            const query = subjectId ? { subjectId, isActive: true } : { isActive: true };
            const units = await Unit.find(query).sort({ order: 1 });

            if (units.length === 0 && subjectId === 'english') {
                await Unit.insertMany(sampleEnglishUnits);
                return NextResponse.json(sampleEnglishUnits);
            }

            return NextResponse.json(units);
        }

        if (subjectId === 'english') {
            return NextResponse.json(sampleEnglishUnits);
        }

        return NextResponse.json([]);
    } catch (error) {
        console.error('Error fetching units:', error);
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const data = await request.json();
        const unit = new Unit(data);
        await unit.save();

        return NextResponse.json(unit, { status: 201 });
    } catch (error) {
        console.error('Error creating unit:', error);
        return NextResponse.json({ error: 'Failed to create unit' }, { status: 500 });
    }
}
