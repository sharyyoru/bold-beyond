"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";

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
    // Show loader on first page load - quick 800ms
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    // Show loader briefly on route changes (after first load) - quick 300ms
    if (!isFirstLoad) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, isFirstLoad]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <PageLoader />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.2s ease-in-out" }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
