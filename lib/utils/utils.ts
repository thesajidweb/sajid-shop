import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a random ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const loadFromLocalStorage = <T>(key: string): T | undefined => {
  try {
    if (typeof window === "undefined") {
      return undefined; // server side safe
    }
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Could not load from local storage", e);
    return undefined;
  }
};

export const saveToLocalStorage = <T>(key: string, state: T): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (e) {
    console.warn("Could not save to local storage", e);
  }
};
