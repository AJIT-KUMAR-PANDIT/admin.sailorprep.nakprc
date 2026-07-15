import { useState, useEffect } from 'react';
import { pb } from '../../lib/pb';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BatchesAdmin() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Navigation');
  const [capacity, setCapacity] = useState(50);
  const [enrolled, setEnrolled] = useState(0);
  const [status, setStatus] = useState('Active');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Deck');
  const [price, setPrice] = useState(299);
  const [description, setDescription] = useState('');
  const [durationMonths, setDurationMonths] = useState(3);
  const [mode, setMode] = useState('Online');
  const [instructor, setInstructor] = useState('');

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('batches').getList(1, 50, { sort: '-created' });
      setBatches(records.items);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('batches').create({
        title,
        type,
        capacity: Number(capacity),
        enrolled: Number(enrolled),
        status,
        start_date: new Date(startDate).toISOString(),
        category,
        price: Number(price),
        description,
        duration_months: Number(durationMonths),
        mode,
        instructor,
        seats_left: Number(capacity) - Number(enrolled),
      });
      fetchBatches();
      setTitle('');
    } catch (error) {
      console.error("Error creating batch:", error);
      alert("Failed to create batch.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    try {
      await pb.collection('batches').delete(id);
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/content" className="p-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-variant)] rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-lg)' }}>
          Manage Batches
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-[var(--color-primary)]" /> Create New Batch
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" placeholder="e.g. Deck Cadet Fast-track" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                <option value="Navigation">Navigation</option>
                <option value="Engineering">Engineering</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input type="number" required value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Enrolled</label>
                <input type="number" required value={enrolled} onChange={e => setEnrolled(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                <option value="Active">Active</option>
                <option value="Full">Full</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Category</label>
                <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input type="number" required value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" rows={2} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Duration (Months)</label>
                <input type="number" required value={durationMonths} onChange={e => setDurationMonths(Number(e.target.value))} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Mode</label>
                <select value={mode} onChange={e => setMode(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2">
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instructor Name</label>
              <input type="text" required value={instructor} onChange={e => setInstructor(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2" />
            </div>
            <button type="submit" className="mt-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl py-3 font-bold hover:bg-[var(--color-primary)]/90 transition-colors shadow-md">
              Create Batch
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4">Existing Batches</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Enrolled/Cap</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center">Loading...</td></tr>
                ) : batches.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center">No batches found.</td></tr>
                ) : batches.map(batch => (
                  <tr key={batch.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                    <td className="py-3 font-medium">{batch.title}</td>
                    <td className="py-3 text-[var(--color-on-surface-variant)]">{batch.type}</td>
                    <td className="py-3">{batch.enrolled} / {batch.capacity}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${batch.status === 'Active' ? 'bg-green-500/20 text-green-600' : batch.status === 'Full' ? 'bg-red-500/20 text-red-600' : 'bg-blue-500/20 text-blue-600'}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleDelete(batch.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
