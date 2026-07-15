import { useState, useEffect } from 'react';
import { pb } from '../../lib/pb';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PyqsAdmin() {
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [year, setYear] = useState('2023');
  const [examType, setExamType] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [downloads, setDownloads] = useState(0);
  const [status, setStatus] = useState('Verified');
  const [title, setTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchPyqs = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('pyqs').getList(1, 50, { sort: '-created' });
      setPyqs(records.items);
    } catch (error) {
      console.error("Error fetching pyqs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPyqs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('year', year);
      formData.append('exam_type', examType);
      formData.append('subject', subject);
      formData.append('difficulty', difficulty);
      formData.append('downloads', downloads.toString());
      formData.append('status', status);
      formData.append('title', title);
      formData.append('pdf_url', pdfUrl);
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }

      await pb.collection('pyqs').create(formData);
      fetchPyqs();
      setTitle('');
      setPdfUrl('');
      setPdfFile(null);
      setSubject('');
    } catch (error) {
      console.error("Error creating PYQ:", error);
      alert("Failed to create PYQ.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PYQ?")) return;
    try {
      await pb.collection('pyqs').delete(id);
      fetchPyqs();
    } catch (error) {
      console.error("Error deleting PYQ:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/content" className="p-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-variant)] rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-lg)' }}>
          Manage PYQs
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-purple-500" /> Create New PYQ
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. 2023 Deck Officer Phase 1" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Year</label>
                <input type="text" required value={year} onChange={e => setYear(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. 2023" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Exam Type</label>
                <input type="text" required value={examType} onChange={e => setExamType(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. MMD Phase 2" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. Ship Stability" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">PDF File (Upload)</label>
              <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-sm text-[var(--color-on-surface-variant)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Or PDF URL (External Link)</label>
              <input type="text" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. https://example.com/file.pdf" />
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
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Downloads</label>
              <input type="number" required value={downloads} onChange={e => setDownloads(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
            </div>
            
            <button type="submit" className="mt-2 bg-purple-500 text-white rounded-xl py-3 font-bold hover:bg-purple-600 transition-colors shadow-md">
              Create PYQ
            </button>
          </form>
        </div>

        {/* Data Table */}
        {/* Data Table */}
        <div className="lg:col-span-2 glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col">
          <h2 className="text-lg md:text-xl font-bold mb-4">Existing PYQs</h2>
          
          {loading ? (
            <div className="py-4 text-center">Loading...</div>
          ) : pyqs.length === 0 ? (
            <div className="py-4 text-center">No PYQs found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm">
                      <th className="pb-3 font-medium">Exam / Year</th>
                      <th className="pb-3 font-medium">Subject</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Downloads</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {pyqs.map(pyq => (
                      <tr key={pyq.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                        <td className="py-3">
                          <div className="font-medium">{pyq.exam_type}</div>
                          <div className="text-[var(--color-on-surface-variant)] text-xs">{pyq.year}</div>
                        </td>
                        <td className="py-3 text-[var(--color-on-surface-variant)]">{pyq.subject}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${pyq.status === 'Verified' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                            {pyq.status}
                          </span>
                        </td>
                        <td className="py-3 text-[var(--color-on-surface-variant)]">{pyq.downloads}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDelete(pyq.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
                {pyqs.map(pyq => (
                  <div key={pyq.id} className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--color-on-surface)] leading-tight">{pyq.exam_type}</span>
                        <span className="text-xs text-[var(--color-on-surface-variant)]">{pyq.year}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold shrink-0 ${pyq.status === 'Verified' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                        {pyq.status}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--color-on-surface-variant)] flex justify-between items-center mt-1">
                      <span>{pyq.subject}</span>
                      <span className="font-medium text-xs bg-[var(--color-surface-variant)] px-2 py-1 rounded-md">{pyq.downloads} dls</span>
                    </div>
                    <div className="flex justify-end pt-3 border-t border-[var(--color-outline-variant)]/50 mt-1">
                      <button onClick={() => handleDelete(pyq.id)} className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium">
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
