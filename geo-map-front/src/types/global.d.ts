declare global {
  interface Window {
    naver: typeof naver;
  }
}

// Allow importing GeoJSON files (as .json)
declare module "@/data/*.json" {
  const value: import("./map").GeoJSONFeatureCollection;
  export default value;
}

export {};
