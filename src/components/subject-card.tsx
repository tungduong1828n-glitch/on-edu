import Link from 'next/link';
import { Subject } from '@/lib/types';
import {
    BookOpen, Calculator, Atom, FlaskConical,
    BookOpenCheck, Landmark, ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'book-open': BookOpen,
    'calculator': Calculator,
    'atom': Atom,
    'flask-conical': FlaskConical,
    'languages': BookOpenCheck,
    'landmark': Landmark,
};

export function SubjectCard({ subject }: { subject: Subject }) {
    const IconComponent = iconMap[subject.icon] || BookOpen;

    return (
        <Link href={`/subject/${subject.id}`} className="block h-full">
            <div className="group relative h-full rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]">

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${subject.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-[0.05]`} />

                <div className="relative flex flex-col h-full z-10">
                    <div className="mb-6 flex items-start justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${subject.gradient} shadow-lg shadow-black/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                            <IconComponent className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/5 text-white/40 transition-colors duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                    </div>

                    <h3 className="mb-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-400 font-outfit">
                        {subject.name}
                    </h3>

                    <p className="text-sm font-medium leading-relaxed text-muted-foreground/80 line-clamp-2 mt-auto">
                        {subject.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
