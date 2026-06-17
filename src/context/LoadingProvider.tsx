import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

const clampPercent = (percent: number) =>
  Math.min(100, Math.max(0, Math.round(percent)));

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoadingPercent] = useState(0);

  const setLoading = useCallback((percent: number) => {
    setLoadingPercent((current) => Math.max(current, clampPercent(percent)));
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      setLoading,
    }),
    [isLoading, setLoading]
  );

  useEffect(() => {
    if (!isLoading) return;

    const start = performance.now();
    const duration = 650;
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setLoading(easedProgress * 100);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isLoading, setLoading]);

  // Fail-safe: if loading doesn't finish, force-hide the overlay quickly.
  useEffect(() => {
    let timeout: number | undefined;
    if (isLoading) {
      timeout = window.setTimeout(() => {
        console.warn("LoadingProvider: forcing hide of loading overlay after timeout");
        setIsLoading(false);
      }, 4000);
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
