import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import * as ReactFastMarquee from "react-fast-marquee";
import type { ElementType, PropsWithChildren } from "react";

type MarqueeComponent = ElementType<PropsWithChildren>;
type MarqueeModule = { default?: unknown };

const isRenderableComponent = (value: unknown): value is MarqueeComponent => {
  return (
    typeof value === "function" ||
    (typeof value === "object" && value !== null && "$$typeof" in value)
  );
};

const ReactFastMarqueeModule = ReactFastMarquee as MarqueeModule;
const directMarquee = ReactFastMarqueeModule.default;
const nestedMarquee =
  typeof directMarquee === "object" && directMarquee !== null
    ? (directMarquee as MarqueeModule).default
    : undefined;
const FallbackMarquee = ({ children }: PropsWithChildren) => (
  <div className="marquee-fallback">{children}</div>
);
const Marquee: MarqueeComponent = isRenderableComponent(directMarquee)
  ? directMarquee
  : isRenderableComponent(nestedMarquee)
    ? nestedMarquee
    : FallbackMarquee;

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const completionStarted = useRef(false);

  useEffect(() => {
    if (percent < 100 || completionStarted.current) return;
    completionStarted.current = true;
    let innerTimeout: number;
    const outerTimeout = window.setTimeout(() => {
      setLoaded(true);
      innerTimeout = window.setTimeout(() => setIsLoaded(true), 220);
    }, 120);
    return () => {
      window.clearTimeout(outerTimeout);
      if (innerTimeout) window.clearTimeout(innerTimeout);
    };
  }, [percent]);

  useEffect(() => {
    let cancelled = false;
    import("./utils/initialFX")
      .then((module) => {
        if (isLoaded && !cancelled) {
          setClicked(true);
          setTimeout(() => {
            try {
              if (module.initialFX) {
                module.initialFX();
              }
            } catch (err) {
              console.error("initialFX threw:", err);
            } finally {
              setIsLoading(false);
            }
          }, 360);
        }
      })
      .catch((err) => {
        console.error("Failed to import initialFX:", err);
        if (isLoaded && !cancelled) {
          setClicked(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 360);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a
          href="https://www.linkedin.com/in/anshuman1907/"
          className="loader-title"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          av
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> Full Stack Developer</span> <span>Software Engineer</span>
            <span> Full Stack Developer</span> <span>Software Engineer</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{Math.min(100, Math.round(percent))}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
