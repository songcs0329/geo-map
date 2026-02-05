"use client";

import { useState, useMemo, memo } from "react";
import { Polygon } from "react-kakao-maps-sdk";
import {
  createDistrictStyles,
  convertCoordinatesToPaths,
} from "@/lib/kakaoGeoUtils";
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
    const converted = convertCoordinatesToPaths(
      feature.geometry.coordinates,
      feature.geometry.type
    );
    return converted.map((ring) =>
      ring.map((coord) => ({ lat: coord.getLat(), lng: coord.getLng() }))
    );
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
