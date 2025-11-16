export default function About() {
  return (
    <section
      className="about-section"
      id="about-section"
      data-aos="fade-up"
      data-aos-duration="1200"
    >
      <h1 className="section-title autoDisplay "><span className="gradient">About Me</span></h1>
      <div className="about-content">
        <p className="about-tagline">
          Agentic AI & Web Developer crafting intelligent, autonomous, and user-centered digital experiences.
        </p>
        <ul className="about-highlights">
          <li>
            <i className="bx bx-rocket"></i> Performance-first: Core Web Vitals,
            code-splitting, and image optimization to keep experiences fast.
          </li>
          <li>
            <i className="bx bx-accessibility"></i>  AI-Driven Solutions: building agentic systems that automate workflows, reason over data, and integrate seamlessly with APIs.
          </li>
          <li>
            <i className="bx bx-layer"></i> Modular Architectures: reusable components, prompt-chaining, and system thinking to scale complex AI workflows.
          </li>
          <li>
            <i className="bx bx-code-block"></i> Tech Stack: React, Next.js, Node.js, TypeScript, Python, OpenAI APIs, vector databases, and cloud platforms.
          </li>
        </ul>
      </div>
    </section>
  );
}
