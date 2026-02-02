"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { getFeatureByAdmCd, getRegionPrefix } from "@/lib/geoUtils";
import dongData from "@/data/dong.json";
import type { GeoJSONFeatureCollection } from "@/types/map";
import SearchFormHeader from "./SearchFormHeader";

type SearchDrawerProps = {
  adm_cd: string;
};

function SearchDrawer(props: SearchDrawerProps) {
  const { adm_cd } = props;
  const router = useRouter();

  const region = getFeatureByAdmCd(
    dongData as GeoJSONFeatureCollection,
    adm_cd
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push("/");
    }
  };

  return (
    <Drawer open direction="left" onOpenChange={handleOpenChange}>
      <DrawerContent className="h-full w-100 sm:max-w-100">
        {region && (
          <SearchFormHeader
            regionPrefix={getRegionPrefix(region.properties.adm_nm)}
          />
        )}
        <div className="flex-1 overflow-auto p-4">{JSON.stringify(region)}</div>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchDrawer;
