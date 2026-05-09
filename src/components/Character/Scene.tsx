import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { resumeSmoothScroll } from "../utils/resumeSmoothScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading, setIsLoading } = useLoading();

  const basePath = import.meta.env.BASE_URL || "./";
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasDiv.current) {
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let scene = sceneRef.current;
    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let animationFrameId: number;
    let resizeListener: (() => void) | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch (error) {
      console.error("WebGL initialization failed:", error);
      setWebglError("WebGL not available in this browser or environment.");
      resumeSmoothScroll();
      setIsLoading(false);
      return;
    }

    if (!renderer) {
      setWebglError("WebGL renderer could not be created.");
      resumeSmoothScroll();
      setIsLoading(false);
      return;
    }

    const rect = canvasDiv.current.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;

    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    if (!renderer.getContext()) {
      console.error("WebGL context is unavailable on renderer.domElement");
      setWebglError("Unable to create a WebGL context.");
      resumeSmoothScroll();
      setIsLoading(false);
      return;
    }

    camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          const character = gltf.scene;
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });

          resizeListener = () => handleResize(renderer!, camera!, canvasDiv, character);
          window.addEventListener("resize", resizeListener);
        }
      })
      .catch((error) => {
        console.error("Character loading failed:", error);
        setWebglError("Character loading failed.");
        resumeSmoothScroll();
        setIsLoading(false);
      });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounce: number | undefined;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = window.setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer!.render(scene, camera!);
    };

    animate();

    return () => {
      if (debounce) {
        clearTimeout(debounce);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      scene.clear();
      if (renderer) {
        renderer.dispose();
      }
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
      }
      if (canvasDiv.current && renderer?.domElement) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
      if (landingDiv) {
        document.removeEventListener("mousemove", onMouseMove);
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          {webglError ? (
            <div className="character-fallback">
              <img
                src={`${basePath}images/preview1.png`}
                alt="Homepage preview"
                className="fallback-image"
              />
              <div className="fallback-message">
                <p>WebGL is not available in this browser or environment.</p>
                <p>Please try a different browser or disable sandboxed mode.</p>
              </div>
            </div>
          ) : null}
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
