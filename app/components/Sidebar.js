import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div
        className="close-icon"
        role="button"
        aria-label="Close menu"
        tabIndex="0"
      >
        <i className="bx bx-x"></i>
      </div>
      <nav aria-label="Sidebar">
        <ul>
          <li><Link href="#home">Home</Link></li>
          <li><Link href="#about">About</Link></li>
          <li><Link href="#skills">Skills</Link></li>
          <li><Link href="#projects">Projects</Link></li>
          <li><Link href="#tech-stack">Tech Stack</Link></li>
        </ul>
      </nav>

      <div className="social-sidebar">
        <a href="mailto:mu.ai.dev@gmail.com" aria-label="Email">
          <i className="bx bxl-telegram"></i>
        </a>
        <a
          href="https://github.com/MuhammadUsmanGM"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bx bxl-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/muhammad-usman-ai-dev" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="bx bxl-linkedin-square"></i>
        </a>
      </div>
    </div>
  );
}
