import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import seoulData from "@/data/seoul-dong.json";
import type { GeoJSONFeatureCollection } from "@/types/map";

// GeoJSON에서 adm_cd로 지역 정보 조회
function getRegionData(adm_cd: string) {
  const geoJSON = seoulData as GeoJSONFeatureCollection;
  return geoJSON.features.find(
    (feature) => feature.properties.adm_cd === adm_cd
  );
}

type SearchDrawerContentsProps = {
  adm_cd: string;
};

function SearchDrawerContents(props: SearchDrawerContentsProps) {
  const { adm_cd } = props;

  const region = getRegionData(adm_cd);

  if (!region) return null;

  return (
    <DrawerContent className="h-full w-100 sm:max-w-100">
      <DrawerHeader>
        <DrawerTitle>{region.properties.adm_nm}</DrawerTitle>
        <DrawerDescription>
          {region.properties.adm_nm}의 상세 정보입니다.
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex-1 overflow-auto p-4">{JSON.stringify(region)}</div>
    </DrawerContent>
  );
}

export default SearchDrawerContents;
