import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoother } from "../Navbar";

/** Unpause ScrollSmoother when the loader closes without running initialFX (e.g. failed 3D load). */
export function resumeSmoothScroll() {
  document.body.style.overflowY = "auto";
  const main = document.getElementsByTagName("main")[0];
  if (main) {
    main.classList.add("main-active");
  }
  if (smoother) {
    smoother.paused(false);
  }
  ScrollTrigger.refresh();
}
