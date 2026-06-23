import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const basePath = import.meta.env.BASE_URL || "./";

const projects = [
  {
    title: "Ornaz E-Commerce Platform",
    category: "Production E-commerce",
    tools: "Django, FastAPI, Node.js, PostgreSQL, MongoDB",
    image: `${basePath}images/callhq.png`,
    link: "#",
  },
  {
    title: "Lead Assistant — GenAI Multi-Agent Platform",
    category: "Enterprise GenAI Platform",
    tools: "LangChain, LangGraph, Azure OpenAI, Python, Docker",
    image: `${basePath}images/preview1.png`,
    link: "#",
  },
  {
    title: "Diamond Compare Application",
    category: "Product Tooling",
    tools: "React, Performance Optimizations",
    image: `${basePath}images/diamond_compare.png`,
    link: "#",
  },

  {
    title: "Real-Time AR Jewellery Try-On",
    category: "AR / Computer Vision",
    tools: "MediaPipe, WebGL, Three.js",
    image: `${basePath}images/realtime_tryon.png`,
    link: "#",
  },
  {
    title: "Try-at-Home Appointment Platform",
    category: "Appointment Booking",
    tools: "Next.js, REST APIs, Scheduling",
    image: `${basePath}images/try_at_home_same_as_whatsapp.png`,
    link: "https://ornaz.com/try-at-home",
  },
  {
    title: "CRM & Operations Dashboard",
    category: "Internal Tools",
    tools: "React, Redux, REST APIs, Redis",
    image: `${basePath}images/Crm and Dasboard.png`,
    link: "#",
  },

  {
    title: "BareBrilliant Platform & Lead Funnels",
    category: "Marketing & Lead Gen",
    tools: "Next.js, Landing Pages, Analytics",
    image: `${basePath}images/bare_brilliant.png`,
    link: "#",
  },
  {
    title: "Travel Explorer",
    category: "Next.js Travel Website",
    tools: "Next.js, Responsive UI, Destination Filtering",
    image: `${basePath}images/whatsapp.png`,
    link: "#",
  },
  {
    title: "Portfolio Website",
    category: "Personal Developer Showcase",
    tools: "React, Next.js, TailwindCSS",
    image: `${basePath}images/broki.png`,
    link: "#",
  },
  {
    title: "Performance Optimization",
    category: "Fast Front-End Workflows",
    tools: "Lighthouse, Load Time Optimizations, Cross-Browser Support",
    image: `${basePath}images/lighthouse.png`,
    link: "#",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          <span>Projects</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  {(() => {
                    const distance = Math.abs(index - currentIndex);
                    const shouldLoadImage =
                      distance <= 1 || distance === projects.length - 1;

                    return (
                      <div className="carousel-content">
                        <div className="carousel-info">
                          <div className="carousel-number">
                            <h3>0{index + 1}</h3>
                          </div>
                          <div className="carousel-details">
                            <h4>{project.title}</h4>
                            <p className="carousel-category">
                              {project.category}
                            </p>
                            <div className="carousel-tools">
                              <span className="tools-label">
                                Tools & Features
                              </span>
                              <p>{project.tools}</p>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-image-wrapper">
                          <WorkImage
                            image={project.image}
                            alt={project.title}
                            link={project.link}
                            shouldLoad={shouldLoadImage}
                            priority={index === currentIndex}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
