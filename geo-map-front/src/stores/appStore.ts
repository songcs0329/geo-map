import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "app-store" }
  )
);
