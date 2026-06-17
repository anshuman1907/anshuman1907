import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import setSplitText from "../../utils/splitText";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { smoother } from "../../Navbar";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D,
  rebuildTimelines = false
) {
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (rebuildTimelines) {
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });
    setCharTimeline(character, camera);
    setAllTimeline();
    setSplitText();
  }

  ScrollTrigger.refresh();
  if (smoother) ScrollSmoother.refresh(true);
}
