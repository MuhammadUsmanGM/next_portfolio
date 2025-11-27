'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof window !== 'undefined') {
      const minLoadTime = 5000;
      const startTime = Date.now();

      const resources = [
        new Promise(resolve => setTimeout(resolve, 800)),
        new Promise(resolve => setTimeout(resolve, 1200)),
        new Promise(resolve => setTimeout(resolve, 1600)),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ];

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);

      Promise.all(resources).then(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);

        setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setShowWelcome(true);

            // Show welcome for 3 seconds then complete
            setTimeout(() => {
              setShowWelcome(false);
              if (onComplete) {
                setTimeout(() => onComplete(), 500);
              }
            }, 3000);
          }, 500);
        }, remaining);
      });

      return () => clearInterval(progressInterval);
    }
  }, [onComplete]);

  // Don't render on server to prevent hydration issues
  if (typeof window === 'undefined' || (!isLoading && !showWelcome)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Loading Screen */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
          !isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            // Use consistent random values based on index to avoid hydration errors
            const width = (i * 17) % 100 + 150;
            const height = (i * 23) % 120 + 180;
            const left = (i * 37) % 100;
            const top = (i * 29) % 100;
            const duration = (i * 7) % 10 + 10;
            const delay = (i * 13) % 5;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-blue-500 opacity-10"
                style={{
                  width: width + 'px',
                  height: height + 'px',
                  left: left + '%',
                  top: top + '%',
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  filter: 'blur(40px)',
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-12 animate-pulse-slow">
            <div className="absolute inset-0 blur-3xl opacity-60 bg-cyan-400 rounded-full scale-150 animate-glow"></div>
            <div className="absolute inset-0 blur-2xl opacity-80 bg-blue-400 rounded-full scale-125 animate-glow-delayed"></div>
            
            <img 
              src="/loading.png" 
              alt="MU Logo"
              className="relative w-64 h-64 object-contain drop-shadow-2xl animate-float"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 60px rgba(56, 189, 248, 0.6))',
              }}
            />
          </div>

          <div className="w-80 h-1.5 bg-slate-800 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
            </div>
          </div>

          <div className="mt-2 text-cyan-400 text-sm font-mono">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Welcome Screen */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Radial glow background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[120px] opacity-30 animate-pulse-glow"></div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => {
            // Use consistent random values based on index to avoid hydration errors
            const left = (i * 41) % 100;
            const top = (i * 33) % 100;
            const delay = (i * 19) % 3;
            const duration = (i * 11) % 2 + 2;

            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle"
                style={{
                  left: left + '%',
                  top: top + '%',
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>

        {/* Welcome Text */}
        <div className="relative z-10 text-center px-8">
          <div className="animate-welcome-appear">
            {/* Top accent line */}
            <div className="flex justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-expand-line"></div>
            </div>

            {/* Main welcome text */}
            <h1 className="text-6xl md:text-8xl font-bold mb-4 relative">
              <span className="relative inline-block animate-text-glow">
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60"></span>
                <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text animate-gradient">
                  WELCOME
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400"></div>
              <p className="text-xl md:text-2xl text-cyan-300 font-light tracking-[0.3em]">
                TO MY PORTFOLIO
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400"></div>
            </div>

            {/* Bottom accent line */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-expand-line" style={{ animationDelay: '0.6s' }}></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-400/10 rounded-full animate-spin-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-blue-400/10 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          75% { transform: translateY(-10px) translateX(-10px); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.4; transform: scale(1.5); }
          50% { opacity: 0.8; transform: scale(1.7); }
        }

        @keyframes glow-delayed {
          0%, 100% { opacity: 0.6; transform: scale(1.25); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes expand-line {
          0% { width: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { width: 8rem; opacity: 1; }
        }

        @keyframes welcome-appear {
          0% { opacity: 0; transform: scale(0.8) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes text-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.8)); }
          50% { filter: drop-shadow(0 0 40px rgba(56, 189, 248, 1)); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }

        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-glow-delayed {
          animation: glow-delayed 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-expand-line {
          animation: expand-line 1s ease-out forwards;
        }

        .animate-welcome-appear {
          animation: welcome-appear 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
}