import { Users, BookOpen, FileText, TrendingUp, Anchor, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import PocketBaseStatus from '../components/PocketBaseStatus';
import { useEffect, useState } from 'react';
import { pb } from '../lib/pb';

const data = [
  { name: 'Jan', students: 400, active: 240 },
  { name: 'Feb', students: 300, active: 139 },
  { name: 'Mar', students: 200, active: 980 },
  { name: 'Apr', students: 278, active: 390 },
  { name: 'May', students: 189, active: 480 },
  { name: 'Jun', students: 239, active: 380 },
  { name: 'Jul', students: 349, active: 430 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
  <div className="glass-card premium-card p-6 rounded-2xl flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-xl">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${trendUp ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]'}`}>
        <TrendingUp size={14} className={!trendUp ? 'rotate-180' : ''} />
        <span>{trend}</span>
      </div>
    </div>
    <div>
      <h3 className="text-[var(--color-on-surface-variant)] font-medium text-sm">{title}</h3>
      <p className="text-3xl font-bold text-[var(--color-on-surface)] mt-1" style={{ fontFamily: 'var(--font-headline-md)' }}>{value}</p>
    </div>
  </div>
);

const DashboardScreen = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const records = await pb.collection('activities').getList(1, 5, {
          sort: '-created',
        });
        setActivities(records.items);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-display-lg)' }}>Overview</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-5 py-2.5 rounded-full font-bold hover:bg-[var(--color-surface-tint)] transition-all premium-shadow cursor-pointer">
          <Anchor size={18} />
          <span>Generate Report</span>
        </button>
      </div>

      <PocketBaseStatus />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="2,845" icon={Users} trend="+12.5%" trendUp={true} />
        <StatCard title="Active Sessions" value="1,294" icon={Activity} trend="+5.2%" trendUp={true} />
        <StatCard title="Mock Tests Taken" value="842" icon={FileText} trend="-2.1%" trendUp={false} />
        <StatCard title="Study Materials" value="156" icon={BookOpen} trend="+8.4%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card premium-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-6" style={{ fontFamily: 'var(--font-headline-md)' }}>Student Growth</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-tertiary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-tertiary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--color-outline)" />
                <YAxis stroke="var(--color-outline)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'var(--color-on-surface)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="students" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="active" stroke="var(--color-tertiary)" fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card premium-card p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-md)' }}>Recent Activity</h2>
            <button className="text-[var(--color-primary)] text-sm font-bold hover:underline cursor-pointer">View All</button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loadingActivities ? (
              <div className="text-center text-sm text-[var(--color-on-surface-variant)] py-4">Loading activities...</div>
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--color-surface-container)] transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === 'Success' ? 'bg-[#16a34a]' : 
                    activity.status === 'Failed' ? 'bg-[var(--color-error)]' : 'bg-[#eab308]'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-[var(--color-on-surface)] font-medium text-sm">{activity.action}</p>
                    <p className="text-[var(--color-on-surface-variant)] text-xs mt-1">{activity.user_name}</p>
                  </div>
                  <span className="text-[var(--color-outline)] text-xs">{activity.time_ago}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-[var(--color-on-surface-variant)] py-4">No recent activity.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Analytics Overview */}
      <div className="glass-card premium-card p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-6" style={{ fontFamily: 'var(--font-headline-md)' }}>Content Performance</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-outline)" />
              <YAxis stroke="var(--color-outline)" />
              <Tooltip 
                cursor={{fill: 'var(--color-surface-variant)', opacity: 0.4}}
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="students" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} name="Mock Tests" />
              <Bar dataKey="active" fill="var(--color-primary-fixed-dim)" radius={[4, 4, 0, 0]} name="PYQ Downloads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardScreen;
