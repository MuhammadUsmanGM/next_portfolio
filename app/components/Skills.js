import Image from 'next/image';

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <h1 className="section-title autoDisplay" data-aos="fade-up" data-aos-duration="600"><span className="gradient">Technical Skills</span></h1>
      <div className="skills-container">
        <div className="skills-box autoDisplay" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          <div className="image-wrapper">
            <Image
              className="skills-image-bg"
              src="/images/digital brain (2).png"
              alt="Digital brain illustration"
              fill={true}
              style={{ objectFit: 'cover' }}
              priority={false}
            />
          </div>
          <div className="skill-content">
            <div className="Designer" data-aos="fade-right" data-aos-duration="700" data-aos-delay="200">
              <h1 className="gradient">Developer <i className="bx bx-laptop"></i></h1>
              <p>
                I have expertise in HTML, CSS, and JavaScript, along with modern frameworks
                like React and Node.js. My strength lies in writing clean, efficient code and
                optimizing performance to deliver smooth, responsive user experiences.
              </p>
            </div>

            <div className="coder" data-aos="fade-left" data-aos-duration="700" data-aos-delay="300">
              <h1 className="gradient">Coder <i className="bx bx-code-block"></i></h1>
              <p>
                I've been exploring AI integration with tools like OpenAI and LangChain.
                I focus on building scalable, intelligent web applications using modern
                development practices and full-stack technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}