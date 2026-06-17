import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setCharTimeline } from "../utils/GsapScroll";

const disposeMaterial = (material: THREE.Material) => {
  const materialRecord = material as THREE.Material & {
    userData: { flickerTimeline?: { kill: () => void } };
  } & Record<string, unknown>;

  materialRecord.userData.flickerTimeline?.kill();
  Object.values(materialRecord).forEach((value) => {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
  material.dispose();
};

const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(disposeMaterial);
    } else if (mesh.material) {
      disposeMaterial(mesh.material);
    }
  });
};

type ScreenLight = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());

  const basePath = import.meta.env.BASE_URL || "./";
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const canvasElement = canvasDiv.current;
    if (!canvasElement) {
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    const scene = sceneRef.current;
    let headBone: THREE.Object3D | null = null;
    let screenLight: ScreenLight | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let animationFrameId: number;
    let resizeListener: (() => void) | null = null;
    let resizeTimeout = 0;
    let introTimeout = 0;
    let hoverCleanup: (() => void) | undefined;
    let currentCharacter: THREE.Object3D | null = null;
    let lastWidth = window.innerWidth;
    let lastDesktopMode = window.innerWidth > 1024;
    let isCanvasVisible = true;
    let isDocumentVisible = !document.hidden;
    let intersectionObserver: IntersectionObserver | null = null;
    let disposed = false;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio <= 1.5,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("WebGL initialization failed:", error);
      setWebglError("WebGL not available in this browser or environment.");
      return;
    }

    if (!renderer) {
      setWebglError("WebGL renderer could not be created.");
      return;
    }

    const rect = canvasElement.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;

    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasElement.appendChild(renderer.domElement);

    if (!renderer.getContext()) {
      console.error("WebGL context is unavailable on renderer.domElement");
      setWebglError("Unable to create a WebGL context.");
      return;
    }

    camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isCanvasVisible = entry.isIntersecting;
        },
        { rootMargin: "300px 0px" }
      );
      intersectionObserver.observe(canvasElement);
    }

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    loadCharacter()
      .then((gltf) => {
        if (disposed) {
          if (gltf?.scene) {
            disposeObject(gltf.scene);
          }
          return;
        }
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverCleanup = hoverDivRef.current
            ? animations.hover(gltf, hoverDivRef.current)
            : undefined;
          mixer = animations.mixer;
          const character = gltf.scene;
          currentCharacter = character;
          scene.add(character);
          setCharTimeline(character, camera!);
          headBone = character.getObjectByName("spine006") || null;
          const screenLightObject = character.getObjectByName("screenlight");
          screenLight =
            screenLightObject instanceof THREE.Mesh &&
            screenLightObject.material instanceof THREE.MeshStandardMaterial
              ? (screenLightObject as ScreenLight)
              : null;
          introTimeout = window.setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 900);

          resizeListener = () => {
            window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
              const nextWidth = window.innerWidth;
              const nextDesktopMode = nextWidth > 1024;
              const rebuildTimelines =
                nextDesktopMode !== lastDesktopMode ||
                Math.abs(nextWidth - lastWidth) > 120;

              lastWidth = nextWidth;
              lastDesktopMode = nextDesktopMode;
              handleResize(
                renderer!,
                camera!,
                canvasDiv,
                character,
                rebuildTimelines
              );
            }, 150);
          };
          window.addEventListener("resize", resizeListener, { passive: true });
        }
      })
      .catch((error) => {
        console.error("Character loading failed:", error);
        setWebglError("Character loading failed.");
      });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounce: number | undefined;
    let isTouchTracking = false;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = window.setTimeout(() => {
        isTouchTracking = Boolean(element);
      }, 200);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isTouchTracking) return;
      handleTouchMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchEnd = () => {
      isTouchTracking = false;
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDocumentVisible || !isCanvasVisible) {
        clock.getDelta();
        return;
      }
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
      disposed = true;
      if (debounce) {
        clearTimeout(debounce);
      }
      window.clearTimeout(resizeTimeout);
      window.clearTimeout(introTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      hoverCleanup?.();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      intersectionObserver?.disconnect();
      mixer?.stopAllAction();
      if (currentCharacter) {
        disposeObject(currentCharacter);
      }
      scene.clear();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
      }
      if (renderer?.domElement.parentNode === canvasElement) {
        canvasElement.removeChild(renderer.domElement);
      }
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchmove", onTouchMove);
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
