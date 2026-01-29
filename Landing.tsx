import React from 'react';
import { Shield, Wifi, Zap, MapPin, MessageSquare, Bell } from 'lucide-react';

interface LandingProps {
  onContinue: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-white/20 rounded-full animate-ping"></div>
                </div>
                <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Shield className="w-20 h-20 text-red-600" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
                SAFELINK
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-white/90 tracking-wide">
                Disaster Response & Emergency Connectivity Platform
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Connecting lives in crisis through intelligent emergency response, 
                real-time coordination, and resilient communication networks
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Emergency Network</h3>
                <p className="text-white/80 text-sm">
                  Wi-Fi enabled drones provide temporary internet access in disaster zones
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live GPS Tracking</h3>
                <p className="text-white/80 text-sm">
                  Real-time location sharing and intelligent route optimization for rescue teams
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Direct Communication</h3>
                <p className="text-white/80 text-sm">
                  Instant messaging between civilians and rescue teams for critical updates
                </p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">One-Tap SOS</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                <Bell className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Real-Time Alerts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Priority Routing</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <button
                onClick={onContinue}
                className="group relative px-12 py-5 bg-white text-red-600 rounded-full font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Enter Platform</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-yellow-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-12 space-y-3">
              <div className="flex items-center justify-center gap-3 text-white/80">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Online • All Services Active</span>
              </div>
              <p className="text-white/60 text-sm">
                Powered by NDRF & Government of India
              </p>
              <p className="text-white/60 text-sm">
                🇮🇳 Serving the Nation in Times of Crisis
              </p>
            </div>

            {/* Tech Stack Badge */}
            <div className="mt-8 text-white/50 text-xs">
              <p>Built with React + TypeScript + Leaflet Maps + Real-time WebSocket</p>
              <p className="mt-1">PWA-Ready • Offline-First • Military-Grade Security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
