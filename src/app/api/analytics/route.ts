import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const dailyStats = await db.collection('exam_results').aggregate([
            {
                $match: {
                    submittedAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" }
                    },
                    count: { $sum: 1 },
                    avgScore: { $avg: "$score" },
                    totalCorrect: { $sum: "$correctAnswers" },
                    totalWrong: { $sum: "$wrongAnswers" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).toArray();

        const totalResults = await db.collection('exam_results').countDocuments();
        const avgScoreResult = await db.collection('exam_results').aggregate([
            { $group: { _id: null, avg: { $avg: "$score" } } }
        ]).toArray();

        return NextResponse.json({
            dailyStats,
            totalResults,
            avgScore: avgScoreResult[0]?.avg || 0
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
