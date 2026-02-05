"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { KakaoPlace } from "@/types/kakao-places.types";

interface PlaceSearchState {
  places: KakaoPlace[];
  selectedPlace: KakaoPlace | null;
  isSearching: boolean;

  setPlaces: (places: KakaoPlace[]) => void;
  setSelectedPlace: (place: KakaoPlace | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  clearPlaces: () => void;
}

const usePlaceSearchStore = create<PlaceSearchState>()(
  devtools(
    (set) => ({
      places: [],
      selectedPlace: null,
      isSearching: false,

      setPlaces: (places) => set({ places }),
      setSelectedPlace: (place) => set({ selectedPlace: place }),
      setIsSearching: (isSearching) => set({ isSearching }),
      clearPlaces: () => set({ places: [], selectedPlace: null }),
    }),
    { name: "place-search-store" }
  )
);

export default usePlaceSearchStore;
