import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web Developer Intern</h4>
                <h5>ORNAZ | New Delhi</h5>
              </div>
              <h3>Dec 2023 – May 2024</h3>
            </div>
            <p>
              Developed the "Book Your Appointment" experience for ornaz.com/try-at-home,
              enabling customers to explore jewellery online and improving customer
              satisfaction and conversion rates. Optimized front-end performance with
              HTML, CSS, JavaScript, and Next.js, delivering Lighthouse scores of
              100/100 and average page loads below 500ms.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Next.js Developer</h4>
                <h5>Personal Projects</h5>
              </div>
              <h3>2023 – Present</h3>
            </div>
            <p>
              Created responsive and high-performance websites using React, Next.js,
              TailwindCSS, and JavaScript. Focus areas include fast rendering,
              cross-browser compatibility, and seamless navigation for better
              customer engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
