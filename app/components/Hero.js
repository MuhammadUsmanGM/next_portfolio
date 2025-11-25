import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero-info" data-animation="slideInRight" data-duration="800" data-delay="0">
        <div className="hero-info-title" data-animation="slideInRight" data-duration="800" data-delay="200">
          <i className="bx bxl-sketch"></i>
          <span className="text-gradient">&nbsp; Agentic AI Developer</span>
        </div>

        <h1 data-animation="slideInRight" data-duration="1000" data-delay="400">
          Providing <span className="gradient">the best</span> Project&nbsp;
          <span className="gradient">Experience</span>
        </h1>

        <p data-animation="slideInRight" data-duration="800" data-delay="600">
          I'm a agentic AI developer with experience in Website and Agent
          development. Check out my projects and skills.
        </p>

        <div className="hero-buttons" data-animation="slideInUp" data-duration="800" data-delay="800">
          <button className="contact-btn"><i className="bx bx-send"></i> Contact Me</button>
          <a href="/Usman  Agentic AI Developer Resume.pdf" download>
            <button className="cv-btn"><i className="bx bx-download"></i> Download CV</button>
          </a>
          <a href="https://muhammadusmangmresume.my.canva.site/" target="_blank" rel="noopener noreferrer">
            <button className="cv-btn"><i className="bx bx-globe"></i> Visit CV Online</button>
          </a>
        </div>
      </div>

      <div className="skills-video-box" data-animation="slideInLeft" data-duration="1200" data-delay="200">
        <video
          className="skills-video"
          data-src="/videos/hero-video.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        ></video>
      </div>

      <div className="scroll-down" data-animation="fadeIn" data-duration="1000" data-delay="1000"></div>
    </section>
  );
}
