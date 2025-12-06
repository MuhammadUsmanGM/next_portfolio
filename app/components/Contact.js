"use client";
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [status, setStatus] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
    setMessageType('info'); // Reset message type on input change
    setStatus(''); // Clear status message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    const newErrors = {
      name: !name,
      email: !email,
      message: !message,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setStatus('Please ensure all fields are filled out correctly.');
      setMessageType('error');
      return;
    }

    setIsSending(true);
    setStatus('Sending your message...');
    setMessageType('info');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent! I will get back to you soon.');
        setMessageType('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setStatus(errorData.message || 'Failed to send message. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setStatus('An unexpected error occurred. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="contact-section" id="contact" data-aos="fade-up" data-aos-duration="600">
      <h1 className="section-title" data-aos="fade-up" data-aos-duration="600"><span className="gradient">Let's Talk</span> 😊</h1>

      <div className="contact-intro" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
        <p className="contact-intro-text">
          Whether you're building a new web experience, enhancing your current platform, or exploring AI-powered projects, I'm here to help make it happen.
        </p>
      </div>

      <div className="social-box" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
        <a href="tel:+923256550687">
          <i className="bx bxs-phone"></i> +92 325 6550687
        </a>
        <a href="https://wa.me/923256550687?text=Hi%20Muhammad%20Usman,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer">
          <i className="bx bxl-whatsapp"></i> WhatsApp
        </a>
        <a href="mailto:mu.ai.dev@gmail.com">
          <i className="bx bxl-telegram"></i> Email Me
        </a>
        <a href="https://www.linkedin.com/in/muhammad-usman-ai-dev" target="_blank" rel="noopener noreferrer">
          <i className="bx bxl-linkedin-square"></i> LinkedIn
        </a>
        <a href="https://github.com/MuhammadUsmanGM" target="_blank" rel="noopener noreferrer">
          <i className="bx bxl-github"></i> GitHub
        </a>
      </div>

      <div className="contact-box" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
        <h2 className="contact-form-title">Let's Connect</h2>
        <form id="contactForm" onSubmit={handleSubmit} noValidate>
          <div className="input-container">
            <p className="input-label">Full Name</p>
            <input
              placeholder="Your Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-message">Required</span>}
          </div>

          <div className="input-container">
            <p className="input-label">Email Address</p>
            <input
              placeholder="Your Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">Required</span>}
          </div>

          <div className="input-container">
            <p className="input-label">Your Message</p>
            <textarea
              className="input-message"
              name="message"
              placeholder="Share your thoughts..."
              value={formData.message}
              onChange={handleChange}
              rows="4"
            ></textarea>
            {errors.message && <span className="error-message">Required</span>}
          </div>

          <button type="submit" disabled={isSending}>
            {isSending ? (
              <>
                <i className="bx bx-loader-alt bx-spin"></i> Sending...
              </>
            ) : (
              <>
                Send Message <i className="bx bx-mail-send"></i>
              </>
            )}
          </button>
          <p id="formStatus" className={messageType === 'success' ? 'success-message' : messageType === 'error' ? 'error-status-message' : ''}>{status}</p>
        </form>
      </div>
    </section>
  );
}
