"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GeoJSONFeature } from "@/types/shared/geojson.types";

interface KakaoMapState {
  map: kakao.maps.Map | null;
  level: number;
  bounds: kakao.maps.LatLngBounds | null;
  selectedFeature: GeoJSONFeature | null;

  setMap: (map: kakao.maps.Map | null) => void;
  setLevel: (level: number) => void;
  setBounds: (bounds: kakao.maps.LatLngBounds | null) => void;
  setSelectedFeature: (feature: GeoJSONFeature | null) => void;
  toggleSelectedFeature: (feature: GeoJSONFeature) => void;
}

const useKakaoMapStore = create<KakaoMapState>()(
  devtools(
    (set) => ({
      map: null,
      level: 12,
      bounds: null,
      selectedFeature: null,

      setMap: (map) => set({ map }),
      setLevel: (level) => set({ level }),
      setBounds: (bounds) => set({ bounds }),
      setSelectedFeature: (feature) => set({ selectedFeature: feature }),
      toggleSelectedFeature: (feature) =>
        set((state) => {
          if (!state.selectedFeature) return { selectedFeature: feature };
          return { selectedFeature: state.selectedFeature.properties.code === feature.properties.code ? null : feature };
        }),
    }),
    { name: "kakao-map-store" }
  )
);

export default useKakaoMapStore;
