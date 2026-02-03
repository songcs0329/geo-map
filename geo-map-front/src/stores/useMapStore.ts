"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MapState {
  mapInstance: naver.maps.Map | null;
  setMapInstance: (map: naver.maps.Map | null) => void;
}

const useMapStore = create<MapState>()(
  devtools(
    (set) => ({
      mapInstance: null,
      setMapInstance: (map) => set({ mapInstance: map }),
    }),
    { name: "map-store" }
  )
);

export default useMapStore;