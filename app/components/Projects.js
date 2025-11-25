import { useState } from 'react';
import Image from 'next/image';

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  
  // Dummy project details for each project
  const projectDetails = {
    portfolio: {
      title: "Modern Portfolio Website",
      description: "A sleek and responsive portfolio website highlighting projects and developer skills.",
      fullDescription: "This portfolio showcases advanced UI/UX components with modern animations and interactions. Built with Next.js and React, it features a chatbot assistant, interactive elements, and smooth scrolling experiences.",
      techStack: ["Next.js", "React", "Tailwind CSS", "JavaScript", "CSS", "HTML", "Google Gen AI"],
      features: [
        "AI-powered chatbot assistant",
        "Interactive tech stack visualization", 
        "Smooth animations and transitions",
        "Fully responsive design",
        "Performance optimized"
      ],
      challenges: [
        "Implementing the chatbot with AI integration",
        "Creating smooth animations without performance issues",
        "Optimizing for different screen sizes"
      ],
      impact: "Demonstrates my skills in modern web development and UI/UX design."
    },
    newsletter: {
      title: "AI Newsletter Website",
      description: "An interactive and responsive site to get updated about the AI updates.",
      fullDescription: "This newsletter website allows users to subscribe and receive updates about the latest developments in artificial intelligence. Mails are sent automatically using n8n and user data is stored in Supabase.",
      techStack: ["Next.js", "React", "n8n", "Supabase", "CSS"],
      features: [
        "Email subscription system",
        "Automated email delivery via n8n",
        "User data stored in Supabase",
        "Responsive design for all devices",
        "Newsletter scheduling"
      ],
      challenges: [
        "Implementing automated email delivery with n8n",
        "Connecting to Supabase for data storage",
        "Creating an intuitive UI/UX for newsletter"
      ],
      impact: "Keeps users updated on the latest AI technology trends."
    },
    chatup: {
      title: "Advanced ChatUp Application",
      description: "Advanced chat application with AI integration, user authentication, and persistent chat history using MongoDB.",
      fullDescription: "A real-time chat application with modern features including user authentication, AI integration using OpenAI Agent SDK and Tavily, and persistent chat history. Includes group chats, file sharing, and real-time messaging capabilities.",
      techStack: ["React", "Node.js", "MongoDB", "Express.js", "Socket.io", "JavaScript", "OpenAI Agent SDK", "Tavily"],
      features: [
        "Real-time messaging",
        "User authentication system",
        "AI integration using OpenAI Agent SDK and Tavily",
        "Group chat functionality",
        "File sharing features",
        "Persistent chat history"
      ],
      challenges: [
        "Implementing real-time messaging",
        "Creating secure user authentication",
        "Managing persistent chat history",
        "Integrating OpenAI Agent SDK and Tavily"
      ],
      impact: "Provides a modern chat experience with advanced features."
    }
  };

  const openProjectDetails = (projectKey) => {
    setActiveProject(projectKey);
  };

  const closeProjectDetails = () => {
    setActiveProject(null);
  };

  return (
    <>
      <section className="my-project" id="projects" data-aos="fade-up" data-aos-duration="600">
        <h1 className="section-title autoDisplay" data-aos="fade-up" data-aos-duration="600"><span className="gradient">Featured Projects</span></h1>

        <div className="projects-container" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          <div className="project-wrapper">
            <div className="project-slider" id="projectSlider">
              {/* Project 1 */}
              <div className="project-card active" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
                <div className="project-vidbox autoBlur">
                  <video
                    loop
                    id="projectVideo1"
                    data-src="/videos/portfolio.webm"
                    muted
                    playsInline
                    poster="/images/post.png"
                  ></video>
                </div>
                <div className="project-info fadein-left">
                  <h1>Modern <span className="gradient">Portfolio</span> Website</h1>
                  <p>
                    A sleek and responsive portfolio website highlighting projects and
                    developer skills.
                  </p>
                  <div className="project-buttons">
                    <button
                      className="project-btn"
                      data-project="portfolio"
                      onClick={() => window.location.reload()}
                    >
                      <i className="bx bx-link-external"></i> You're Here!
                    </button>
                    <button
                      className="project-btn project-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectDetails('portfolio');
                      }}
                      type="button"
                    >
                      <i className="bx bx-info-circle"></i> See Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="project-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                <div className="project-vidbox autoBlur">
                  <video
                    loop
                    id="projectVideo2"
                    data-src="/videos/newsletter.webm"
                    muted
                    playsInline
                    poster="/images/newletter_img.png"
                  ></video>
                  <div className="hover-sign"></div>
                </div>
                <div className="project-info fadein-left">
                  <h1>AI <span className="gradient">Newsletter</span> Website</h1>
                  <p>
                    An interactive and responsive site to get updated about the
                    ai updates.
                  </p>
                  <div className="project-buttons">
                    <a href="https://news-letter-umber-five.vercel.app/" target="_blank" rel="noopener noreferrer">
                      <button
                        className="project-btn"
                        data-project="newsletter"
                      >
                        <i className="bx bx-link-external"></i> Join Newsletter
                      </button>
                    </a>
                    <button
                      className="project-btn project-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectDetails('newsletter');
                      }}
                      type="button"
                    >
                      <i className="bx bx-info-circle"></i> See Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="project-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
                <div className="project-vidbox autoBlur">
                  <video
                    loop
                    id="projectVideo3"
                    data-src="/videos/Chatup.webm"
                    muted
                    playsInline
                    poster="/images/Chatup_img.png"
                  ></video>
                  <div className="hover-sign"></div>
                </div>
                <div className="project-info fadein-left">
                  <h1>Advanced <span className="gradient">ChatUp</span> Application</h1>
                  <p>
                    Advanced chat application with AI integration, user authentication, and persistent chat history using MongoDB.
                  </p>
                  <div className="project-buttons">
                    <a href="https://chatup-production-ee1a.up.railway.app/" target="_blank" rel="noopener noreferrer">
                      <button
                        className="project-btn"
                        data-project="chatup"
                      >
                        <i className="bx bx-link-external"></i> Live Demo
                      </button>
                    </a>
                    <button
                      className="project-btn project-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectDetails('chatup');
                      }}
                      type="button"
                    >
                      <i className="bx bx-info-circle"></i> See Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button className="nav-btn prev-btn" id="prevProject">
              <i className="bx bx-chevron-left"></i>
            </button>
            <button className="nav-btn next-btn" id="nextProject">
              <i className="bx bx-chevron-right"></i>
            </button>

            {/* Project Indicators */}
            <div className="project-indicators">
              <span className="indicator active" data-index="0"></span>
              <span className="indicator" data-index="1"></span>
              <span className="indicator" data-index="2"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {activeProject && (
        <div className="project-details-modal-overlay" onClick={closeProjectDetails}>
          <div className="project-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="project-details-header">
              <h2 className="project-details-title">{projectDetails[activeProject].title}</h2>
              <button className="project-details-close-btn" onClick={closeProjectDetails}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            <div className="project-details-content">
              <p className="project-full-description">
                {projectDetails[activeProject].fullDescription}
              </p>
              
              <div className="project-details-section">
                <h3>Technologies Used</h3>
                <div className="project-tech-stack">
                  {projectDetails[activeProject].techStack.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
              
              <div className="project-details-section">
                <h3>Key Features</h3>
                <ul className="project-features">
                  {projectDetails[activeProject].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="project-details-section">
                <h3>Challenges & Solutions</h3>
                <ul className="project-challenges">
                  {projectDetails[activeProject].challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
              
              <div className="project-details-section">
                <h3>Impact</h3>
                <p>{projectDetails[activeProject].impact}</p>
              </div>
            </div>
            
            <div className="project-details-footer">
              <button className="project-details-close-btn-secondary" onClick={closeProjectDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}