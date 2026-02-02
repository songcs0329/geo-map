import { getGeoJSONRegionByAdmCd } from "@/lib/apis/geojson";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const geoJSONRegionByAdmCdQueryOptions = (adm_cd: string) => {
  return queryOptions({
    queryKey: ["region", adm_cd],
    queryFn: () => getGeoJSONRegionByAdmCd(adm_cd),
    enabled: !!adm_cd,
  });
};

function useGetGeoJSONRegionByAdmCd(adm_cd: string) {
  const {
    data: region,
    isLoading,
    error,
  } = useQuery(geoJSONRegionByAdmCdQueryOptions(adm_cd));

  return {
    region: region ?? null,
    isLoading,
    error,
  };
}

export default useGetGeoJSONRegionByAdmCd;
