import { createContext, useContext, useState, type ReactNode } from "react";
import defaultDt from "./designTokens.json";

export type DesignTokens = typeof defaultDt;

interface DesignTokensContextValue {
  dt: DesignTokens;
  /** Set any leaf path, e.g. setToken(["colors","brand","navy"], "#ff0000") */
  setToken: (path: string[], value: string) => void;
  /** Replace the full design-token tree (used by company skins). */
  setAll: (next: DesignTokens) => void;
  reset: () => void;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function setIn(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  if (tail.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: setIn((obj[head] ?? {}) as Record<string, unknown>, tail, value),
  };
}

const DesignTokensContext = createContext<DesignTokensContextValue>({
  dt: deepClone(defaultDt),
  setToken: () => {},
  setAll: () => {},
  reset: () => {},
});

export function DesignTokensProvider({ children }: { children: ReactNode }) {
  const [dt, setDt] = useState<DesignTokens>(() => deepClone(defaultDt));

  const setToken = (path: string[], value: string) => {
    setDt((prev) => setIn(prev as unknown as Record<string, unknown>, path, value) as unknown as DesignTokens);
  };

  const setAll = (next: DesignTokens) => setDt(deepClone(next));

  const reset = () => setDt(deepClone(defaultDt));

  return (
    <DesignTokensContext.Provider value={{ dt, setToken, setAll, reset }}>
      {children}
    </DesignTokensContext.Provider>
  );
}

export function useDesignTokens() {
  return useContext(DesignTokensContext);
}
