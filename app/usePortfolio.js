"use client";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function usePortfolio() {
  useEffect(() => {
    AOS.init();
    // Helper function to select elements
    const $ = (selector) => document.querySelector(selector);

    // Optimize video loading
    const optimizeVideoLoading = () => {
      const blackholeVideo = $('.blackhole-box video');
      if (blackholeVideo && blackholeVideo.dataset.src) {
        blackholeVideo.src = blackholeVideo.dataset.src;
        blackholeVideo.load();
      }

      const videos = document.querySelectorAll('video[data-src]:not(.blackhole-box video)');
      videos.forEach(video => {
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                if (video.dataset.src) {
                  video.src = video.dataset.src;
                  video.load();
                }
                observer.unobserve(video);
              }
            });
          }, { root: null, rootMargin: '100px', threshold: 0.1 });
          observer.observe(video);
        } else {
          if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
          }
        }
      });
    };

    // Video hover interactions
    const video1 = document.getElementById('projectVideo1');
    const video2 = document.getElementById('projectVideo2');
    const video3 = document.getElementById('projectVideo3');
    const videoList = [video1, video2, video3];

    const handleVideoError = (video) => {
      if (!video) return;
      video.addEventListener('error', () => {
        console.log('Video failed to load:', video.src);
        const fallbackImg = document.createElement('img');
        fallbackImg.src = '/images/project-fallback.png';
        fallbackImg.alt = 'Project preview unavailable';
        fallbackImg.style.width = '100%';
        fallbackImg.style.height = '100%';
        fallbackImg.style.objectFit = 'cover';
        fallbackImg.style.borderRadius = '20px';
        if (video.parentNode) {
          video.parentNode.replaceChild(fallbackImg, video);
        }
      });
      video.addEventListener('loadstart', () => video.style.opacity = '0.5');
      video.addEventListener('canplaythrough', () => video.style.opacity = '1');
    };

    videoList.forEach((video) => {
      if (!video) return;
      handleVideoError(video);
      const hoverSign = video.parentElement.querySelector('.hover-sign');
      video.addEventListener("mouseover", () => {
        video.play().catch(error => console.log('Video play failed:', error));
        hoverSign?.classList.add("active");
      });
      video.addEventListener("mouseout", () => {
        video.pause();
        hoverSign?.classList.remove("active");
      });
    });

    // Sidebar toggle
    const sideBar = $('.sidebar');
    const menu = $('.menu-icon');
    const closeIcon = $('.close-icon');
    menu.addEventListener("click", () => {
      sideBar.classList.remove("close-sidebar");
      sideBar.classList.add("open-sidebar");
    });
    closeIcon.addEventListener("click", () => {
      sideBar.classList.remove("open-sidebar");
      sideBar.classList.add("close-sidebar");
    });

    // Contact form handler
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const emailRegex = /^[^S@]+@[^S@]+\.[^S@]+$/;
      const fieldTouched = { name: false, email: false, message: false };
      let formSubmitted = false; // Track if form has been submitted

      const validateField = (input, isValid, customMessage = null) => {
        // Only show error messages after form submission attempt
        if (!formSubmitted && !fieldTouched[input.name]) {
          const errorElement = input?.parentNode?.querySelector('.error-message');
          if (errorElement) errorElement.remove();
          // Reset border and shadow when not submitted yet
          if (input) {
            input.style.borderColor = '';
            input.style.boxShadow = '';
          }
          return;
        }
        
        if (isValid) {
          input.style.borderColor = '#72a1de';
          input.style.boxShadow = '0 0 5px #72a1de';
          const errorElement = input?.parentNode?.querySelector('.error-message');
          if (errorElement) errorElement.remove();
        } else {
          input.style.borderColor = '#ff4444';
          input.style.boxShadow = '0 0 5px #ff4444';
          let errorElement = input?.parentNode?.querySelector('.error-message');
          if (!errorElement) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.cssText = `color: #ff4444; font-size: 12px; margin-top: 5px; margin-bottom: 10px;`;
            if (input.name === 'name') errorMessage.textContent = customMessage || 'Please enter your full name (at least 2 characters)';
            else if (input.name === 'email') errorMessage.textContent = customMessage || 'Please enter a valid email address';
            else if (input.name === 'message') errorMessage.textContent = customMessage || 'Please enter your message (at least 10 characters)';
            input?.parentNode?.insertBefore(errorMessage, input?.nextSibling);
          }
        }
      };

      const validateForm = () => {
        const isNameValid = nameInput.value.trim().length >= 2;
        const isEmailValid = emailRegex.test(emailInput.value.trim());
        const isMessageValid = messageInput.value.trim().length >= 10;
        validateField(nameInput, isNameValid);
        validateField(emailInput, isEmailValid);
        validateField(messageInput, isMessageValid);
        const isFormValid = isNameValid && isEmailValid && isMessageValid;
        submitBtn.disabled = !isFormValid;
        submitBtn.style.opacity = isFormValid ? '1' : '0.5';
        return isFormValid;
      };

      nameInput?.addEventListener('blur', () => { 
        fieldTouched.name = true; 
        // Only validate after form submission attempt
        if (formSubmitted) validateForm(); 
      });
      emailInput?.addEventListener('blur', () => { 
        fieldTouched.email = true; 
        // Only validate after form submission attempt
        if (formSubmitted) validateForm(); 
      });
      messageInput?.addEventListener('blur', () => { 
        fieldTouched.message = true; 
        // Only validate after form submission attempt
        if (formSubmitted) validateForm(); 
      });
      nameInput?.addEventListener('input', () => { 
        // Only validate after form submission attempt
        if (formSubmitted) validateForm(); 
      });
      emailInput?.addEventListener('input', () => { 
        // Only validate after form submission attempt
        if (formSubmitted) validateForm(); 
      });
      messageInput?.addEventListener('input', () => { 
        // Only validate after form submission attempt
        if (formSubmitted) validateForm(); 
      });

      // Don't set initial button state based on validation
      // Only disable if fields are initially empty
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      contactForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        formSubmitted = true; // Mark that form has been submitted
        fieldTouched.name = true;
        fieldTouched.email = true;
        fieldTouched.message = true;
        if (!validateForm()) {
          const status = document.getElementById("formStatus");
          status.innerHTML = "Please fill the required fields ❌";
          status.style.color = "red";
          return;
        }
        
        // Add a simple time-based spam prevention check - form shouldn't be submitted within 3 seconds of page load
        const currentTime = Date.now();
        if (typeof window.formLoadTime === 'undefined') {
          window.formLoadTime = currentTime;
        }
        
        const timeSinceLoad = currentTime - window.formLoadTime;
        if (timeSinceLoad < 3000) {
          const status = document.getElementById("formStatus");
          status.innerHTML = "Please wait at least 3 seconds before submitting to prevent spam. ⏳";
          status.style.color = "orange";
          return;
        }
        
        // Also check if a submission was just made recently to prevent rapid submissions
        if (typeof window.lastSubmissionTime !== 'undefined') {
          const timeSinceLastSubmission = currentTime - window.lastSubmissionTime;
          if (timeSinceLastSubmission < 5000) { // 5 seconds between submissions
            const status = document.getElementById("formStatus");
            const remainingTime = Math.ceil((5000 - timeSinceLastSubmission) / 1000); // Convert to seconds
            status.innerHTML = `Please wait ${remainingTime} seconds before sending another message to prevent spam. ⏳`;
            status.style.color = "orange";
            return;
          }
        }
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        let status = document.getElementById("formStatus");
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        }
        status.innerHTML = "Sending your message...";
        status.style.color = "orange";
        try {
          if (!navigator.onLine) throw new Error('No internet connection');
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) {
            if (response.status === 500) throw new Error('Server error. Please try again later.');
            else if (response.status === 429) {
              status.innerHTML = "Too many requests. Please wait a moment before trying again. 🕐";
              status.style.color = "orange";
              return;
            } else if (response.status >= 400 && response.status < 500) throw new Error('Client error. Please check your input and try again.');
          }
          const result = await response.json();
          if (result.success) {
            status.innerHTML = result.message || "Message sent successfully! ✅ I'll get back to you soon.";
            status.style.color = "green";
            contactForm.reset();
            [nameInput, emailInput, messageInput].forEach(input => {
              if (input) {
                input.style.borderColor = '';
                input.style.boxShadow = '';
              }
            });
            fieldTouched.name = false;
            fieldTouched.email = false;
            fieldTouched.message = false;
            formSubmitted = false; // Reset form submission flag
            // Record the submission time to implement cooldown period
            window.lastSubmissionTime = Date.now();
            setTimeout(() => validateForm(), 2000);
          } else {
            status.innerHTML = result.message || "Failed to send message ❌";
            status.style.color = "red";
          }
        } catch (error) {
          console.error('Error:', error);
          if (error.message === 'No internet connection') status.innerHTML = "No internet connection. Please check your connection and try again ❌";
          else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) status.innerHTML = "Network error. Server is unreachable. Please try again later ❌";
          else if (error.message.includes('Server error')) status.innerHTML = error.message;
          else if (error.message.includes('Client error')) status.innerHTML = error.message;
          else status.innerHTML = "An unexpected error occurred. Please try again ❌";
          status.style.color = "red";
        } finally {
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnText;
          }
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
            }
            if (status.innerHTML !== "Message sent successfully! ✅ I'll get back to you soon." && !status.innerHTML.includes("I'll get back to you soon")) {
              validateForm();
            } else {
              // Only set the submission time if the message was sent successfully
              if (status.innerHTML.includes("Message sent successfully!") || 
                  status.innerHTML.includes("I'll get back to you soon")) {
                window.lastSubmissionTime = Date.now();
              }
            }
          }, 2000);
        }
      });
    }

    // Social links
    const updateSocialLinks = async () => {
      try {
        // Add a small delay to ensure the API is ready to receive requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('/api/social', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // Add cache control for development
          cache: 'no-cache'
        });

        // Check if the response is OK before parsing JSON
        if (response.ok) {
          const socialData = await response.json();
          if (socialData.success && socialData.links) {
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => link.href = `mailto:${socialData.links.email}`);
            const githubLinks = document.querySelectorAll('a[href*="github.com"]');
            githubLinks.forEach(link => {
              link.href = socialData.links.github;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
            });
          }
        } else {
          // If the API endpoint doesn't exist or returns an error, log a message but don't throw an error
          console.log('Social links API not available, using default links');
        }
      } catch (error) {
        // Handle network errors, JSON parsing errors, etc.
        console.log('Social links API not available, using default links');
      }
    };

    // Tech scroll animation
    const setupTechScrollAnimation = () => {
      const track = document.getElementById('techScrollTrack');
      if (!track) return;
      const getOriginalItemsWidth = () => {
        // Count only visible items (not hidden by CSS)
        const allItems = track.children;
        let visibleItems = [];
        
        for (let i = 0; i < allItems.length; i++) {
          const item = allItems[i];
          const computedStyle = window.getComputedStyle(item);
          if (computedStyle.display !== 'none') {
            visibleItems.push(item);
          }
        }
        
        let width = 0;
        for (let i = 0; i < visibleItems.length; i++) {
          width += visibleItems[i].offsetWidth;
          if (i < visibleItems.length - 1) {
            const computedStyle = window.getComputedStyle(visibleItems[i]);
            width += parseFloat(computedStyle.marginRight) || 30; // Use smaller default margin for mobile
          }
        }
        return width;
      };
      let originalAnimation = window.getComputedStyle(track).animation;
      let originalItemsWidth = getOriginalItemsWidth();
      const styleElement = document.createElement('style');
      styleElement.id = 'tech-scroll-animation';
      styleElement.textContent = `@keyframes scrollTech { 0% { transform: translateX(0); } 100% { transform: translateX(-${originalItemsWidth}px); } }`;
      const existingStyle = document.getElementById('tech-scroll-animation');
      if (existingStyle) existingStyle.remove();
      document.head.appendChild(styleElement);
      window.addEventListener('resize', () => {
        originalItemsWidth = getOriginalItemsWidth();
        styleElement.textContent = `@keyframes scrollTech { 0% { transform: translateX(0); } 100% { transform: translateX(-${originalItemsWidth}px); } }`;
        const wasPaused = track.classList.contains('paused');
        track.style.animation = 'none';
        track.offsetHeight;
        track.style.animation = originalAnimation;
        if (wasPaused) {
          track.classList.add('paused');
          track.style.animationPlayState = 'paused';
        }
      });
    };

    // Tech scroll observer - Only animate when in view
    const setupTechScrollObserver = () => {
      const track = document.getElementById('techScrollTrack');
      const container = $('.tech-scroll-wrapper') || $('.tech-scroll-container');
      if (!track || !('IntersectionObserver' in window) || !container) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => track.classList.toggle('paused', !entry.isIntersecting));
      }, { root: null, threshold: 0.1 }); // Start animation when 10% of element is visible
      io.observe(container);
    };

    // Tech scroll dragging - disable on mobile for performance
    const setupTechScrollDragging = () => {
      // Skip dragging setup on mobile devices to improve performance
      if (window.innerWidth <= 768) return;
      
      const track = document.getElementById('techScrollTrack');
      if (!track) return;
      let isDown = false;
      let startX;
      let startTranslateX;
      const getTranslateX = () => {
        const style = window.getComputedStyle(track);
        const transform = style.transform || style.webkitTransform;
        if (transform && transform !== 'none' && transform.includes('matrix')) {
          const matrix = new DOMMatrix(transform);
          return matrix.m41 || 0;
        }
        return 0;
      };
      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.animationPlayState = 'paused';
        startX = e.pageX - track.offsetLeft;
        startTranslateX = getTranslateX();
      });
      track.addEventListener('mouseleave', () => {
        if (isDown) {
          isDown = false;
          track.style.animationPlayState = 'running';
        }
      });
      track.addEventListener('mouseup', () => {
        isDown = false;
        setTimeout(() => { if (!isDown) track.style.animationPlayState = 'running'; }, 100);
      });
      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.style.transform = `translateX(${startTranslateX + walk}px)`;
      });
      track.addEventListener('touchstart', (e) => {
        isDown = true;
        track.style.animationPlayState = 'paused';
        startX = e.touches[0].clientX - track.getBoundingClientRect().left;
        startTranslateX = getTranslateX();
      });
      track.addEventListener('touchend', () => {
        isDown = false;
        setTimeout(() => { if (!isDown) track.style.animationPlayState = 'running'; }, 100);
      });
      track.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].clientX - track.getBoundingClientRect().left;
        const walk = (x - startX) * 2;
        track.style.transform = `translateX(${startTranslateX + walk}px)`;
      });
    };

    // Disabled project buttons
    const setupDisabledProjectButtons = () => {
      const disabledBtns = document.querySelectorAll('.project-btn[aria-disabled="true"]');
      disabledBtns.forEach((btn) => {
        btn.setAttribute('role', 'button');
        btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault(); });
      });
    };

    // Menu keyboard access
    const setupMenuKeyboardAccess = () => {
      const menuEl = $('.menu-icon');
      const closeEl = $('.close-icon');
      const open = () => { sideBar.classList.remove('close-sidebar'); sideBar.classList.add('open-sidebar'); };
      const close = () => { sideBar.classList.remove('open-sidebar'); sideBar.classList.add('close-sidebar'); };
      if (menuEl) menuEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }});
      if (closeEl) closeEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }});
    };

    // Contact buttons
    const setupContactButtons = () => {
      const contactButtons = document.querySelectorAll('.contact-btn');
      contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const contactSection = document.getElementById('contact');
          if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    };

    // Project carousel
    const initProjectCarousel = () => {
      const projectSlider = document.getElementById('projectSlider');
      if (!projectSlider) return;
      const prevBtn = document.getElementById('prevProject');
      const nextBtn = document.getElementById('nextProject');
      const projects = document.querySelectorAll('.project-card');
      const indicators = document.querySelectorAll('.indicator');
      let currentProject = 0;
      const totalProjects = projects.length;
      
      const showProject = (index) => {
        projects.forEach(project => project.classList.remove('active'));
        projects[index].classList.add('active');
        currentProject = index;
        
        // Update indicators
        indicators.forEach((indicator, i) => {
          if (i === index) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
      };
      
      nextBtn.addEventListener('click', () => showProject((currentProject + 1) % totalProjects));
      prevBtn.addEventListener('click', () => showProject((currentProject - 1 + totalProjects) % totalProjects));
      
      // Add indicator click functionality
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          showProject(index);
        });
      });
      
      let touchStartX = 0;
      projectSlider.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
      projectSlider.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        if (Math.abs(swipeDistance) < 50) return;
        if (swipeDistance > 0) showProject((currentProject + 1) % totalProjects);
        else showProject((currentProject - 1 + totalProjects) % totalProjects);
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') showProject((currentProject + 1) % totalProjects);
        else if (e.key === 'ArrowLeft') showProject((currentProject - 1 + totalProjects) % totalProjects);
      });
      
      // Initialize the first indicator as active
      if (indicators.length > 0) {
        indicators[0].classList.add('active');
      }
    };

    // Custom scrollbar
    const createCustomScrollbar = () => {
      const style = document.createElement('style');
      style.textContent = `body::-webkit-scrollbar { display: none; } body { -ms-overflow-style: none; scrollbar-width: none; }`;
      document.head.appendChild(style);
      const scrollbarContainer = document.createElement('div');
      scrollbarContainer.id = 'custom-scrollbar';
      scrollbarContainer.style.cssText = `position: fixed; top: 0; right: 0; width: 16px; height: 100vh; background: transparent; z-index: 9999; pointer-events: none;`;
      const scrollbarTrack = document.createElement('div');
      scrollbarTrack.id = 'custom-scrollbar-track';
      scrollbarTrack.style.cssText = `position: relative; width: 100%; height: 100%; background: transparent; pointer-events: none;`;
      const scrollbarThumb = document.createElement('div');
      scrollbarThumb.id = 'custom-scrollbar-thumb';
      scrollbarThumb.style.cssText = `position: absolute; top: 0; left: 2px; width: 12px; min-height: 20px; border-radius: 6px; background: linear-gradient(0deg, #00c9ff, #92fe9d, #00f0ff, #00d2ff, #0072ff); background-size: 100% 300%; background-position: 0% 0%; pointer-events: auto; cursor: pointer; transition: width 0.1s, opacity 0.3s; opacity: 0.4; box-shadow: 0 0 8px rgba(0, 201, 255, 0.6);`;
      scrollbarTrack.appendChild(scrollbarThumb);
      scrollbarContainer.appendChild(scrollbarTrack);
      document.body.appendChild(scrollbarContainer);
      const updateScrollbarSize = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollbarHeight = (windowHeight / documentHeight) * windowHeight;
        scrollbarThumb.style.height = Math.max(20, scrollbarHeight) + 'px';
      };
      const updateScrollbarPosition = () => {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const maxScrollTop = window.innerHeight - scrollbarThumb.offsetHeight;
        const newTop = scrollPercentage * maxScrollTop;
        scrollbarThumb.style.top = newTop + 'px';
      };
      let isDragging = false;
      let dragOffset = 0;
      scrollbarThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = scrollbarThumb.getBoundingClientRect();
        dragOffset = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const scrollbarRect = scrollbarTrack.getBoundingClientRect();
        const newTop = Math.max(0, Math.min(e.clientY - scrollbarRect.top - dragOffset, window.innerHeight - scrollbarThumb.offsetHeight));
        scrollbarThumb.style.top = newTop + 'px';
        const maxScrollTop = window.innerHeight - scrollbarThumb.offsetHeight;
        const scrollPercentage = newTop / maxScrollTop;
        const scrollAmount = scrollPercentage * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, scrollAmount);
      });
      document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
      });
      scrollbarContainer.addEventListener('mouseenter', () => {
        scrollbarThumb.style.opacity = '0.8';
        scrollbarThumb.style.width = '14px';
        scrollbarThumb.style.left = '1px';
      });
      scrollbarContainer.addEventListener('mouseleave', () => {
        if (!isDragging) {
          scrollbarThumb.style.opacity = '0.4';
          scrollbarThumb.style.width = '12px';
          scrollbarThumb.style.left = '2px';
        }
      });
      let ticking = false;
      const updateScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateScrollbarPosition();
            ticking = false;
          });
          ticking = true;
        }
      };
      const handleResize = () => {
        updateScrollbarSize();
        updateScrollbarPosition();
      };
      updateScrollbarSize();
      updateScrollbarPosition();
      document.addEventListener('scroll', updateScroll);
      window.addEventListener('resize', handleResize);
      scrollbarThumb.style.animation = 'colorShift 8s linear infinite';
      const animationStyle = document.createElement('style');
      animationStyle.textContent = `@keyframes colorShift { 0% { background-position: 0% 0%; } 100% { background-position: 0% 100%; } }`;
      document.head.appendChild(animationStyle);
    };

    optimizeVideoLoading();
    updateSocialLinks();
    setupTechScrollAnimation();
    setupTechScrollObserver(); // Only animate when in view
    setupTechScrollDragging();
    setupDisabledProjectButtons();
    setupMenuKeyboardAccess();
    setupContactButtons();
    initProjectCarousel();
    createCustomScrollbar();
    
  }, []);
}
