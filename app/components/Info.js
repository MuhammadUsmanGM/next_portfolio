import Image from 'next/image';

export default function Info() {
  return (
    <section className="info-section">
      <h1 className="section-title autoDisplay" data-aos="fade-up" data-aos-duration="600"><span className="gradient">Get To Know Me</span></h1>
      <div className="info-cards">
        <div className="card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          <h1>Hi there, I'm Muhammad Usman</h1>
          <p>
            With limited experience, I've honed my skills in AI and web development, building intelligent, responsive, and user-focused digital products
          </p>
          <Image
            src="/images/grid1.png"
            alt="Developer at work"
            loading="lazy"
            width={500}
            height={300}
          />
        </div>

        <div className="card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
          <h1>Tech Stack</h1>
          <p>
            I specialize in a variety of languages, frameworks, and tools that
            allow me to build robust and scalable applications.
          </p>
          <Image src="/images/grid2.png" alt="Technology stack" loading="lazy" width={500} height={300}/>
        </div>

        <div className="card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
          <h1>I'm very flexible with time zone communications & locations</h1>
          <p>I'm based in Pakistan and open to remote work worldwide.</p>
          <video
            data-src="/videos/glob.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          ></video>
          <button className="contact-btn"><i className="bx bx-send"></i> Contact Me</button>
        </div>

        <div className="card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
          <h1>My Passion for Coding</h1>
          <p>
            I love solving problems and building things through code.
            Programming isn't just my profession—it's my passion. I enjoy
            exploring new technologies, and enhancing my skills.
          </p>
          <Image src="/images/grid4.png" alt="Coding passion" loading="lazy" width={500} height={300}/>
        </div>
      </div>
    </section>
  );
}
