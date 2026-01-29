import React, { useEffect, useState } from 'react';
import { Shield, Wifi, Radio } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 flex items-center justify-center z-50">
      <div className="text-center space-y-8 px-4">
        {/* Logo Animation */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/20 rounded-full animate-ping"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-16 h-16 text-red-600 animate-pulse" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-lg">
            SAFELINK
          </h1>
          <p className="text-xl font-semibold text-white/90 tracking-wide">
            Disaster Response Platform
          </p>
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            <span className="text-sm font-medium">Emergency Network</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            <span className="text-sm font-medium">Real-time Response</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/70 text-xs mt-2 font-medium">
            Initializing emergency systems...
          </p>
        </div>

        {/* Footer */}
        <div className="text-white/60 text-xs">
          <p>Powered by NDRF & Government of India</p>
          <p className="mt-1">🇮🇳 Serving the Nation in Crisis</p>
        </div>
      </div>
    </div>
  );
};
