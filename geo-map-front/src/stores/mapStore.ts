import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GeoJSONFeature } from "@/types/map";

interface MapState {
  // 선택된 region
  selectedRegion: GeoJSONFeature | null;
  // hover 중인 region
  hoveredRegion: GeoJSONFeature | null;
  // hover 위치 (화면 좌표)
  tooltipPosition: { x: number; y: number } | null;

  // Actions
  setSelectedRegion: (region: GeoJSONFeature | null) => void;
  setHoveredRegion: (region: GeoJSONFeature | null) => void;
  setTooltipPosition: (position: { x: number; y: number } | null) => void;
  clearSelection: () => void;
}

export const useMapStore = create<MapState>()(
  devtools(
    (set) => ({
      selectedRegion: null,
      hoveredRegion: null,
      tooltipPosition: null,

      setSelectedRegion: (region) => set({ selectedRegion: region }),
      setHoveredRegion: (region) => set({ hoveredRegion: region }),
      setTooltipPosition: (position) => set({ tooltipPosition: position }),
      clearSelection: () =>
        set({
          selectedRegion: null,
          hoveredRegion: null,
          tooltipPosition: null,
        }),
    }),
    { name: "map-store" }
  )
);
