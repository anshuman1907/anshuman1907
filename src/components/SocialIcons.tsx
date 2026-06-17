import { FaGithub } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  const basePath = import.meta.env.BASE_URL || "./";
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cleanups: Array<() => void> = [];
    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      let rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      let frameId = 0;
      let active = false;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        const isSettled =
          Math.abs(mouseX - currentX) < 0.1 && Math.abs(mouseY - currentY) < 0.1;

        if (active || !isSettled) {
          frameId = requestAnimationFrame(updatePosition);
        } else {
          frameId = 0;
        }
      };

      const startAnimation = () => {
        if (!frameId) {
          frameId = requestAnimationFrame(updatePosition);
        }
      };

      const onMouseEnter = () => {
        active = true;
        rect = elem.getBoundingClientRect();
        startAnimation();
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      const onMouseLeave = () => {
        active = false;
        mouseX = rect.width / 2;
        mouseY = rect.height / 2;
        startAnimation();
      };

      elem.addEventListener("mouseenter", onMouseEnter);
      elem.addEventListener("mousemove", onMouseMove);
      elem.addEventListener("mouseleave", onMouseLeave);

      cleanups.push(() => {
        cancelAnimationFrame(frameId);
        elem.removeEventListener("mouseenter", onMouseEnter);
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/anshuman1907"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://leetcode.com/u/anshuman1907/"
            target="_blank"
            rel="noreferrer"
          >
            <SiLeetcode />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href={`${basePath}resume.html`}
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
