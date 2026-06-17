import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, Users, BarChart3, Settings, BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import ClassesView from './pages/Classes/ClassesView';
import UploadView from './pages/Upload/UploadView';
import AnalyticsView from './pages/Analytics/AnalyticsView';
import { MetricCard } from './components/ui/metric-card';
import { ActionCard } from './components/ui/action-card';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Dashboard = () => (
  <div className="space-y-8 gani-animate-in">
    <div>
      <h2 className="gani-heading-page">Welcome back, Teacher! 👋</h2>
      <p className="gani-text-body mt-2 text-lg">Here is a quick overview of your classes today.</p>
    </div>
    
    <div className="gani-grid-metrics">
      <MetricCard 
        title="Pending Papers" 
        value="2" 
        icon={<Clock size={24} />} 
        trendLabel="Needs checking" 
      />
      <MetricCard 
        title="Students Assessed" 
        value="452" 
        icon={<Users size={24} />} 
        trend={12} 
        trendLabel="from last week" 
      />
      <MetricCard 
        title="Target to Reteach" 
        value="5 Topics" 
        icon={<AlertCircle size={24} className="text-insight-reteach" />} 
        trendLabel="Needs attention" 
      />
      <MetricCard 
        title="Avg. Performance" 
        value="84%" 
        icon={<CheckCircle2 size={24} />} 
        trend={3} 
        trendLabel="Overall mastery" 
      />
    </div>

    <ActionCard
      title="Ready to check papers?"
      description="Upload handwritten scanned answer sheets and our AI logic will read the answers, map it to competencies, and show you an item analysis. Let's make checking fun and fast."
      backgroundIcon={<Upload size={120} />}
      action={
        <Link to="/upload" className="gani-button-primary h-11 px-6 py-3">
          <Upload size={20} />
          Start Grading
        </Link>
      }
      className="mt-8"
    />
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
    <div className="w-72 bg-white border-r border-slate-100 min-h-screen p-5 flex flex-col relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
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
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 overflow-auto">
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
