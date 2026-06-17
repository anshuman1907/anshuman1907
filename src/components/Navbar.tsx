import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { FaLinkedinIn } from "react-icons/fa6";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | undefined;

const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/anshuman1907/";
const NAUKRI_PROFILE_URL = "https://www.naukri.com/mnjuser/profile";

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    (window as typeof window & { smoother?: ScrollSmoother }).smoother = smoother;
    smoother.scrollTop(0);
    smoother.paused(true);

    const links = document.querySelectorAll(".header ul a");
    const cleanups: Array<() => void> = [];
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      const onClick = (e: MouseEvent) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const section = element.getAttribute("data-href");
          if (section) {
            const target = document.querySelector(section);
            if (target) {
              smoother?.scrollTo(target, true, "top top");
            }
          }
        }
      };
      element.addEventListener("click", onClick);
      cleanups.push(() => element.removeEventListener("click", onClick));
    });

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        ScrollSmoother.refresh(true);
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    cleanups.push(() => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      smoother?.kill();
      smoother = undefined;
      delete (window as typeof window & { smoother?: ScrollSmoother }).smoother;
    };
  }, []);
  return (
    <>
      <div className="header">
        <a
          href={NAUKRI_PROFILE_URL}
          className="navbar-title"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Naukri profile"
        >
          AV
        </a>
        <a
          href={LINKEDIN_PROFILE_URL}
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
          aria-label="Open LinkedIn profile"
        >
          <FaLinkedinIn aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
