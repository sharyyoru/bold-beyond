"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const PageLoader = dynamic(() => import("@/components/ui/PageLoader"), {
  ssr: false,
});

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader on first page load
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    // Show loader briefly on route changes (after first load)
    if (!isFirstLoad) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, isFirstLoad]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <PageLoader />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
