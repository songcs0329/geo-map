// Allow importing GeoJSON files (as .json)
declare module "@/data/*.json" {
  const value: import("./shared/geojson.types").GeoJSONFeatureCollection;
  export default value;
}

export {};
