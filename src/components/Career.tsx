import "./styles/Career.css";

const careerItems = [
  {
    id: "barebrilliant",
    role: "Software Developer",
    company: "BareBrilliant Pvt. Ltd.",
    period: "Jan 2026 - Present",
    highlights: [
      "Developed customer-facing digital experiences for natural and lab-grown jewellery collections.",
      "Built responsive, SEO-friendly interfaces optimized across desktop and mobile platforms.",
      "Designed lead capture workflows and marketing landing pages to support customer acquisition initiatives.",
      "Collaborated closely with business stakeholders to deliver scalable solutions aligned with evolving requirements.",
      "Developed reusable UI components to improve maintainability and accelerate feature delivery.",
      "Improved website usability and performance through frontend optimization initiatives.",
    ],
  },
  {
    id: "ornaz-dev",
    role: "Software Developer",
    company: "Ornaz Jewellery Pvt. Ltd.",
    period: "Jul 2024 - Dec 2025",
    highlights: [
      "Maintained production applications supporting e-commerce and internal business operations using Django, FastAPI, Node.js, PostgreSQL, MongoDB, Redis, and Docker.",
      "Contributed to microservices-based platforms for CRM, inventory management, logistics, appointment booking, and customer engagement.",
      "Developed APIs supporting scheduling, lead capture, appointment management, and operational workflows.",
      "Integrated payment gateways and third-party services to streamline business processes.",
      "Designed, developed, and deployed a production-grade GenAI-powered Multi-Agent platform used internally to automate lead generation and analytics.",
    ],
  },
  {
    id: "ornaz-intern",
    role: "Software Developer Intern",
    company: "Ornaz Jewellery Pvt. Ltd.",
    period: "Jan 2024 - Jun 2024",
    highlights: [
      "Built customer-facing features for a large-scale jewellery e-commerce platform.",
      "Developed reusable UI components and mobile-responsive experiences.",
      "Focused on SEO enhancements, frontend optimization, and Progressive Web App capabilities.",
      "Developed the Diamond Compare Application to simplify product evaluation and purchasing decisions.",
      "Collaborated with senior developers to deliver business-critical features within project timelines.",
    ],
  },
];

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
          {careerItems.map((item) => (
            <div className="career-info-box" key={item.id}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.period}</h3>
              </div>
              <ul>
                {item.highlights.map((highlight, idx) => (
                  <li key={`${item.id}-hl-${idx}`}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
