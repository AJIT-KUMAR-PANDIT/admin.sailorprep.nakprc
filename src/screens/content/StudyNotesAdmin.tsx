import { useState, useEffect } from 'react';
import { pb } from '../../lib/pb';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudyNotesAdmin() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Navigation');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('study_notes').getList(1, 50, { sort: '-created' });
      setNotes(records.items);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('study_notes').create({
        title,
        description,
        category,
      });
      fetchNotes();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create study note.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await pb.collection('study_notes').delete(id);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/content" className="p-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-variant)] rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-lg)' }}>
          Manage Study Notes
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-[var(--color-secondary)]" /> Create New Note
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. COLREGs Rule 5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                <option value="Navigation">Navigation</option>
                <option value="Naval Architecture">Naval Architecture</option>
                <option value="Meteorology">Meteorology</option>
                <option value="Cargo Handling">Cargo Handling</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description / Content</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 h-32" placeholder="Note content goes here..." />
            </div>
            
            <button type="submit" className="mt-2 bg-[var(--color-secondary)] text-white rounded-xl py-3 font-bold hover:bg-[var(--color-secondary)]/90 transition-colors shadow-md">
              Create Note
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4">Existing Notes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Description snippet</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="py-4 text-center">Loading...</td></tr>
                ) : notes.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center">No notes found.</td></tr>
                ) : notes.map(note => (
                  <tr key={note.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                    <td className="py-3 font-medium">{note.title}</td>
                    <td className="py-3 text-[var(--color-on-surface-variant)]">{note.category}</td>
                    <td className="py-3 truncate max-w-[200px] text-[var(--color-on-surface-variant)]">{note.description}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleDelete(note.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
