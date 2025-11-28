'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showWelcomeTransition, setShowWelcomeTransition] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof window !== 'undefined') {
      const minLoadTime = 5000;
      const startTime = Date.now();

      // Start the progress from 0
      setProgress(0);

      // Create a smooth progress interval that counts from 0 to 100
      // but adjust the speed based on resource loading
      let currentProgress = 0;
      let progressIncrement = 0.5; // Start with a slower increment

      // Function to preload key images
      const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Function to preload video metadata (not the full video)
      const preloadVideo = (src) => {
        return new Promise((resolve, reject) => {
          const video = document.createElement('video');
          video.preload = 'metadata'; // Only load metadata, not the whole video

          const handleCanPlay = () => {
            video.removeEventListener('loadedmetadata', handleCanPlay);
            video.removeEventListener('error', handleError);
            resolve(video);
          };

          const handleError = () => {
            video.removeEventListener('loadedmetadata', handleCanPlay);
            video.removeEventListener('error', handleError);
            reject(new Error(`Failed to load video: ${src}`));
          };

          video.addEventListener('loadedmetadata', handleCanPlay);
          video.addEventListener('error', handleError);
          video.src = src;
        });
      };

      // Create an interval that will continuously update the progress
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + progressIncrement, 100);
        setProgress(currentProgress);

        // Speed up progress as resources load
        if (currentProgress >= 80) {
          progressIncrement = 2; // Speed up as we approach the end
        } else if (currentProgress >= 50) {
          progressIncrement = 1; // Medium speed for middle section
        } else if (currentProgress >= 20) {
          progressIncrement = 0.7; // Slightly faster after initial loading
        }
      }, 100); // Update every 100ms for smooth animation

      // Preload main logo first and adjust progress when loaded
      preloadImage('/loading.png')
        .then(() => {
          // Increase the increment rate after loading main elements
          progressIncrement = 0.8;
        })
        .catch(error => {
          console.error('Error preloading main logo:', error);
        });

      // Preload header and other important images
      const imagePromises = [
        preloadImage('/images/grid1.png'),
        preloadImage('/images/html.svg'),
        preloadImage('/images/css.svg'),
        preloadImage('/images/js.png'),
        preloadImage('/images/react.svg'),
        preloadImage('/images/next.svg'),
      ];

      Promise.all(imagePromises)
        .then(() => {
          // Increase the increment rate after loading important images
          progressIncrement = 0.9;
        })
        .catch(error => {
          console.error('Error preloading important images:', error);
        });

      // Preload additional images
      const otherImagePromises = [
        preloadImage('/images/node.svg'),
        preloadImage('/images/mongodb.svg'),
        preloadImage('/images/supaBase.png'),
        preloadImage('/images/git-svgrepo-com.svg'),
        preloadImage('/images/python.svg'),
        preloadImage('/images/npm.svg'),
        preloadImage('/images/openai.svg'),
        preloadImage('/images/linux.svg'),
        preloadImage('/images/cpp.svg'),
        preloadImage('/images/github.png'),
        preloadImage('/images/tailwindcss.svg'),
      ];

      Promise.all(otherImagePromises)
        .then(() => {
          // Increase the increment rate after loading all images
          progressIncrement = 1.2;
        })
        .catch(error => {
          console.error('Error preloading other images:', error);
        });

      // Preload video metadata
      const videoPromises = [
        preloadVideo('/videos/hero-video.webm'),
        preloadVideo('/videos/galaxy.webm'),
        preloadVideo('/videos/blackhole.webm'),
      ];

      Promise.all(videoPromises)
        .then(() => {
          // Increase the increment rate significantly after loading videos
          progressIncrement = 2.5;
        })
        .catch(error => {
          console.error('Error preloading videos:', error);
        });

      // When we reach 100%, clear the interval and finish the loading
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);

        setTimeout(() => {
          // Show welcome screen at the same time loading screen starts to fade out
          // This creates an overlap that prevents any black flash
          setShowWelcome(true);
          // After a moment, start fading out the loading screen
          setTimeout(() => {
            setIsLoading(false);
          }, 10); // Very small delay to ensure both are in the transition at the same time

          // Show welcome for 3 seconds then complete with smooth transition
          setTimeout(() => {
            // Trigger the zoom-out animation
            setShowWelcomeTransition(true);
            // After the animation completes, finish the loading sequence
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              }
            }, 1200); // Match the animation duration
          }, 3000); // Keep original timing for the welcome display
        }, remaining);
      }, minLoadTime); // Ensure we wait the minimum time

      // Cleanup interval on unmount
      return () => {
        clearInterval(progressInterval);
      };
    }
  }, [onComplete]);

  // Don't render on server to prevent hydration issues
  if (typeof window === 'undefined' || (!isLoading && !showWelcome)) {
    return null;
  }

  // Define loading messages that correspond to progress stages
  const getLoadingMessage = (currentProgress) => {
    if (currentProgress < 10) return "Starting journey...";
    if (currentProgress < 20) return "Preparing experience...";
    if (currentProgress < 30) return "Loading assets...";
    if (currentProgress < 40) return "Initializing systems...";
    if (currentProgress < 50) return "Gathering resources...";
    if (currentProgress < 60) return "Optimizing performance...";
    if (currentProgress < 70) return "Configuring interface...";
    if (currentProgress < 80) return "Preparing content...";
    if (currentProgress < 90) return "Finalizing details...";
    if (currentProgress < 100) return "Almost ready...";
    return "Welcome to my world!";
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Loading Screen */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
          isLoading ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
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
          <div className="relative mb-12">
            {/* Dynamic glow effects that intensify with progress */}
            <div
              className="absolute inset-0 rounded-full scale-150"
              style={{
                background: `radial-gradient(circle at center,
                  rgba(56, 189, 248, ${progress / 300}) 0%,
                  rgba(96, 165, 250, ${progress / 250}) 40%,
                  transparent 70%)`,
                opacity: progress / 100,
                filter: 'blur(40px)',
                transition: 'all 0.5s ease-out'
              }}
            ></div>

            {/* Secondary glow layer for added depth */}
            <div
              className="absolute inset-0 rounded-full scale-125"
              style={{
                background: `radial-gradient(circle at center,
                  rgba(139, 92, 246, ${progress / 200}) 0%,
                  rgba(59, 130, 246, ${progress / 180}) 30%,
                  transparent 70%)`,
                opacity: progress / 120,
                filter: 'blur(30px)',
                transition: 'all 0.5s ease-out'
              }}
            ></div>

            {/* Main logo with dynamic size and enhancements */}
            <div
              className="relative w-64 h-64 object-contain"
              style={{
                filter: `drop-shadow(0 0 ${10 + progress / 8}px rgba(59, 130, 246, ${0.3 + progress / 200}))
                         drop-shadow(0 0 ${20 + progress / 5}px rgba(139, 92, 246, ${0.3 + progress / 180}))`,
                transform: `scale(${0.9 + (progress / 100) * 1.0})`, // Scale from 0.9 to 1.9 as progress goes from 0 to 100
                transition: 'all 0.5s ease-out'
              }}
            >
              <img
                src="/loading.png"
                alt="MU Logo"
                className="w-full h-full object-contain"
                style={{
                  filter: `brightness(${1 + progress / 300}) contrast(${1 + progress / 250})`,
                  transition: 'filter 0.5s ease-out'
                }}
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
        className={`absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
          showWelcome && !showWelcomeTransition ? 'opacity-100 z-30' : 'opacity-0 z-0 pointer-events-none'
        } ${showWelcomeTransition ? 'animate-welcome-zoom-out' : ''}`}
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
        <div className="relative z-10 text-center px-8 opacity-100">
          <div className="space-y-6">
            {/* Top accent line */}
            <div className="flex justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-expand-line"></div>
            </div>

            {/* Main welcome text */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative">
              <span className="relative inline-block animate-text-glow">
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60"></span>
                <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text animate-gradient">
                  WELCOME
                </span>
              </span>
            </h1>

            {/* Muhammad Usman Name */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-6xl md:text-8xl font-bold tracking-wide">
                <span className="relative inline-block">
                  <span className="absolute inset-0 blur-sm bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-40 animate-pulse"></span>
                  <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Muhammad Usman
                  </span>
                </span>
              </h2>
            </div>

            {/* Role - Agentic AI Developer */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-2xl md:text-4xl font-light text-cyan-300 mb-8">
                <span className="relative inline-block">
                  <span className="absolute inset-0 blur-[2px] bg-gradient-to-r from-blue-400 to-purple-500 opacity-30"></span>
                  <span className="relative">
                    Agentic AI Developer
                  </span>
                </span>
              </p>
            </div>

            {/* Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400"></div>
              <p className="text-lg md:text-xl text-cyan-300 font-light">
                Crafting Intelligent Experiences
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400"></div>
            </div>

            {/* Animated particles around the text */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => {
                const left = 10 + (i * 6) % 80;
                const top = 20 + (i * 13) % 60;
                const size = Math.random() * 3 + 1;
                const delay = (i * 7) % 5;
                const duration = 3 + Math.random() * 4;

                return (
                  <div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-cyan-400 opacity-30 animate-float"
                    style={{
                      left: left + '%',
                      top: top + '%',
                      width: size + 'px',
                      height: size + 'px',
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </div>

            {/* Bottom accent line */}
            <div className="flex justify-center animate-fade-in-delay">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-expand-line-delay"></div>
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

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-5px, -10px) rotate(5deg); }
          50% { transform: translate(5px, -5px) rotate(-5deg); }
          75% { transform: translate(-5px, 5px) rotate(5deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 1s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-expand-line-delay {
          animation: expand-line 1s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes welcome-zoom-out {
          0% {
            transform: scale(1) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: scale(1.5) translateZ(0);
            opacity: 0;
          }
        }

        .animate-welcome-zoom-out {
          animation: welcome-zoom-out 1.2s ease-out forwards;
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