import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface SettingsViewProps {
    onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onLogout }) => {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences and profile.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
            <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl text-slate-400">
                    <User />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Admin User</h2>
                    <p className="text-slate-400">admin@coven.fi</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Administrator</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue="Admin User" />
                <Input label="Email" defaultValue="admin@coven.fi" disabled className="opacity-60 cursor-not-allowed" />
                <Input label="Role" defaultValue="Senior Risk Officer" />
                <Input label="Department" defaultValue="Credit Risk" />
            </div>
            <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition-colors">
                    Save Changes
                </button>
            </div>
        </Card>

        {/* Notifications */}
        <Card>
            <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
                {['Covenant Breach Alerts', 'Weekly Digest', 'New Loan Assignments'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <span className="text-slate-300">{item}</span>
                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-emerald-500 rounded-full cursor-pointer">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full translate-x-4"></span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

         {/* Security */}
         <Card>
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-white font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-slate-400">Add an extra layer of security to your account.</div>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Enable</button>
            </div>
            <button 
                onClick={onLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-colors"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </Card>
      </div>
    </div>
  );
};

export default SettingsView;
