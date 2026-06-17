import {
  lazy,
  PropsWithChildren,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { setAllTimeline } from "./utils/GsapScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TechStack = lazy(() => import("./TechStack"));

const DeferredTechStack = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={sentinelRef} className="techstack-deferred">
      {shouldRender && (
        <Suspense fallback={null}>
          <TechStack />
        </Suspense>
      )}
    </div>
  );
};

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setAllTimeline();
      ScrollTrigger.refresh();
    });
    return () => {
      window.cancelAnimationFrame(id);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    let resizeTimeout = 0;
    let lastWidth = window.innerWidth;

    const resizeHandler = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const width = window.innerWidth;
        const widthChanged = Math.abs(width - lastWidth) > 8;
        lastWidth = width;

        setIsDesktopView(width > 1024);
        if (widthChanged) {
          setSplitText();
          ScrollTrigger.refresh();
        }
      }, 150);
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler, { passive: true });
    return () => {
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <DeferredTechStack />
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
