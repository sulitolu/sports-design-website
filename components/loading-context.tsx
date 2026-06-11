"use client";

import { createContext, useContext, useState } from "react";

type LoadingContextValue = {
  loaded: boolean;
  setLoaded: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextValue>({
  loaded: false,
  setLoaded: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <LoadingContext.Provider value={{ loaded, setLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
