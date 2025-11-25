"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePortfolio } from './usePortfolio';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Info from './components/Info';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Sidebar from './components/Sidebar';
import Contact from './components/Contact';
import ScrollAnimations from './components/ScrollAnimations';

// Function to convert URLs and emails in text to clickable links
const convertUrlsToLinks = (text) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Regular expression to match email addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  // First split by URLs
  let parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    // If it's a URL (odd indices after splitting)
    if (index % 2 === 1) {
      return (
        <a 
          key={`url-${index}`} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
          onClick={(e) => e.stopPropagation()} // Prevent chat bubble click from closing
        >
          {part}
        </a>
      );
    }
    // If it's regular text (even indices), check for emails inside
    else {
      // Split the text by email addresses
      const emailParts = part.split(emailRegex);
      return emailParts.map((emailPart, emailIndex) => {
        // If it's an email address (odd indices after splitting by email)
        if (emailIndex % 2 === 1) {
          return (
            <a
              key={`email-${index}-${emailIndex}`}
              href={`mailto:${emailPart}`}
              className="text-blue-400 underline hover:text-blue-300"
              onClick={(e) => e.stopPropagation()} // Prevent chat bubble click from closing
            >
              {emailPart}
            </a>
          );
        }
        // If it's regular text (even indices), return as is
        return emailPart;
      });
    }
  });

  // Flatten the nested arrays to a single array
  return processedParts.flat();
};

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [activeChat, setActiveChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hey! I'm Chatty, Muhammad Usman's assistant. If you need any info about Usman just ask!", sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(true);
  const [showChatbotToggle, setShowChatbotToggle] = useState(false);
  const [chatbotMode, setChatbotMode] = useState('default'); // 'default' or 'corner'
  const messagesEndRef = useRef(null);
  const techTrackRef = useRef(null);
  const chatInputRef = useRef(null);
  const [techStackIndex, setTechStackIndex] = useState(0);
  const techItems = [
    { tech: "HTML5", src: "/images/html.svg", name: "HTML5" },
    { tech: "CSS3", src: "/images/css.svg", name: "CSS3" },
    { tech: "JavaScript", src: "/images/js.png", name: "JavaScript" },
    { tech: "React", src: "/images/react.svg", name: "React" },
    { tech: "Next.js", src: "/images/next.svg", name: "Next.js" },
    { tech: "Node.js", src: "/images/node.svg", name: "Node.js" },
    { tech: "MongoDB", src: "/images/mongodb.svg", name: "MongoDB" },
    { tech: "Supabase", src: "/images/supaBase.png", name: "Supabase" },
    { tech: "Git", src: "/images/git-svgrepo-com.svg", name: "Git" },
    { tech: "Python", src: "/images/python.svg", name: "Python" },
    { tech: "NPM", src: "/images/npm.svg", name: "NPM" },
    { tech: "TypeScript", src: "/images/openai.svg", name: "OpenAI SDK" },
    { tech: "Linux", src: "/images/linux.svg", name: "Linux" },
    { tech: "C++", src: "/images/cpp.svg", name: "C++" },
    { tech: "github", src: "/images/github.png", name: "Github" },
    { tech: "tailwindcss", src: "/images/tailwindcss.svg", name: "Tailwind CSS" }
  ];
  const itemsPerPage = 4; // Number of items to show per page on mobile

  // State for mobile tech stack carousel
  const [currentTechIndex, setCurrentTechIndex] = useState(0);

  // Touch handling state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Function to get adjacent tech item indices with wrapping
  const getCurrentIndex = (offset) => {
    const newIndex = currentTechIndex + offset;

    if (newIndex < 0) {
      return techItems.length - 1; // Wrap to last item
    } else if (newIndex >= techItems.length) {
      return 0; // Wrap to first item
    }
    return newIndex;
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Minimum swipe distance for left
    const isRightSwipe = distance < -50; // Minimum swipe distance for right

    if (isLeftSwipe) {
      // Swipe left - go to next item
      setCurrentTechIndex(prev => prev < techItems.length - 1 ? prev + 1 : 0);
    } else if (isRightSwipe) {
      // Swipe right - go to previous item
      setCurrentTechIndex(prev => prev > 0 ? prev - 1 : techItems.length - 1);
    }
  };

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  // Auto-hide chatbot on mobile after 10 seconds
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const timer = setTimeout(() => {
        setChatbotVisible(false);
        setShowChatbotToggle(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  // Chatbot behavior: Show thought bubble for 20 seconds, then move to corner
  useEffect(() => {
    // Set initial timer to move chatbot to corner after 20 seconds
    // Store the timer ID in window to be accessible for clearing
    window.chatbotTimer = setTimeout(() => {
      setChatbotMode('corner');
    }, 20000);

    // Reset timer when user interacts with chatbot
    const resetTimer = () => {
      if (window.chatbotTimer) {
        clearTimeout(window.chatbotTimer);
      }
      setChatbotMode('default');
      // Set a new timer to move to corner after another 20 seconds
      window.chatbotTimer = setTimeout(() => {
        setChatbotMode('corner');
      }, 20000);
    };

    const chatbotButton = document.querySelector('.chatbot-icon-btn');
    if (chatbotButton) {
      chatbotButton.addEventListener('mouseenter', resetTimer);
      chatbotButton.addEventListener('click', resetTimer);
    }

    // For mobile, only reset timer on direct chatbot interaction, not on scrolling
    const handleDirectInteraction = (e) => {
      // Only reset timer if the click/touch is directly on the chatbot
      if (e.target.closest('.chatbot-icon-btn, .chatbot-toggle-btn, .chatbot-thought-bubble')) {
        resetTimer();
      }
    };

    // Add event listeners for mobile-specific behavior
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Only reset timer on direct chatbot interactions (not on scrolling)
      window.addEventListener('touchstart', handleDirectInteraction, { passive: true });
      window.addEventListener('click', handleDirectInteraction);
    } else {
      // For desktop, only reset timer on direct chatbot interaction (not on general clicks)
      window.addEventListener('click', handleDirectInteraction);
    }

    // Cleanup function
    return () => {
      if (window.chatbotTimer) {
        clearTimeout(window.chatbotTimer);
      }
      if (chatbotButton) {
        chatbotButton.removeEventListener('mouseenter', resetTimer);
        chatbotButton.removeEventListener('click', resetTimer);
      }
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        window.removeEventListener('touchstart', handleDirectInteraction);
        window.removeEventListener('click', handleDirectInteraction);
      } else {
        window.removeEventListener('click', resetTimer);
      }
    };
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Calculate the scroll amount for exactly 1 item (width of 1 tech item)
  const calculateScrollAmount = () => {
    // Each item is 90px wide with 15px gap between items
    return 90; // 1 item width (90px) - we'll scroll by one item at a time
  };

  // Tech Stack Navigation Functions - Scroll by exactly 1 item
  const nextTechPage = async () => {
    if (techTrackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = techTrackRef.current;
      const scrollAmount = calculateScrollAmount();
      const maxScroll = scrollWidth - clientWidth;
      
      if (scrollLeft >= maxScroll - 1) {
        // If at the end, loop back to the beginning
        techTrackRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Scroll by exactly 1 item to the right
        techTrackRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const prevTechPage = async () => {
    if (techTrackRef.current) {
      const { scrollLeft } = techTrackRef.current;
      const scrollAmount = calculateScrollAmount();
      
      if (scrollLeft <= 1) {
        // If at the beginning, loop to the end
        techTrackRef.current.scrollTo({
          left: techTrackRef.current.scrollWidth - techTrackRef.current.clientWidth,
          behavior: 'smooth'
        });
      } else {
        // Scroll by exactly 1 item to the left
        techTrackRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // Function to show the chatbot again
  const showChatbot = () => {
    setChatbotVisible(true);
    setShowChatbotToggle(false);
  };

  // Auto-hide chatbot logic with reset on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setChatbotVisible(true);
        setShowChatbotToggle(false);
        
        // Reset the auto-hide timer
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(() => {
          setChatbotVisible(false);
          setShowChatbotToggle(true);
        }, 10000); // 10 seconds
      }
    };

    let autoHideTimer;

    // Only set up auto-hide and interaction handlers on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Initial auto-hide after 10 seconds
      autoHideTimer = setTimeout(() => {
        setChatbotVisible(false);
        setShowChatbotToggle(true);
      }, 10000);

      // Add event listeners for user interactions
      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);
      window.addEventListener('scroll', handleUserInteraction);
    }

    // Clean up event listeners and timer
    return () => {
      if (isMobile) {
        clearTimeout(autoHideTimer);
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('scroll', handleUserInteraction);
      }
    };
  }, []);

  usePortfolio();

  // Auto-resize textarea based on content
  const resizeTextarea = () => {
    if (chatInputRef.current) {
      // Reset height to auto to properly calculate scrollHeight
      chatInputRef.current.style.height = 'auto';
      
      // Calculate the appropriate height, but cap it at 3 lines max
      const maxHeight = 46 * 3; // 3 lines max (46px per line approx)
      const newHeight = Math.min(chatInputRef.current.scrollHeight, maxHeight);
      
      chatInputRef.current.style.height = newHeight + 'px';
    }
  };

  // Update textarea height when content changes
  useEffect(() => {
    resizeTextarea();
  }, [chatInput]);

  const openModal = (modalType) => {
    setActiveModal(modalType);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const openChat = () => {
    // If chatbot is in corner mode, restore it to default first
    if (chatbotMode === 'corner') {
      setChatbotMode('default');
    }
    setActiveChat(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeChat = () => {
    setActiveChat(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const sendMessage = async () => {
    if (chatInput.trim() === '') return;
    
    // Add user message to chat
    const userMessage = chatInput;
    const userMessageObj = {
      id: Date.now(),
      text: userMessage,
      sender: 'user'
    };
    
    // Update chat messages with user's message
    setChatMessages(prev => [...prev, userMessageObj]);
    setChatInput('');
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add bot's response to chat
        const botMessageObj = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot'
        };
        setChatMessages(prev => [...prev, botMessageObj]);
      } else {
        console.error('Error from API:', data.error);
        let errorMessage = "Sorry, I'm having trouble responding right now. ";
        
        if (response.status === 429) {
          errorMessage += "Please wait a moment before trying again.";
        } else if (data.error && data.error.includes("Rate limit")) {
          errorMessage += "The chat service is temporarily busy. Please try again in a few minutes.";
        } else {
          errorMessage += "The site owner may need to check their API configuration.";
        }
        
        // Add error message to chat
        const errorMessageObj = {
          id: Date.now() + 1,
          text: errorMessage,
          sender: 'bot'
        };
        setChatMessages(prev => [...prev, errorMessageObj]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessageObj = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the chat service. The site owner may need to check their API configuration. Please try again later.",
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, errorMessageObj]);
    } finally {
      // Hide loading indicator
      setIsLoading(false);
    }
  };

  // Privacy Policy Content
  const PrivacyPolicyContent = () => (
    <div className="modal-content">
      <h2>Privacy Policy</h2>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
      
      <h3>Information We Collect</h3>
      <p>We may collect information when you contact us through our contact form, including your name, email address, message content, and timestamp of submission. This information is stored in our MongoDB database.</p>
      
      <h3>How We Use Your Information</h3>
      <p>We use the information we collect to respond to your inquiries, provide requested services, and improve our offerings. Contact form submissions are stored in our secure MongoDB database for record-keeping purposes.</p>
      
      <h3>Data Storage and Security</h3>
      <p>All personal data collected through our contact form is stored in secure MongoDB databases with appropriate security measures. We implement appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data.</p>
      
      <h3>Third-Party Disclosure</h3>
      <p>We do not sell, trade, or otherwise transfer your personally identifiable information to third parties unless we provide users with advance notice. This does not include trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to maintain the confidentiality of your information.</p>
      
      <h3>Data Retention</h3>
      <p>We retain contact form submissions in our MongoDB database for as long as necessary to fulfill the purposes outlined in this privacy policy unless a longer retention period is required by law.</p>
      
      <h3>Changes to Our Privacy Policy</h3>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      
      <div className="modal-actions">
        <button onClick={closeModal} className="modal-btn">Close</button>
      </div>
    </div>
  );

  // Terms of Service Content
  const TermsOfServiceContent = () => (
    <div className="modal-content">
      <h2>Terms of Service</h2>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
      
      <h3>Use License</h3>
      <p>Permission is granted to temporarily download one copy of the materials on Muhammad Usman's website for personal, non-commercial transitory viewing only.</p>
      
      <h3>Data Collection and Storage</h3>
      <p>By using our contact forms, you consent to the collection and storage of your personal information including name, email address, and message content in our MongoDB database. This information is handled in accordance with our Privacy Policy and is used solely to respond to your inquiries.</p>
      
      <h3>Disclaimer</h3>
      <p>The materials on Muhammad Usman's website are provided on an 'as is' basis. Muhammad Usman makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      
      <h3>Limitations</h3>
      <p>In no event shall Muhammad Usman or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Muhammad Usman's website.</p>
      
      <h3>Accuracy of Materials</h3>
      <p>The materials appearing on Muhammad Usman's website could include technical, typographical, or photographic errors. Muhammad Usman does not warrant that any of the materials on its website are accurate, complete or current.</p>
      
      <h3>User Responsibilities</h3>
      <p>When using our contact forms, users agree not to submit any information that is knowingly false, inaccurate, or misleading. Users are responsible for ensuring that any personal information provided is accurate and up-to-date.</p>
      
      <div className="modal-actions">
        <button onClick={closeModal} className="modal-btn">Close</button>
      </div>
    </div>
  );

  // Cookies Policy Content
  const CookiesPolicyContent = () => (
    <div className="modal-content">
      <h2>Cookies Policy</h2>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
      
      <h3>What Are Cookies</h3>
      <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>
      
      <h3>How We Use Cookies</h3>
      <p>We use cookies for various purposes, including tracking site usage, remembering your preferences, and improving our services. We do not use cookies to store personal information.</p>
      
      <h3>Information Collected Through Forms</h3>
      <p>While we do not use cookies to store personal information from contact forms, the information you submit through our contact forms (name, email, message) is collected and stored in our MongoDB database. This information is processed solely to respond to your inquiries.</p>
      
      <h3>Disabling Cookies</h3>
      <p>You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites.</p>
      
      <h3>Third-Party Data Collection</h3>
      <p>In addition to cookies, we may collect personal information through our contact forms. This information is stored in our secure MongoDB database and is not shared with third parties without your explicit consent.</p>
      
      <div className="modal-actions">
        <button onClick={closeModal} className="modal-btn">Close</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <video
        className="back-vid"
        src="/videos/galaxy.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      ></video>

      <Header />
      <Sidebar />

      <div className="blackhole-box" data-aos="fade-down" data-aos-duration="2000">
        <video
          src="/videos/blackhole.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        ></video>
      </div>

      <Hero data-animation="slideInUp" data-delay="0" data-duration="600" />
      <About data-animation="slideInUp" data-delay="100" data-duration="600"/>
      <Info data-animation="slideInUp" data-delay="200" data-duration="600"/>
      <Projects data-animation="slideInUp" data-delay="300" data-duration="600"/>
      <Skills data-animation="slideInUp" data-delay="400" data-duration="600"/>

      <section className="tech-stack-section" id="tech-stack" data-animation="slideInUp" data-delay="500" data-duration="600">
        <h1 className="section-title autoDisplay"><span className="gradient">My Tech Stack</span></h1>
        {/* Desktop: Original horizontal scrolling tech stack */}
        <div className="tech-scroll-container desktop-tech-stack">
          <div className="tech-scroll-wrapper">
            <div className="tech-scroll-track" id="techScrollTrack">
              {/* First set */}
              <div className="tech-item" data-tech="HTML5" data-animation="zoomIn" data-delay="0" data-duration="600">
                <Image src="/images/html.svg" alt="HTML5" loading="lazy" width={50} height={50}/>
                <span className="tech-name">HTML5</span>
              </div>
              <div className="tech-item" data-tech="CSS3" data-animation="zoomIn" data-delay="50" data-duration="600">
                <Image src="/images/css.svg" alt="CSS3" loading="lazy" width={50} height={50}/>
                <span className="tech-name">CSS3</span>
              </div>
              <div className="tech-item" data-tech="JavaScript" data-animation="zoomIn" data-delay="100" data-duration="600">
                <Image src="/images/js.png" alt="JavaScript" loading="lazy" width={50} height={50}/>
                <span className="tech-name">JavaScript</span>
              </div>
              <div className="tech-item" data-tech="React" data-animation="zoomIn" data-delay="150" data-duration="600">
                <Image src="/images/react.svg" alt="React" loading="lazy" width={50} height={50}/>
                <span className="tech-name">React</span>
              </div>
              <div className="tech-item" data-tech="Next.js" data-animation="zoomIn" data-delay="200" data-duration="600">
                <Image src="/images/next.svg" alt="Next.js" loading="lazy" width={60} height={60}/>
                <span className="tech-name">Next.js</span>
              </div>
              <div className="tech-item" data-tech="Node.js" data-animation="zoomIn" data-delay="250" data-duration="600">
                <Image src="/images/node.svg" alt="Node.js" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Node.js</span>
              </div>
              <div className="tech-item" data-tech="MongoDB" data-animation="zoomIn" data-delay="300" data-duration="600">
                <Image src="/images/mongodb.svg" alt="MongoDB" loading="lazy" width={50} height={50}/>
                <span className="tech-name">MongoDB</span>
              </div>
              <div className="tech-item" data-tech="Supabase" data-animation="zoomIn" data-delay="350" data-duration="600">
                <Image src="/images/supaBase.png" alt="Supabase" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Supabase</span>
              </div>
              <div className="tech-item" data-tech="Git" data-animation="zoomIn" data-delay="400" data-duration="600">
                <Image
                  src="/images/git-svgrepo-com.svg"
                  alt="Git"
                  loading="lazy"
                  width={50}
                  height={50}
                />
                <span className="tech-name">Git</span>
              </div>
              <div className="tech-item" data-tech="Python" data-animation="zoomIn" data-delay="450" data-duration="600">
                <Image src="/images/python.svg" alt="Python" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Python</span>
              </div>
              <div className="tech-item" data-tech="NPM" data-animation="zoomIn" data-delay="500" data-duration="600">
                <Image src="/images/npm.svg" alt="NPM" loading="lazy" width={50} height={50}/>
                <span className="tech-name">NPM</span>
              </div>
              <div className="tech-item" data-tech="TypeScript" data-animation="zoomIn" data-delay="550" data-duration="600">
                <Image src="/images/openai.svg" alt="TypeScript" loading="lazy" width={50} height={50}/>
                <span className="tech-name">OpenAI SDK</span>
              </div>
              <div className="tech-item" data-tech="Linux" data-animation="zoomIn" data-delay="550" data-duration="600">
                <Image src="/images/linux.svg" alt="Linux" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Linux</span>
              </div>
              <div className="tech-item" data-tech="C++" data-animation="zoomIn" data-delay="600" data-duration="600">
                <Image src="/images/cpp.svg" alt="C++" loading="lazy" width={50} height={50}/>
                <span className="tech-name">C++</span>
              </div>
              <div className="tech-item" data-tech="github" data-animation="zoomIn" data-delay="650" data-duration="600">
                <Image src="/images/github.png" alt="github" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Github</span>
              </div>
              <div className="tech-item" data-tech="tailwindcss" data-animation="zoomIn" data-delay="700" data-duration="600">
                <Image src="/images/tailwindcss.svg" alt="tailwindcss" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Tailwind CSS</span>
              </div>

              {/* duplicate to see seamless flow */}
              <div className="tech-item" data-tech="HTML5" data-animation="zoomIn" data-delay="0" data-duration="600">
                <Image src="/images/html.svg" alt="HTML5" loading="lazy" width={50} height={50}/>
                <span className="tech-name">HTML5</span>
              </div>
              <div className="tech-item" data-tech="CSS3" data-animation="zoomIn" data-delay="50" data-duration="600">
                <Image src="/images/css.svg" alt="CSS3" loading="lazy" width={50} height={50}/>
                <span className="tech-name">CSS3</span>
              </div>
              <div className="tech-item" data-tech="JavaScript" data-animation="zoomIn" data-delay="100" data-duration="600">
                <Image src="/images/js.png" alt="JavaScript" loading="lazy" width={50} height={50}/>
                <span className="tech-name">JavaScript</span>
              </div>
              <div className="tech-item" data-tech="React" data-animation="zoomIn" data-delay="150" data-duration="600">
                <Image src="/images/react.svg" alt="React" loading="lazy" width={50} height={50}/>
                <span className="tech-name">React</span>
              </div>
              <div className="tech-item" data-tech="Next.js" data-animation="zoomIn" data-delay="200" data-duration="600">
                <Image src="/images/next.svg" alt="Next.js" loading="lazy" width={60} height={60}/>
                <span className="tech-name">Next.js</span>
              </div>
              <div className="tech-item" data-tech="Node.js" data-animation="zoomIn" data-delay="250" data-duration="600">
                <Image src="/images/node.svg" alt="Node.js" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Node.js</span>
              </div>
              <div className="tech-item" data-tech="MongoDB" data-animation="zoomIn" data-delay="300" data-duration="600">
                <Image src="/images/mongodb.svg" alt="MongoDB" loading="lazy" width={50} height={50}/>
                <span className="tech-name">MongoDB</span>
              </div>
              <div className="tech-item" data-tech="Supabase" data-animation="zoomIn" data-delay="350" data-duration="600">
                <Image src="/images/supaBase.png" alt="Supabase" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Supabase</span>
              </div>
              <div className="tech-item" data-tech="Git" data-animation="zoomIn" data-delay="400" data-duration="600">
                <Image
                  src="/images/git-svgrepo-com.svg"
                  alt="Git"
                  loading="lazy"
                  width={50}
                  height={50}
                />
                <span className="tech-name">Git</span>
              </div>
              <div className="tech-item" data-tech="Python" data-animation="zoomIn" data-delay="450" data-duration="600">
                <Image src="/images/python.svg" alt="Python" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Python</span>
              </div>
              <div className="tech-item" data-tech="NPM" data-animation="zoomIn" data-delay="500" data-duration="600">
                <Image src="/images/npm.svg" alt="NPM" loading="lazy" width={50} height={50}/>
                <span className="tech-name">NPM</span>
              </div>
              <div className="tech-item" data-tech="TypeScript" data-animation="zoomIn" data-delay="550" data-duration="600">
                <Image src="/images/openai.svg" alt="TypeScript" loading="lazy" width={50} height={50}/>
                <span className="tech-name">OpenAI Agent SDK</span>
              </div>
              <div className="tech-item" data-tech="Linux" data-animation="zoomIn" data-delay="550" data-duration="600">
                <Image src="/images/linux.svg" alt="Linux" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Linux</span>
              </div>
              <div className="tech-item" data-tech="C++" data-animation="zoomIn" data-delay="600" data-duration="600">
                <Image src="/images/cpp.svg" alt="C++" loading="lazy" width={50} height={50}/>
                <span className="tech-name">C++</span>
              </div>
              <div className="tech-item" data-tech="github" data-animation="zoomIn" data-delay="650" data-duration="600">
                <Image src="/images/github.png" alt="github" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Github</span>
              </div>
              <div className="tech-item" data-tech="tailwindcss" data-animation="zoomIn" data-delay="700" data-duration="600">
                <Image src="/images/tailwindcss.svg" alt="tailwindcss" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Tailwind CSS</span>
              </div>

              {/* Third set of items for seamless looping */}
              <div className="tech-item" data-tech="HTML5" data-animation="zoomIn" data-delay="0" data-duration="600">
                <Image src="/images/html.svg" alt="HTML5" loading="lazy" width={50} height={50}/>
                <span className="tech-name">HTML5</span>
              </div>
              <div className="tech-item" data-tech="CSS3" data-animation="zoomIn" data-delay="50" data-duration="600">
                <Image src="/images/css.svg" alt="CSS3" loading="lazy" width={50} height={50}/>
                <span className="tech-name">CSS3</span>
              </div>
              <div className="tech-item" data-tech="JavaScript" data-animation="zoomIn" data-delay="100" data-duration="600">
                <Image src="/images/js.png" alt="JavaScript" loading="lazy" width={50} height={50}/>
                <span className="tech-name">JavaScript</span>
              </div>
              <div className="tech-item" data-tech="React" data-animation="zoomIn" data-delay="150" data-duration="600">
                <Image src="/images/react.svg" alt="React" loading="lazy" width={50} height={50}/>
                <span className="tech-name">React</span>
              </div>
              <div className="tech-item" data-tech="Next.js" data-animation="zoomIn" data-delay="200" data-duration="600">
                <Image src="/images/next.svg" alt="Next.js" loading="lazy" width={60} height={60}/>
                <span className="tech-name">Next.js</span>
              </div>
              <div className="tech-item" data-tech="Node.js" data-animation="zoomIn" data-delay="250" data-duration="600">
                <Image src="/images/node.svg" alt="Node.js" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Node.js</span>
              </div>
              <div className="tech-item" data-tech="MongoDB" data-animation="zoomIn" data-delay="300" data-duration="600">
                <Image src="/images/mongodb.svg" alt="MongoDB" loading="lazy" width={50} height={50}/>
                <span className="tech-name">MongoDB</span>
              </div>
              <div className="tech-item" data-tech="Supabase" data-animation="zoomIn" data-delay="350" data-duration="600">
                <Image src="/images/supaBase.png" alt="Supabase" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Supabase</span>
              </div>
              <div className="tech-item" data-tech="Git" data-animation="zoomIn" data-delay="400" data-duration="600">
                <Image
                  src="/images/git-svgrepo-com.svg"
                  alt="Git"
                  loading="lazy"
                  width={50}
                  height={50}
                />
                <span className="tech-name">Git</span>
              </div>
              <div className="tech-item" data-tech="Python" data-animation="zoomIn" data-delay="450" data-duration="600">
                <Image src="/images/python.svg" alt="Python" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Python</span>
              </div>
              <div className="tech-item" data-tech="NPM" data-animation="zoomIn" data-delay="500" data-duration="600">
                <Image src="/images/npm.svg" alt="NPM" loading="lazy" width={50} height={50}/>
                <span className="tech-name">NPM</span>
              </div>
              <div className="tech-item" data-tech="TypeScript" data-animation="zoomIn" data-delay="550" data-duration="600">
                <Image src="/images/openai.svg" alt="TypeScript" loading="lazy" width={50} height={50}/>
                <span className="tech-name">OpenAI Agent SDK</span>
              </div>
              <div className="tech-item" data-tech="Linux" data-animation="zoomIn" data-delay="550" data-duration="600">
                <Image src="/images/linux.svg" alt="Linux" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Linux</span>
              </div>
              <div className="tech-item" data-tech="C++" data-animation="zoomIn" data-delay="600" data-duration="600">
                <Image src="/images/cpp.svg" alt="C++" loading="lazy" width={50} height={50}/>
                <span className="tech-name">C++</span>
              </div>
              <div className="tech-item" data-tech="github" data-animation="zoomIn" data-delay="650" data-duration="600">
                <Image src="/images/github.png" alt="github" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Github</span>
              </div>
              <div className="tech-item" data-tech="tailwindcss" data-animation="zoomIn" data-delay="700" data-duration="600">
                <Image src="/images/tailwindcss.svg" alt="tailwindcss" loading="lazy" width={50} height={50}/>
                <span className="tech-name">Tailwind CSS</span>
              </div>

            </div>
          </div>
        </div>
        
        {/* Mobile Tech Stack - Center Card with Side Previews and Touch Swipe */}
        <div
          className="tech-stack-simple-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="tech-stack-simple-wrapper">
            <div className="tech-stack-simple-track">
              {/* Left Preview Card - Black and White */}
              {techItems.length > 0 && (
                <div className="tech-card-simple tech-card-left-simple">
                  <Image
                    src={techItems[getCurrentIndex(-1)].src}
                    alt={techItems[getCurrentIndex(-1)].tech}
                    width={40}
                    height={40}
                    style={{filter: 'grayscale(100%)'}}
                  />
                  <span className="tech-card-name">{techItems[getCurrentIndex(-1)].name}</span>
                </div>
              )}

              {/* Center Main Card - Full Color */}
              {techItems.length > 0 && (
                <div className="tech-card-main-simple">
                  <Image
                    src={techItems[currentTechIndex].src}
                    alt={techItems[currentTechIndex].tech}
                    width={60}
                    height={60}
                  />
                  <span className="tech-card-name">{techItems[currentTechIndex].name}</span>
                </div>
              )}

              {/* Right Preview Card - Black and White */}
              {techItems.length > 0 && (
                <div className="tech-card-simple tech-card-right-simple">
                  <Image
                    src={techItems[getCurrentIndex(1)].src}
                    alt={techItems[getCurrentIndex(1)].tech}
                    width={40}
                    height={40}
                    style={{filter: 'grayscale(100%)'}}
                  />
                  <span className="tech-card-name">{techItems[getCurrentIndex(1)].name}</span>
                </div>
              )}
            </div>

            {/* Swipe Indicator */}
            <div className="swipe-indicator">
              <span>← Swipe →</span>
            </div>
          </div>
        </div>
        
        <div className="tech-description-container" data-animation="fadeInUp" data-duration="800" data-delay="1000">
          <h2 className="tech-subtitle">Technologies I Work With</h2>
          <p className="tech-description">
            Passionate about working with{' '}
            <span className="highlight">cutting-edge technologies</span> to build
            scalable, efficient, and user-friendly applications. Always learning
            and adapting to the latest industry standards.
          </p>
        </div>
      </section>

      <Contact />

      <footer className="main-footer" data-animation="fadeInUp" data-duration="800" data-delay="200">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-logo" data-animation="slideInUp" data-duration="800" data-delay="400">Muhammad Usman</h3>
            <p className="footer-tagline" data-animation="slideInUp" data-duration="800" data-delay="600">Agentic AI Developer & UI/UX Specialist</p>
          </div>

          <div className="footer-links" data-animation="fadeInUp" data-duration="800" data-delay="800">
            <div className="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Connect</h4>
              <ul>
                <li><a href="mailto:mu.ai.dev@gmail.com">Email</a></li>
                <li><a href="https://github.com/MuhammadUsmanGM" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/muhammad-usman-099704390" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://wa.me/923256550687?text=Hi%20Muhammad%20Usman,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href="tel:+923256550687">Phone</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resume</h4>
              <ul>
                <li>
                  <a href="/Usman  Agentic AI Developer Resume.pdf" download>
                    <i className="bx bx-download"></i> Download CV
                  </a>
                </li>
                <li>
                  <a href="https://muhammadusmangmresume.my.canva.site/" target="_blank" rel="noopener noreferrer">
                    <i className="bx bx-globe"></i> Visit CV Online
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('privacy'); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('terms'); }}>Terms of Service</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('cookies'); }}>Cookies</a></li>
              </ul>
            </div>
            
          </div>
        </div>

        <div className="footer-bottom" data-animation="fadeInUp" data-duration="800" data-delay="1000">
          <p>©️ {new Date().getFullYear()} Muhammad Usman. All rights reserved.</p>
          <div className="social-links">
            <a href="mailto:mu.ai.dev@gmail.com" aria-label="Email">
              <i className="bx bxl-telegram"></i>
            </a>
            <a href="https://github.com/MuhammadUsmanGM" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="bx bxl-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/muhammad-usman-099704390" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="bx bxl-linkedin-square"></i>
            </a>
            <a href="https://wa.me/923256550687?text=Hi%20Muhammad%20Usman,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="bx bxl-whatsapp"></i>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals for legal pages */}
      {activeModal === 'privacy' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <PrivacyPolicyContent />
          </div>
        </div>
      )}

      {activeModal === 'terms' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <TermsOfServiceContent />
          </div>
        </div>
      )}

      {activeModal === 'cookies' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <CookiesPolicyContent />
          </div>
        </div>
      )}
    {/* Chatbot Interface */}
    {activeChat && chatbotVisible && (
      <div className="chatbot-interface-overlay" onClick={closeChat}>
        <div className="chatbot-interface" onClick={(e) => e.stopPropagation()}>
          <div className="chatbot-header">
            <div className="chatbot-header-icon">
              <img src="/bot.png" alt="Chatty" width={40} height={40} />
            </div>
            <div className="chatbot-header-text">
              <h3>Chatty</h3>
              <p>Muhammad Usman's Assistant</p>
            </div>
            <button className="chatbot-close-btn" onClick={closeChat}>
              <i className="bx bx-x"></i>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chatbot-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                <div className="chatbot-message-content">
                  {convertUrlsToLinks(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input-area">
            <textarea
              ref={chatInputRef}
              className="chatbot-input"
              placeholder="Ask me something about Usman..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows="1"
            />
            <button className="chatbot-send-btn" onClick={sendMessage}>
              <i className="bx bx-send"></i>
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Chatbot Icon - Fixed to bottom right */}
    <div className={`chatbot-container ${chatbotMode === 'corner' ? 'chatbot-corner' : ''}`} data-animation="bounceIn" data-duration="800" data-delay="400">
      {showChatbotToggle ? (
        <button className="chatbot-toggle-btn" onClick={showChatbot}>
          <img src="/bot.png" alt="Chat with Usman's assistant" width={80} height={80} />
        </button>
      ) : (
        <>
          {chatbotMode === 'default' && (
            <div className="chatbot-thought-bubble">
              <p>Hey! I'm Chatty, Usman's assistant</p>
            </div>
          )}
          <div className="chatbot-sleep-container">
            {chatbotMode === 'corner' && (
              <>
                <div className="sleeping-z-pattern z1">Z</div>
                <div className="sleeping-z-pattern z2">Z</div>
                <div className="sleeping-z-pattern z3">Z</div>
              </>
            )}
            <button
              className={`chatbot-icon-btn ${chatbotMode === 'corner' ? 'chatbot-corner-btn' : ''}`}
              onClick={openChat}
              onMouseEnter={() => {
                if (chatbotMode === 'corner') {
                  setChatbotMode('default');
                }
              }}
              onTouchStart={() => {
                if (chatbotMode === 'corner') {
                  setChatbotMode('default');
                }
              }}
            >
              <img src="/bot.png" alt="Chat with Usman's assistant" width={80} height={80} />
            </button>
          </div>
        </>
      )}
    </div>

    <ScrollAnimations />

    </div>
  )
}