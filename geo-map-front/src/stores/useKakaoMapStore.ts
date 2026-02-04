"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAdminLevelByKakaoLevel } from "@/lib/kakaoGeoUtils";
import type { AdminLevel } from "@/types/shared/geojson.types";

interface KakaoMapState {
  map: kakao.maps.Map | null;
  level: number;
  bounds: kakao.maps.LatLngBounds | null;
  selectedFeatureId: string | null;

  setMap: (map: kakao.maps.Map | null) => void;
  setLevel: (level: number) => void;
  setBounds: (bounds: kakao.maps.LatLngBounds | null) => void;
  setSelectedFeatureId: (id: string | null) => void;
  toggleSelectedFeatureId: (id: string) => void;

  getAdminLevel: () => AdminLevel;
}

const useKakaoMapStore = create<KakaoMapState>()(
  devtools(
    (set, get) => ({
      map: null,
      level: 12,
      bounds: null,
      selectedFeatureId: null,

      setMap: (map) => set({ map }),
      setLevel: (level) => set({ level }),
      setBounds: (bounds) => set({ bounds }),
      setSelectedFeatureId: (id) => set({ selectedFeatureId: id }),
      toggleSelectedFeatureId: (id) =>
        set((state) => ({
          selectedFeatureId: state.selectedFeatureId === id ? null : id,
        })),

      getAdminLevel: () => getAdminLevelByKakaoLevel(get().level),
    }),
    { name: "kakao-map-store" }
  )
);

export default useKakaoMapStore;
