import { useState, useEffect } from 'react';
import { pb } from '../../lib/pb';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InterviewPrepAdmin() {
  const [preps, setPreps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionsCount, setQuestionsCount] = useState(10);
  const [successRate, setSuccessRate] = useState(50);
  const [category, setCategory] = useState('Port State Control');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const fetchPreps = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('interview_prep').getList(1, 50, { sort: '-created' });
      setPreps(records.items);
    } catch (error) {
      console.error("Error fetching interview prep:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreps();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('interview_prep').create({
        role,
        company,
        difficulty,
        questions_count: Number(questionsCount),
        success_rate: Number(successRate),
        category,
        question,
        answer
      });
      fetchPreps();
      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error("Error creating prep:", error);
      alert("Failed to create interview prep.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prep?")) return;
    try {
      await pb.collection('interview_prep').delete(id);
      fetchPreps();
    } catch (error) {
      console.error("Error deleting prep:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/content" className="p-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-variant)] rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-lg)' }}>
          Manage Interview Prep
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-500" /> Create New Prep
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input type="text" required value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. Deck Cadet" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input type="text" required value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. Maersk Line" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Questions</label>
                <input type="number" required value={questionsCount} onChange={e => setQuestionsCount(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Success Rate (%)</label>
                <input type="number" required value={successRate} onChange={e => setSuccessRate(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
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
                <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. Emergencies" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <textarea required value={question} onChange={e => setQuestion(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" rows={2} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Answer (HTML allowed)</label>
              <textarea required value={answer} onChange={e => setAnswer(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" rows={3} />
            </div>
            
            <button type="submit" className="mt-2 bg-blue-500 text-white rounded-xl py-3 font-bold hover:bg-blue-600 transition-colors shadow-md">
              Create Prep
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4">Existing Scenarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm">
                  <th className="pb-3 font-medium">Role & Company</th>
                  <th className="pb-3 font-medium">Questions</th>
                  <th className="pb-3 font-medium">Difficulty</th>
                  <th className="pb-3 font-medium">Success Rate</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center">Loading...</td></tr>
                ) : preps.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center">No preps found.</td></tr>
                ) : preps.map(prep => (
                  <tr key={prep.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                    <td className="py-3">
                      <div className="font-medium">{prep.role}</div>
                      <div className="text-[var(--color-on-surface-variant)] text-xs">{prep.company}</div>
                    </td>
                    <td className="py-3 text-[var(--color-on-surface-variant)]">{prep.questions_count}</td>
                    <td className="py-3">{prep.difficulty}</td>
                    <td className="py-3 text-[var(--color-on-surface-variant)]">{prep.success_rate}%</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleDelete(prep.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
