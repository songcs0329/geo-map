"use client";

import { useState, useMemo, memo } from "react";
import { Polygon } from "react-kakao-maps-sdk";
import { createDistrictStyles } from "@/lib/kakaoMapUtils";
import type { GeoJSONFeature, AdminLevel } from "@/types/shared/geojson.types";

interface PolygonLayerProps {
  feature: GeoJSONFeature;
  adminLevel: AdminLevel;
  isSelected: boolean;
  onSelect: (feature: GeoJSONFeature) => void;
}

const PolygonLayer = memo(function PolygonLayer({
  feature,
  adminLevel,
  isSelected,
  onSelect,
}: PolygonLayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useMemo(
    () => createDistrictStyles(feature, adminLevel),
    [feature, adminLevel]
  );

  const currentStyle = isSelected
    ? styles.clickStyle
    : isHovered
      ? styles.hoverStyle
      : styles.style;

  const paths = useMemo(() => {
    // GeoJSON [lng, lat] → {lat, lng} 직접 변환 (kakao.maps.LatLng 중간 생성 없음)
    const { type, coordinates } = feature.geometry;
    const rings =
      type === "Polygon"
        ? (coordinates as number[][][])
        : (coordinates as number[][][][]).flat();
    return rings.map((ring) => ring.map(([lng, lat]) => ({ lat, lng })));
  }, [feature]);

  return (
    <Polygon
      path={paths}
      strokeWeight={currentStyle.strokeWeight}
      strokeColor={currentStyle.strokeColor}
      strokeOpacity={currentStyle.strokeOpacity}
      fillColor={currentStyle.fillColor}
      fillOpacity={currentStyle.fillOpacity}
      onMouseover={() => setIsHovered(true)}
      onMouseout={() => setIsHovered(false)}
      onClick={() => onSelect(feature)}
    />
  );
});

export default PolygonLayer;
