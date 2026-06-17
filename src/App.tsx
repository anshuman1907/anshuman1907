import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  const [loadCharacter, setLoadCharacter] = useState(false);

  useEffect(() => {
    const activate = () => setLoadCharacter(true);
    let timer: number | undefined;
    let idleId: number | undefined;

    window.addEventListener("scroll", activate, { once: true });
    window.addEventListener("pointerdown", activate, { once: true });
    window.addEventListener("keydown", activate, { once: true });

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(activate, { timeout: 3500 });
    } else {
      timer = globalThis.setTimeout(activate, 2500);
    }

    return () => {
      if (timer) globalThis.clearTimeout(timer);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener("scroll", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, []);

  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <MainContainer>
          <Suspense fallback={null}>
            {loadCharacter ? <CharacterModel /> : null}
          </Suspense>
        </MainContainer>
      </Suspense>
    </LoadingProvider>
  );
};

export default App;
