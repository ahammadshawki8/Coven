import React, { useState } from 'react';
import { ViewState, Loan, Covenant, LoanStatus, ComplianceStatus } from './types';
import LandingView from './views/LandingView';
import DashboardView from './views/DashboardView';
import LoanListView from './views/LoanListView';
import LoanDetailView from './views/LoanDetailView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import AuthView from './views/AuthView';
import { LayoutDashboard, List, FileText, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_LOANS } from './constants';
import { Modal } from './components/ui/Modal';
import { Input, Select } from './components/ui/Input';

const Sidebar = ({ currentView, onViewChange }: { currentView: ViewState, onViewChange: (v: ViewState) => void }) => {
  const items = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'LOAN_LIST', icon: List, label: 'Loans' },
    { id: 'REPORTS', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('DASHBOARD')}>
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
         <button 
           onClick={() => onViewChange('SETTINGS')}
           className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'SETTINGS' ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}
         >
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Settings</span>
         </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [selectedLoanId, setSelectedLoanId] = useState<string | undefined>(undefined);

  // Modal States
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isCovenantModalOpen, setIsCovenantModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [targetLoanIdForCovenant, setTargetLoanIdForCovenant] = useState<string | null>(null);

  // --- Actions ---

  const handleLogin = () => {
    setIsAuthenticated(true);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('AUTH');
  };

  const handleNavigate = (newView: ViewState, loanId?: string) => {
    if (loanId) setSelectedLoanId(loanId);
    setView(newView);
    window.scrollTo(0,0);
  };

  const handleSaveLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newLoan: Loan = {
        id: editingLoan ? editingLoan.id : `ln_${Date.now()}`,
        borrower: formData.get('borrower') as string,
        amount: Number(formData.get('amount')),
        currency: formData.get('currency') as string,
        interestRate: Number(formData.get('interestRate')),
        startDate: formData.get('startDate') as string,
        maturityDate: formData.get('maturityDate') as string,
        status: LoanStatus.Active, // Default for now
        complianceScore: editingLoan ? editingLoan.complianceScore : 100, // New loans start perfect
        covenants: editingLoan ? editingLoan.covenants : [],
    };

    if (editingLoan) {
        setLoans(loans.map(l => l.id === editingLoan.id ? newLoan : l));
    } else {
        setLoans([...loans, newLoan]);
    }
    setIsLoanModalOpen(false);
    setEditingLoan(null);
  };

  const handleDeleteLoan = (id: string) => {
      setLoans(loans.filter(l => l.id !== id));
      handleNavigate('LOAN_LIST');
  };

  const handleSaveCovenant = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!targetLoanIdForCovenant) return;

      const formData = new FormData(e.currentTarget);
      const newCovenant: Covenant = {
          id: `cov_${Date.now()}`,
          title: formData.get('title') as string,
          type: formData.get('type') as any,
          dueDate: formData.get('dueDate') as string,
          description: formData.get('description') as string,
          threshold: formData.get('threshold') as string,
          status: ComplianceStatus.Upcoming, // Default
      };

      setLoans(loans.map(l => {
          if (l.id === targetLoanIdForCovenant) {
              return { ...l, covenants: [...l.covenants, newCovenant] };
          }
          return l;
      }));
      setIsCovenantModalOpen(false);
  };

  const openAddLoan = () => {
      setEditingLoan(null);
      setIsLoanModalOpen(true);
  };

  const openEditLoan = (loan: Loan) => {
      setEditingLoan(loan);
      setIsLoanModalOpen(true);
  };

  const openAddCovenant = (loanId: string) => {
      setTargetLoanIdForCovenant(loanId);
      setIsCovenantModalOpen(true);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30">
      {view === 'LANDING' ? (
        <LandingView onEnter={() => setView('AUTH')} />
      ) : !isAuthenticated ? (
         <AuthView onLogin={handleLogin} />
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
                    <DashboardView 
                        loans={loans} 
                        onNavigate={handleNavigate} 
                        onAddLoan={openAddLoan} 
                    />
                </motion.div>
              )}
              {view === 'LOAN_LIST' && (
                 <motion.div 
                    key="loan-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <LoanListView 
                        loans={loans} 
                        onNavigate={handleNavigate} 
                    />
                </motion.div>
              )}
              {view === 'LOAN_DETAIL' && selectedLoanId && (
                 <motion.div 
                    key="loan-detail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <LoanDetailView 
                        loanId={selectedLoanId} 
                        loans={loans}
                        onBack={() => handleNavigate('LOAN_LIST')} 
                        onEditLoan={openEditLoan}
                        onDeleteLoan={handleDeleteLoan}
                        onAddCovenant={openAddCovenant}
                    />
                </motion.div>
              )}
               {view === 'REPORTS' && (
                 <motion.div 
                    key="reports"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                 >
                    <ReportsView loans={loans} />
                 </motion.div>
              )}
               {view === 'SETTINGS' && (
                 <motion.div 
                    key="settings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                 >
                    <SettingsView onLogout={handleLogout} />
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- Modals --- */}
      
      <Modal 
        isOpen={isLoanModalOpen} 
        onClose={() => setIsLoanModalOpen(false)} 
        title={editingLoan ? "Edit Loan" : "Add New Loan"}
      >
        <form onSubmit={handleSaveLoan}>
            <Input label="Borrower Name" name="borrower" defaultValue={editingLoan?.borrower} required />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Amount" name="amount" type="number" defaultValue={editingLoan?.amount} required />
                <Select label="Currency" name="currency" defaultValue={editingLoan?.currency || 'USD'} options={[
                    { value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'GBP', label: 'GBP' }
                ]} />
            </div>
            <Input label="Interest Rate (%)" name="interestRate" type="number" step="0.1" defaultValue={editingLoan?.interestRate} required />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" name="startDate" type="date" defaultValue={editingLoan?.startDate} required />
                <Input label="Maturity Date" name="maturityDate" type="date" defaultValue={editingLoan?.maturityDate} required />
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsLoanModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors">
                    {editingLoan ? 'Update Loan' : 'Create Loan'}
                </button>
            </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isCovenantModalOpen} 
        onClose={() => setIsCovenantModalOpen(false)} 
        title="Add Covenant"
      >
        <form onSubmit={handleSaveCovenant}>
            <Input label="Covenant Title" name="title" placeholder="e.g. Max Leverage Ratio" required />
            <Select label="Type" name="type" options={[
                { value: 'Financial', label: 'Financial' },
                { value: 'Reporting', label: 'Reporting' },
                { value: 'Affirmative', label: 'Affirmative' },
                { value: 'Negative', label: 'Negative' }
            ]} />
            <Input label="Description" name="description" placeholder="Short description of the requirement..." required />
             <div className="grid grid-cols-2 gap-4">
                <Input label="Threshold" name="threshold" placeholder="e.g. < 4.0x" />
                <Input label="Due Date" name="dueDate" type="date" required />
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCovenantModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors">
                    Add Covenant
                </button>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default App;
