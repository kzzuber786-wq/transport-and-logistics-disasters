import React from 'react';
import { Users, UserCog } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'civilian' | 'rescue') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Select Your Role
          </h1>
          <p className="text-lg text-slate-300">
            Choose how you want to access the platform
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Civilian Card */}
          <button
            onClick={() => onSelectRole('civilian')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-3xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">I Need Help</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Access emergency services, send SOS signals, and communicate with rescue teams in real-time
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                  <span>Send emergency requests</span>
                </div>
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                  <span>Share live location</span>
                </div>
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                  <span>Chat with rescue teams</span>
                </div>
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center text-white font-semibold text-lg">
                  Continue as Civilian
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </button>

          {/* Rescue Team Card */}
          <button
            onClick={() => onSelectRole('rescue')}
            className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-3xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <UserCog className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Rescue Team</h2>
                <p className="text-red-100 text-sm leading-relaxed">
                  Manage emergency requests, coordinate rescue operations, and provide critical assistance
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-red-50 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-200 rounded-full"></div>
                  <span>View all SOS requests</span>
                </div>
                <div className="flex items-center gap-2 text-red-50 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-200 rounded-full"></div>
                  <span>Deploy rescue teams</span>
                </div>
                <div className="flex items-center gap-2 text-red-50 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-200 rounded-full"></div>
                  <span>Real-time coordination</span>
                </div>
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center text-white font-semibold text-lg">
                  Continue as Rescue Team
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Notice */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            🔒 This is a secure emergency response platform
          </p>
        </div>
      </div>
    </div>
  );
};
