import { getGeoJSONRegionByAdmCd } from "@/lib/apis/geojson";
import { useQuery } from "@tanstack/react-query";

function useGetGeoJSONRegionByAdmCd(adm_cd: string) {
  const {
    data: region,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["region", adm_cd],
    queryFn: () => getGeoJSONRegionByAdmCd(adm_cd),
    enabled: !!adm_cd,
  });

  return {
    region: region ?? null,
    isLoading,
    error,
  };
}

export default useGetGeoJSONRegionByAdmCd;
