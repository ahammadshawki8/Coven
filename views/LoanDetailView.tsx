import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, AlertCircle, FileText, Activity } from 'lucide-react';
import { MOCK_LOANS } from '../constants';
import { Loan, Covenant, ComplianceStatus } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { generateLoanSummary, explainCovenantRisk } from '../services/geminiService';

interface LoanDetailViewProps {
  loanId: string;
  onBack: () => void;
}

const LoanDetailView: React.FC<LoanDetailViewProps> = ({ loanId, onBack }) => {
  const loan = MOCK_LOANS.find(l => l.id === loanId);
  const [activeTab, setActiveTab] = useState<'SNAPSHOT' | 'TIMELINE'>('TIMELINE');
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Timeline interaction state
  const [selectedCovenant, setSelectedCovenant] = useState<Covenant | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    if (loan && activeTab === 'SNAPSHOT') {
      setLoadingSummary(true);
      generateLoanSummary(loan).then(text => {
        setSummary(text);
        setLoadingSummary(false);
      });
    }
  }, [loan, activeTab]);

  const handleCovenantClick = async (covenant: Covenant) => {
    if (selectedCovenant?.id === covenant.id) {
        setSelectedCovenant(null);
        return;
    }
    setSelectedCovenant(covenant);
    setLoadingExplanation(true);
    setAiExplanation('');
    // Scroll to details if needed or just show sidebar
    const explanation = await explainCovenantRisk(covenant, loan!);
    setAiExplanation(explanation);
    setLoadingExplanation(false);
  };

  if (!loan) return <div>Loan not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{loan.borrower}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{loan.currency} {(loan.amount / 1000000).toFixed(1)}M</span>
                <span>•</span>
                <span className="font-mono">{loan.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
                onClick={() => setActiveTab('SNAPSHOT')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'SNAPSHOT' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
                Snapshot
            </button>
            <button 
                onClick={() => setActiveTab('TIMELINE')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'TIMELINE' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
                Timeline
            </button>
            <div className="w-px h-6 bg-slate-800 mx-2"></div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg text-sm font-semibold hover:bg-white transition-colors">
                <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
            {activeTab === 'SNAPSHOT' ? (
                <SnapshotView 
                    key="snapshot" 
                    loan={loan} 
                    summary={summary} 
                    loading={loadingSummary} 
                />
            ) : (
                <TimelineView 
                    key="timeline" 
                    loan={loan} 
                    selectedCovenant={selectedCovenant}
                    onSelectCovenant={handleCovenantClick}
                    aiExplanation={aiExplanation}
                    loadingExplanation={loadingExplanation}
                />
            )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const SnapshotView: React.FC<{ loan: Loan; summary: string; loading: boolean }> = ({ loan, summary, loading }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
        <div className="md:col-span-2 space-y-6">
            <Card className="relative overflow-hidden border-emerald-500/30">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-32 h-32 text-emerald-500" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    AI Executive Summary
                </h2>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                    {loading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-slate-800 rounded w-full"></div>
                            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-800 rounded w-4/6"></div>
                        </div>
                    ) : (
                        <p className="leading-relaxed">{summary}</p>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                 <Card>
                    <div className="text-sm text-slate-400 mb-1">Leverage Ratio</div>
                    <div className="text-2xl font-bold text-white">3.9x</div>
                    <div className="text-xs text-amber-500 mt-1">Approaching limit (4.0x)</div>
                    <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[95%]"></div>
                    </div>
                 </Card>
                 <Card>
                    <div className="text-sm text-slate-400 mb-1">Interest Coverage</div>
                    <div className="text-2xl font-bold text-white">4.2x</div>
                    <div className="text-xs text-emerald-500 mt-1">Healthy buffer (&gt; 2.5x)</div>
                     <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[60%]"></div>
                    </div>
                 </Card>
            </div>
        </div>

        <div className="space-y-6">
            <Card>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Risk Profile</h3>
                <div className="flex items-center justify-center py-6">
                    <div className="relative w-40 h-40">
                         <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-emerald-500" strokeDasharray={`${loan.complianceScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{loan.complianceScore}</span>
                            <span className="text-xs text-slate-500">SCORE</span>
                         </div>
                    </div>
                </div>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Financial</span>
                        <span className="text-white">Active</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Reporting</span>
                        <span className="text-white">Compliant</span>
                    </div>
                </div>
            </Card>
        </div>
    </motion.div>
);

interface TimelineViewProps {
    loan: Loan;
    selectedCovenant: Covenant | null;
    onSelectCovenant: (covenant: Covenant) => void;
    aiExplanation: string;
    loadingExplanation: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({ loan, selectedCovenant, onSelectCovenant, aiExplanation, loadingExplanation }) => {
    // Sort covenants by date
    const sortedCovenants = [...loan.covenants].sort((a: Covenant, b: Covenant) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Timeline Visualization */}
        <div className="flex-1 min-h-[500px] relative">
            <h2 className="text-2xl font-bold text-white mb-8">Covenant Timeline</h2>
            
            <div className="relative pl-8 border-l border-slate-800 space-y-12">
                {sortedCovenants.map((cov: Covenant, idx: number) => {
                    const isSelected = selectedCovenant?.id === cov.id;
                    const date = new Date(cov.dueDate);
                    const isPast = date < new Date();

                    let statusColor = 'bg-slate-500';
                    if(cov.status === ComplianceStatus.Compliant) statusColor = 'bg-emerald-500';
                    if(cov.status === ComplianceStatus.AtRisk) statusColor = 'bg-amber-500';
                    if(cov.status === ComplianceStatus.Breached) statusColor = 'bg-red-500';

                    return (
                        <motion.div 
                            key={cov.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group cursor-pointer"
                            onClick={() => onSelectCovenant(cov)}
                        >
                            {/* Node on the line */}
                            <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-slate-950 ${statusColor} transition-all duration-300 ${isSelected ? 'scale-125 ring-4 ring-slate-800' : ''}`}></div>
                            
                            <div className={`p-4 rounded-xl border transition-all duration-300 ${isSelected ? 'bg-slate-800 border-slate-600' : 'bg-transparent border-transparent hover:bg-slate-900 hover:border-slate-800'} ${isPast && !isSelected ? 'opacity-60' : 'opacity-100'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm text-slate-500 font-mono mb-1">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <h3 className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{cov.title}</h3>
                                    </div>
                                    <StatusBadge status={cov.status} size="sm" />
                                </div>
                                
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 mt-4 border-t border-slate-700/50 text-slate-400 text-sm grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="block text-slate-500 text-xs uppercase mb-1">Type</span>
                                                    {cov.type}
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs uppercase mb-1">Threshold</span>
                                                    {cov.threshold || 'N/A'}
                                                </div>
                                                 <div>
                                                    <span className="block text-slate-500 text-xs uppercase mb-1">Current</span>
                                                    <span className={cov.status === ComplianceStatus.AtRisk ? 'text-amber-400 font-bold' : ''}>{cov.value || 'Pending'}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>

        {/* Detail / AI Panel */}
        <AnimatePresence>
            {selectedCovenant && (
                <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    className="w-full lg:w-[400px] xl:w-[450px]"
                >
                    <div className="sticky top-24 space-y-4">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
                             <div className="flex items-center gap-2 text-emerald-400 mb-4 font-medium text-sm">
                                <FileText className="w-4 h-4" /> AI Analysis
                             </div>
                             <h3 className="text-white font-bold text-xl mb-2">{selectedCovenant.title}</h3>
                             <p className="text-slate-400 text-sm mb-6">{selectedCovenant.description}</p>
                             
                             <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                                {loadingExplanation ? (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Analyzing covenant logic...</span>
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-300 leading-relaxed">
                                        {aiExplanation}
                                    </div>
                                )}
                             </div>

                             <div className="mt-6 flex gap-3">
                                <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
                                    View Source Doc
                                </button>
                                <button className="flex-1 py-2 border border-slate-600 hover:bg-slate-800 rounded-lg text-slate-300 text-sm font-medium transition-colors">
                                    Mark Reviewed
                                </button>
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
    )
};

export default LoanDetailView;