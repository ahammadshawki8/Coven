import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FileText, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ANIMATION_VARIANTS, MOCK_LOANS } from '../constants';
import { Loan, ComplianceStatus } from '../types';

interface DashboardViewProps {
  onNavigate: (view: any, loanId?: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const totalLoans = MOCK_LOANS.length;
  const totalCovenants = MOCK_LOANS.reduce((acc, loan) => acc + loan.covenants.length, 0);
  const atRiskCovenants = MOCK_LOANS.reduce((acc, loan) => 
    acc + loan.covenants.filter(c => c.status === ComplianceStatus.AtRisk || c.status === ComplianceStatus.Breached).length, 0);
  
  // Calculate average compliance score
  const avgScore = Math.round(MOCK_LOANS.reduce((acc, loan) => acc + loan.complianceScore, 0) / totalLoans);

  const ringData = [
    { name: 'Compliant', value: totalCovenants - atRiskCovenants, color: '#10b981' }, // Emerald
    { name: 'At Risk', value: atRiskCovenants, color: '#f59e0b' }, // Amber
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your portfolio's health.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg border border-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Loan</span>
        </motion.button>
      </header>

      <motion.div 
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {/* Summary Cards */}
        <motion.div variants={ANIMATION_VARIANTS.item}>
            <Card className="h-full flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-800 rounded-lg text-slate-400"><FileText className="w-6 h-6"/></div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mt-4">{totalLoans}</div>
                    <div className="text-sm text-slate-400">Total Active Loans</div>
                </div>
            </Card>
        </motion.div>

        <motion.div variants={ANIMATION_VARIANTS.item}>
            <Card className="h-full flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-800 rounded-lg text-emerald-400"><CheckCircle className="w-6 h-6"/></div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mt-4">{totalCovenants}</div>
                    <div className="text-sm text-slate-400">Monitored Covenants</div>
                </div>
            </Card>
        </motion.div>

        <motion.div variants={ANIMATION_VARIANTS.item}>
            <Card className="h-full flex flex-col justify-between border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 transition-colors">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-900/20 rounded-lg text-amber-500"><AlertTriangle className="w-6 h-6"/></div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-amber-500 mt-4">{atRiskCovenants}</div>
                    <div className="text-sm text-amber-200/60">Covenants At Risk</div>
                </div>
            </Card>
        </motion.div>

        <motion.div variants={ANIMATION_VARIANTS.item}>
             <Card className="relative overflow-hidden h-full flex items-center justify-between p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent z-0"></div>
                <div className="p-6 z-10 w-1/2">
                    <div className="text-4xl font-bold text-emerald-400">{avgScore}%</div>
                    <div className="text-sm text-slate-400">Portfolio Health</div>
                </div>
                <div className="w-1/2 h-32 z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ringData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {ringData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                </div>
            </Card>
        </motion.div>
      </motion.div>

      <h2 className="text-xl font-semibold text-white mb-6">Active Portfolio</h2>
      
      <motion.div 
         variants={ANIMATION_VARIANTS.container}
         initial="hidden"
         animate="show"
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MOCK_LOANS.map((loan) => (
          <motion.div key={loan.id} variants={ANIMATION_VARIANTS.item}>
            <Card 
              onClick={() => onNavigate('LOAN_DETAIL', loan.id)} 
              hoverEffect={true}
              className="group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-bold">
                    {loan.borrower.charAt(0)}
                </div>
                <div className={`text-xs px-2 py-1 rounded border ${
                    loan.complianceScore > 85 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 
                    'text-amber-400 border-amber-500/20 bg-amber-500/10'
                }`}>
                    Score: {loan.complianceScore}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">{loan.borrower}</h3>
              <p className="text-sm text-slate-400 mb-6">Term Loan B • {loan.currency} {(loan.amount / 1000000).toFixed(1)}M</p>
              
              <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-800 pt-4">
                 <span>Matures {new Date(loan.maturityDate).getFullYear()}</span>
                 <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-emerald-500">
                    View Timeline <FileText className="w-3 h-3" />
                 </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardView;
