'use client';

import { createContext, useContext, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';


export declare type ThemeValue = 'dark' | 'light';

export interface ThemeContextValue<T extends string> {
  theme: T;
  setTheme: Dispatch<SetStateAction<ThemeValue>>
}

interface ThemeProviderProps<T> {
  defaultTheme?: T;
}

export const ThemeContext = createContext<ThemeContextValue<ThemeValue>>({
  theme: 'light',
  setTheme: () => {}
});

export const ThemeProvider = ({ children, defaultTheme }: PropsWithChildren<ThemeProviderProps<ThemeValue>>) => {
  const [theme, setTheme] = useState<ThemeValue>(defaultTheme || 'light');

  return (
    <ThemeContext.Provider
      value={{ theme , setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
