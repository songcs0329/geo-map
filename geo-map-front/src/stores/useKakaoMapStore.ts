"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface KakaoMapState {
  map: kakao.maps.Map | null;
  level: number;
  bounds: kakao.maps.LatLngBounds | null;

  setMap: (map: kakao.maps.Map | null) => void;
  setLevel: (level: number) => void;
  setBounds: (bounds: kakao.maps.LatLngBounds | null) => void;
}

const useKakaoMapStore = create<KakaoMapState>()(
  devtools(
    (set) => ({
      map: null,
      level: 12,
      bounds: null,

      setMap: (map) => set({ map }),
      setLevel: (level) => set({ level }),
      setBounds: (bounds) => set({ bounds }),
    }),
    { name: "kakao-map-store" }
  )
);

export default useKakaoMapStore;
