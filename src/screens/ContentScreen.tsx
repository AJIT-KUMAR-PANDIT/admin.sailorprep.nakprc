import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, Target, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContentScreen() {
  const contentModules = [
    {
      title: "Batches",
      description: "Manage course batches, capacity, and enrollment status.",
      icon: Users,
      path: "/content/batches",
      color: "text-[var(--color-primary)]",
      bg: "bg-[var(--color-primary-container)]"
    },
    {
      title: "Study Notes",
      description: "Manage flashcards, topics, and study materials.",
      icon: BookOpen,
      path: "/content/study-notes",
      color: "text-[var(--color-secondary)]",
      bg: "bg-[var(--color-secondary-container)]"
    },
    {
      title: "Mock Tests",
      description: "Manage practice exams, question counts, and difficulty.",
      icon: Target,
      path: "/content/mock-tests",
      color: "text-[var(--color-tertiary)]",
      bg: "bg-[var(--color-tertiary-container)]"
    },
    {
      title: "Interview Prep",
      description: "Manage company specific interview questions and success rates.",
      icon: MessageSquare,
      path: "/content/interview-prep",
      color: "text-blue-500",
      bg: "bg-blue-500/20"
    },
    {
      title: "PYQs",
      description: "Manage past year question papers and downloads.",
      icon: FileText,
      path: "/content/pyqs",
      color: "text-purple-500",
      bg: "bg-purple-500/20"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[var(--color-on-surface)] mb-2" style={{ fontFamily: 'var(--font-headline-lg)' }}>
          Content Management
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-lg">
          Select a module to view, edit, or create new content for the SailorPrep application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentModules.map((module) => (
          <Link
            key={module.title}
            to={module.path}
            className="glass-card p-6 rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${module.bg} rounded-full filter blur-3xl opacity-50 -z-10 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${module.bg} ${module.color}`}>
                <module.icon size={28} />
              </div>
              <div className="p-2 bg-[var(--color-surface)] rounded-full shadow-sm text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">{module.title}</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
