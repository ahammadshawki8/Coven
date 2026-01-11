import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileText, AlertTriangle, CheckCircle, Plus, TrendingDown, Clock, Zap, Home, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ANIMATION_VARIANTS } from '../constants';
import { Loan, ComplianceStatus } from '../types';

interface DashboardViewProps {
  loans: Loan[];
  onNavigate: (view: any, loanId?: string) => void;
  onAddLoan: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ loans, onNavigate, onAddLoan }) => {
  const totalLoans = loans.length;
  const totalCovenants = loans.reduce((acc, loan) => acc + loan.covenants.length, 0);
  const atRiskCovenants = loans.reduce((acc, loan) => 
    acc + loan.covenants.filter(c => c.status === ComplianceStatus.AtRisk || c.status === ComplianceStatus.Breached).length, 0);
  const breachedCovenants = loans.reduce((acc, loan) => 
    acc + loan.covenants.filter(c => c.status === ComplianceStatus.Breached).length, 0);
  
  const avgScore = totalLoans > 0 ? Math.round(loans.reduce((acc, loan) => acc + loan.complianceScore, 0) / totalLoans) : 0;

  const highRiskPredictions = loans.flatMap(loan => 
    (loan.riskPredictions || [])
      .filter(p => p.probability > 50)
      .map(p => ({ ...p, loanId: loan.id, borrower: loan.borrower }))
  ).sort((a, b) => b.probability - a.probability).slice(0, 3);

  const recentEvents = loans.flatMap(loan => 
    (loan.timelineEvents || []).map(e => ({ ...e, loanId: loan.id, borrower: loan.borrower }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const ringData = [
    { name: 'Compliant', value: totalCovenants - atRiskCovenants, color: '#10b981' },
    { name: 'At Risk', value: atRiskCovenants - breachedCovenants, color: '#f59e0b' },
    { name: 'Breached', value: breachedCovenants, color: '#ef4444' },
  ];
  
  const chartData = ringData.every(d => d.value === 0) ? [{name: 'Empty', value: 1, color: '#334155'}] : ringData.filter(d => d.value > 0);

  return (
    <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">Overview of your portfolio's health.</p>
        </div>
        <motion.button 
          onClick={onAddLoan}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-900/20 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>New Loan</span>
        </motion.button>
      </header>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Home className="w-4 h-4" />
        <span className="text-white">Dashboard</span>
      </div>

      <motion.div 
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10"
      >
        <motion.div variants={ANIMATION_VARIANTS.item}>
          <Card className="h-full flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
            <div className="p-2 md:p-3 bg-slate-800 rounded-lg text-slate-400 w-fit"><FileText className="w-5 h-5 md:w-6 md:h-6"/></div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white mt-3 md:mt-4">{totalLoans}</div>
              <div className="text-xs md:text-sm text-slate-400">Active Loans</div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={ANIMATION_VARIANTS.item}>
          <Card className="h-full flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
            <div className="p-2 md:p-3 bg-slate-800 rounded-lg text-emerald-400 w-fit"><CheckCircle className="w-5 h-5 md:w-6 md:h-6"/></div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white mt-3 md:mt-4">{totalCovenants}</div>
              <div className="text-xs md:text-sm text-slate-400">Covenants</div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={ANIMATION_VARIANTS.item}>
          <Card className="h-full flex flex-col justify-between border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 transition-colors">
            <div className="p-2 md:p-3 bg-amber-900/20 rounded-lg text-amber-500 w-fit"><AlertTriangle className="w-5 h-5 md:w-6 md:h-6"/></div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-500 mt-3 md:mt-4">{atRiskCovenants}</div>
              <div className="text-xs md:text-sm text-amber-200/60">At Risk / Breached</div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={ANIMATION_VARIANTS.item}>
          <Card className="relative overflow-hidden h-full flex items-center justify-between p-0 col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent z-0"></div>
            <div className="p-4 md:p-6 z-10 w-1/2">
              <div className={`text-3xl md:text-4xl font-bold ${avgScore > 80 ? 'text-emerald-400' : avgScore > 60 ? 'text-amber-400' : 'text-red-400'}`}>{avgScore}%</div>
              <div className="text-xs md:text-sm text-slate-400">Portfolio Health</div>
            </div>
            <div className="w-1/2 h-24 md:h-32 z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {highRiskPredictions.length > 0 && (
        <motion.div variants={ANIMATION_VARIANTS.item} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Predictive Risk Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highRiskPredictions.map((pred, idx) => (
              <Card key={idx} className={`cursor-pointer ${pred.probability > 70 ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}
                onClick={() => onNavigate('LOAN_DETAIL', pred.loanId)}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs text-slate-500">{pred.borrower}</div>
                    <div className="text-white font-medium">{pred.covenantTitle}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className={`font-bold ${pred.probability > 70 ? 'text-red-400' : 'text-amber-400'}`}>{pred.probability}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{pred.explanation}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Active Portfolio</h2>
      
      {loans.length === 0 ? (
        <div className="text-center py-12 md:py-20 bg-slate-900/50 border border-slate-800 rounded-xl border-dashed mb-8">
          <p className="text-slate-500 mb-4">No loans active in the portfolio.</p>
          <button onClick={onAddLoan} className="text-emerald-400 font-medium hover:underline">Create your first loan</button>
        </div>
      ) : (
        <motion.div variants={ANIMATION_VARIANTS.container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {loans.map((loan) => (
            <motion.div key={loan.id} variants={ANIMATION_VARIANTS.item}>
              <Card onClick={() => onNavigate('LOAN_DETAIL', loan.id)} hoverEffect={true} className="group">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm md:text-base">
                    {loan.borrower.charAt(0)}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded border ${
                    loan.complianceScore > 85 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 
                    loan.complianceScore > 60 ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                    'text-red-400 border-red-500/20 bg-red-500/10'
                  }`}>
                    Score: {loan.complianceScore}
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">{loan.borrower}</h3>
                <p className="text-xs md:text-sm text-slate-400 mb-4 md:mb-6">
                  {loan.loanDNA?.keyTerms.facilityType || 'Term Loan'} • {loan.currency} {(loan.amount / 1000000).toFixed(1)}M
                </p>
                <div className="flex justify-between items-center text-xs md:text-sm text-slate-500 border-t border-slate-800 pt-3 md:pt-4">
                  <span>{loan.covenants.length} covenants</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-emerald-500">
                    View <FileText className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {recentEvents.length > 0 && (
        <motion.div variants={ANIMATION_VARIANTS.item} initial="hidden" animate="show">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" /> Recent Activity
          </h2>
          <Card className="divide-y divide-slate-800">
            {recentEvents.map((event, idx) => (
              <div key={idx} className="py-3 px-1 flex items-start gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => onNavigate('LOAN_DETAIL', event.loanId)}>
                <div className="text-xs text-slate-500 w-20 flex-shrink-0">{new Date(event.date).toLocaleDateString()}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{event.title}</div>
                  <div className="text-xs text-slate-500">{event.borrower}</div>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardView;
