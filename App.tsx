import React, { useState } from 'react';
import { ViewState } from './types';
import LandingView from './views/LandingView';
import DashboardView from './views/DashboardView';
import LoanListView from './views/LoanListView';
import LoanDetailView from './views/LoanDetailView';
import { LayoutDashboard, List, FileText, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ currentView, onViewChange }: { currentView: ViewState, onViewChange: (v: ViewState) => void }) => {
  const items = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'LOAN_LIST', icon: List, label: 'Loans' },
    { id: 'REPORTS', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg"></div>
        <span className="text-xl font-bold text-white hidden lg:block tracking-tight">Coven</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewState)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              (currentView === item.id) || (currentView === 'LOAN_DETAIL' && item.id === 'LOAN_LIST')
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-900">
         <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Settings</span>
         </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [selectedLoanId, setSelectedLoanId] = useState<string | undefined>(undefined);

  const handleNavigate = (newView: ViewState, loanId?: string) => {
    if (loanId) setSelectedLoanId(loanId);
    setView(newView);
    window.scrollTo(0,0);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30">
      {view === 'LANDING' ? (
        <LandingView onEnter={() => setView('DASHBOARD')} />
      ) : (
        <div className="flex">
          <Sidebar currentView={view} onViewChange={(v) => handleNavigate(v)} />
          
          <div className="flex-1 md:ml-20 lg:ml-64 w-full transition-all duration-300">
            <AnimatePresence mode="wait">
              {view === 'DASHBOARD' && (
                <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <DashboardView onNavigate={handleNavigate} />
                </motion.div>
              )}
              {view === 'LOAN_LIST' && (
                 <motion.div 
                    key="loan-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <LoanListView onNavigate={handleNavigate} />
                </motion.div>
              )}
              {view === 'LOAN_DETAIL' && selectedLoanId && (
                 <motion.div 
                    key="loan-detail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <LoanDetailView loanId={selectedLoanId} onBack={() => handleNavigate('LOAN_LIST')} />
                </motion.div>
              )}
               {view === 'REPORTS' && (
                 <div className="flex flex-col items-center justify-center h-screen text-slate-500">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <h2 className="text-xl">Reports Module</h2>
                    <p className="text-sm">Coming in Q2 Release</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
