import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { MOCK_LOANS, ANIMATION_VARIANTS } from '../constants';
import { StatusBadge } from '../components/ui/StatusBadge';

interface LoanListViewProps {
  onNavigate: (view: any, loanId?: string) => void;
}

const LoanListView: React.FC<LoanListViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Loans</h1>
           <p className="text-slate-400 mt-1">Manage all active credit facilities.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search borrower..." 
                  className="bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
                />
             </div>
             <button className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
                <Filter className="w-5 h-5" />
             </button>
        </div>
      </div>

      <motion.div 
        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="show"
      >
        <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-slate-200 font-medium uppercase text-xs tracking-wider">
                <tr>
                    <th className="px-6 py-4">Borrower</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Maturity</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {MOCK_LOANS.map((loan, idx) => (
                    <motion.tr 
                        key={loan.id} 
                        variants={ANIMATION_VARIANTS.item}
                        onClick={() => onNavigate('LOAN_DETAIL', loan.id)}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                        <td className="px-6 py-4">
                            <div className="font-semibold text-white text-base">{loan.borrower}</div>
                            <div className="text-xs">Term Loan B</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300">
                            {loan.currency} {(loan.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                            {new Date(loan.maturityDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                             <div className="w-full bg-slate-800 rounded-full h-1.5 w-16 mb-1">
                                <div 
                                    className={`h-1.5 rounded-full ${loan.complianceScore > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                    style={{ width: `${loan.complianceScore}%` }}
                                ></div>
                             </div>
                             <span className="text-xs">{loan.complianceScore}/100</span>
                        </td>
                        <td className="px-6 py-4">
                            <StatusBadge status={loan.status} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full">
                                <MoreHorizontal className="w-5 h-5" />
                             </button>
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default LoanListView;
