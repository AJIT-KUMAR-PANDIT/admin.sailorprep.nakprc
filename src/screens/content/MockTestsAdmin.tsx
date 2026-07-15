import { useState, useEffect } from 'react';
import { pb } from '../../lib/pb';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MockTestsAdmin() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [durationMins, setDurationMins] = useState(60);
  const [totalQuestions, setTotalQuestions] = useState(50);
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('Comprehensive');
  const [isPro, setIsPro] = useState(false);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('mock_tests').getList(1, 50, { sort: '-created' });
      setTests(records.items);
    } catch (error) {
      console.error("Error fetching mock tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('mock_tests').create({
        title,
        duration_mins: Number(durationMins),
        total_questions: Number(totalQuestions),
        difficulty,
        category,
        is_pro: isPro
      });
      fetchTests();
      setTitle('');
    } catch (error) {
      console.error("Error creating mock test:", error);
      alert("Failed to create mock test.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mock test?")) return;
    try {
      await pb.collection('mock_tests').delete(id);
      fetchTests();
    } catch (error) {
      console.error("Error deleting mock test:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/content" className="p-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-variant)] rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-lg)' }}>
          Manage Mock Tests
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-[var(--color-tertiary)]" /> Create New Test
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. MMD Phase 1 Mock" />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Duration (mins)</label>
                <input type="number" required value={durationMins} onChange={e => setDurationMins(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Questions</label>
                <input type="number" required value={totalQuestions} onChange={e => setTotalQuestions(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Navigation">Navigation</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={isPro} onChange={e => setIsPro(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-[var(--color-tertiary)] focus:ring-[var(--color-tertiary)]" />
              <span className="font-medium text-[var(--color-on-surface)]">Pro Only Test</span>
            </label>
            
            <button type="submit" className="mt-2 bg-[var(--color-tertiary)] text-white rounded-xl py-3 font-bold hover:bg-[var(--color-tertiary)]/90 transition-colors shadow-md">
              Create Test
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col">
          <h2 className="text-lg md:text-xl font-bold mb-4">Existing Tests</h2>
          
          {loading ? (
            <div className="py-4 text-center">Loading...</div>
          ) : tests.length === 0 ? (
            <div className="py-4 text-center">No tests found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm">
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Time / Qs</th>
                      <th className="pb-3 font-medium">Difficulty / Cat</th>
                      <th className="pb-3 font-medium">Access</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {tests.map(test => (
                      <tr key={test.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                        <td className="py-3 font-medium">{test.title}</td>
                        <td className="py-3 text-[var(--color-on-surface-variant)]">{test.duration_mins}m / {test.total_questions}q</td>
                        <td className="py-3">{test.difficulty} • {test.category}</td>
                        <td className="py-3">
                          {test.is_pro ? (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-md text-xs font-bold">Pro</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded-md text-xs font-bold">Free</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDelete(test.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4">
                {tests.map(test => (
                  <div key={test.id} className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-[var(--color-on-surface)] leading-tight">{test.title}</span>
                      {test.is_pro ? (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-md text-xs font-bold shrink-0">Pro</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded-md text-xs font-bold shrink-0">Free</span>
                      )}
                    </div>
                    <div className="text-sm text-[var(--color-on-surface-variant)] flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span>{test.duration_mins}m / {test.total_questions}q</span>
                      <span>•</span>
                      <span>{test.difficulty}</span>
                      <span>•</span>
                      <span>{test.category}</span>
                    </div>
                    <div className="flex justify-end pt-3 border-t border-[var(--color-outline-variant)]/50 mt-1">
                      <button onClick={() => handleDelete(test.id)} className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
