import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, Users, BarChart3, Settings, BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import ClassesView from './pages/Classes/ClassesView';
import UploadView from './pages/Upload/UploadView';
import AnalyticsView from './pages/Analytics/AnalyticsView';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, icon, trend, trendLabel }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-slate-500 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-slate-800">{value}</p>
      </div>
      <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
        {icon}
      </div>
    </div>
    {(trend || trendLabel) && (
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span className={cn("font-medium", trend > 0 ? "text-insight-enrich" : "text-slate-500")}>
            {trend > 0 ? `+${trend}%` : trend}%
          </span>
        )}
        <span className="text-slate-400 ml-2">{trendLabel}</span>
      </div>
    )}
  </div>
);

const Dashboard = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome back, Teacher! 👋</h2>
      <p className="text-slate-500 mt-2 text-lg">Here is a quick overview of your classes today.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Pending Papers" 
        value="2" 
        icon={<Clock size={24} />} 
        trendLabel="Needs checking" 
      />
      <StatCard 
        title="Students Assessed" 
        value="452" 
        icon={<Users size={24} />} 
        trend={12} 
        trendLabel="from last week" 
      />
      <StatCard 
        title="Target to Reteach" 
        value="5 Topics" 
        icon={<AlertCircle size={24} className="text-insight-reteach" />} 
        trendLabel="Needs attention" 
      />
      <StatCard 
        title="Avg. Performance" 
        value="84%" 
        icon={<CheckCircle2 size={24} />} 
        trend={3} 
        trendLabel="Overall mastery" 
      />
    </div>

    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Upload size={120} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to check papers?</h3>
      <p className="text-slate-500 mb-6 max-w-xl">
        Upload handwritten scanned answer sheets and our AI logic will read the answers, map it to competencies, and show you an item analysis. Let's make checking fun and fast.
      </p>
      <Link to="/upload" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
        <Upload size={20} />
        Start Grading
      </Link>
    </div>
  </div>
);

const SidebarItem = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
        isActive 
          ? "bg-brand-50 text-brand-600 shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={20} className={cn("transition-transform", isActive ? "scale-110" : "")} />
      {children}
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="w-72 bg-white border-r border-slate-200 min-h-screen p-5 flex flex-col relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="bg-brand-600 p-2 rounded-xl text-white shadow-md shadow-brand-500/30">
          <BookOpen size={24} />
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-800">Socorra.</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        <SidebarItem to="/" icon={LayoutDashboard}>Dashboard</SidebarItem>
        <SidebarItem to="/upload" icon={Upload}>Check Papers</SidebarItem>
        <SidebarItem to="/classes" icon={Users}>My Classes</SidebarItem>
        <SidebarItem to="/analytics" icon={BarChart3}>Analytics & Reports</SidebarItem>
      </nav>
      
      <div className="pt-6 border-t border-slate-100">
         <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 w-full hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
          <Settings size={20} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900 overflow-hidden">
        <Sidebar />
        <main className="flex-1 px-6 py-6 overflow-auto">
          <div className="max-w-6xl mx-auto h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadView />} />
              <Route path="/classes" element={<ClassesView />} />
              <Route path="/analytics" element={<AnalyticsView />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
