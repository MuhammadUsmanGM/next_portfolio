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

      // Define the specific progress sequence
      const progressSequence = [10, 17, 38, 60, 78, 89, 95, 100];
      let currentStep = 0;

      // Set the initial progress
      setProgress(10);

      // Schedule the progress updates at specific intervals
      let cumulativeTime = 500; // Start after initial 10%
      const progressTimers = [];

      for (let i = 1; i < progressSequence.length; i++) {
        // Vary the intervals to make the progression feel natural
        const interval = (i === 1) ? 500 :  // 10 to 17
                        (i === 2) ? 700 :  // 17 to 38
                        (i === 3) ? 1200 :  // 38 to 60 (takes longer for real resources to load)
                        (i === 4) ? 600 :  // 60 to 78
                        (i === 5) ? 500 :  // 78 to 89
                        (i === 6) ? 400 :  // 89 to 95
                        600;               // 95 to 100

        const timer = setTimeout(() => {
          setProgress(progressSequence[i]);
          currentStep = i;
        }, cumulativeTime);

        progressTimers.push(timer);
        cumulativeTime += interval;
      }

      // At the end of the sequence, show the welcome screen
      const finalTimer = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);

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
        }, remaining);
      }, cumulativeTime);

      // Cleanup timers on unmount
      return () => {
        progressTimers.forEach(timer => clearTimeout(timer));
        clearTimeout(finalTimer);
      };
    }
  }, [onComplete]);

  // Don't render on server to prevent hydration issues
  if (typeof window === 'undefined' || (!isLoading && !showWelcome)) {
    return null;
  }

  // Define loading messages that correspond to progress stages
  const getLoadingMessage = (currentProgress) => {
    if (currentProgress < 10) return "Preparing journey...";
    if (currentProgress < 17) return "Initializing experience...";
    if (currentProgress < 38) return "Loading portfolio assets...";
    if (currentProgress < 60) return "Optimizing resources...";
    if (currentProgress < 78) return "Preparing interface...";
    if (currentProgress < 89) return "Finalizing details...";
    if (currentProgress < 95) return "Almost ready...";
    return "Welcome to my world!";
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Loading Screen */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
          !isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Enhanced cosmic background with parallax effect */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Distant stars background */}
          {[...Array(150)].map((_, i) => {
            const left = (i * 37) % 100;
            const top = (i * 29) % 100;
            const size = Math.random() * 1.5 + 0.5;
            const delay = (i * 13) % 15;
            const duration = (i * 7) % 5 + 5;
            const opacity = Math.random() * 0.7 + 0.3;

            return (
              <div
                key={`star-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  left: left + '%',
                  top: top + '%',
                  width: size + 'px',
                  height: size + 'px',
                  opacity: opacity,
                  animation: `twinkle ${duration}s infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}

          {/* Middle layer cosmic particles */}
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
                key={`particle-${i}`}
                className="absolute rounded-full opacity-10"
                style={{
                  width: width + 'px',
                  height: height + 'px',
                  left: left + '%',
                  top: top + '%',
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  background: i % 3 === 0 ? 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent 70%)' :
                              i % 3 === 1 ? 'radial-gradient(circle, rgba(6, 182, 212, 0.6), transparent 70%)' :
                                          'radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent 70%)',
                  filter: 'blur(40px)',
                  transform: `translateZ(${(i % 3) * -10}px)`, // Parallax effect
                }}
              />
            );
          })}

          {/* Distant nebula effects */}
          {[...Array(5)].map((_, i) => {
            const size = 300 + (i * 100);
            const left = (i * 41) % 100;
            const top = (i * 33) % 100;
            const duration = 20 + (i * 5);
            const delay = i * 3;

            return (
              <div
                key={`nebula-${i}`}
                className="absolute rounded-full opacity-5"
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  left: left + '%',
                  top: top + '%',
                  background: `radial-gradient(circle,
                    ${i % 3 === 0 ? 'rgba(59, 130, 246, 0.3)' :
                      i % 3 === 1 ? 'rgba(6, 182, 212, 0.3)' :
                                   'rgba(139, 92, 246, 0.3)'},
                    transparent 70%)`,
                  filter: 'blur(80px)',
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-12 animate-pulse-slow">
            {/* Glow effects around the logo */}
            <div className="absolute inset-0 blur-3xl opacity-40 bg-cyan-400 rounded-full scale-150 animate-glow"></div>
            <div className="absolute inset-0 blur-2xl opacity-60 bg-blue-400 rounded-full scale-125 animate-glow-delayed"></div>

            {/* Interactive logo that responds to mouse movement */}
            <div
              className="relative w-64 h-64 object-contain drop-shadow-2xl animate-float cursor-pointer transition-transform duration-100 ease-out"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 60px rgba(56, 189, 248, 0.6))',
              }}
              onMouseMove={(e) => {
                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Apply subtle movement based on mouse position
                const xMovement = ((x / rect.width) - 0.5) * 10;
                const yMovement = ((y / rect.height) - 0.5) * 10;

                container.style.transform = `translate(${xMovement}px, ${yMovement}px) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
              }}
            >
              <img
                src="/loading.png"
                alt="MU Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Enhanced progress bar with multi-stage visualization */}
          <div className="w-80 h-3 bg-slate-900 rounded-full overflow-hidden backdrop-blur-sm mb-2 relative border border-slate-700/50 shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated gradient flow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 animate-shimmer"></div>

              {/* Progress particles moving along the bar */}
              {Array.from({ length: Math.floor(progress / 10) }).map((_, idx) => (
                <div
                  key={idx}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: '50%',
                    left: `${(idx * 10) + 5}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `twinkle ${1 + Math.random() * 2}s infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}

              {/* Gradient highlight */}
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/40 to-transparent"></div>
            </div>
          </div>

          {/* Progress percentage and status message */}
          <div className="flex flex-col items-center">
            <div className="text-cyan-400 text-lg font-mono mb-1">
              {Math.round(progress)}%
            </div>
            <div className="text-slate-300 text-sm italic">
              {getLoadingMessage(progress)}
            </div>
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
          {[...Array(50)].map((_, i) => {
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