import { createContext, useContext, useState } from "react";
import { defaultTokens, type Tokens } from "./tokens";

const STORAGE_KEY = "pearson_demo_tokens";
const VERSION_KEY = "pearson_demo_tokens_version";
const CURRENT_VERSION = "v9";

function loadTokens(): Tokens {
  try {
    if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return defaultTokens;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Tokens;
  } catch {}
  return defaultTokens;
}

function saveTokens(tokens: Tokens) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {}
}

interface TokensContextValue {
  tokens: Tokens;
  setTokens: (tokens: Tokens) => void;
  resetTokens: () => void;
}

const TokensContext = createContext<TokensContextValue>({
  tokens: defaultTokens,
  setTokens: () => {},
  resetTokens: () => {},
});

export function TokensProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokensState] = useState<Tokens>(loadTokens);

  const setTokens = (next: Tokens) => {
    setTokensState(next);
    saveTokens(next);
  };

  const resetTokens = () => {
    setTokensState(defaultTokens);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TokensContext.Provider value={{ tokens, setTokens, resetTokens }}>
      {children}
    </TokensContext.Provider>
  );
}

export function useTokens() {
  return useContext(TokensContext);
}
