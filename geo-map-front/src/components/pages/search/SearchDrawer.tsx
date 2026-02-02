"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { getRegionPrefix } from "@/lib/geoUtils";
import SearchFormHeader from "./SearchFormHeader";
import useGetGeoJSONRegionByAdmCd from "@/hooks/useGetGeoJSONRegionByAdmCd";

type SearchDrawerProps = {
  adm_cd: string;
};

function SearchDrawer(props: SearchDrawerProps) {
  const { adm_cd } = props;
  const router = useRouter();

  const { region, isLoading } = useGetGeoJSONRegionByAdmCd(adm_cd);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push("/");
    }
  };

  if (isLoading) return null;

  return (
    <Drawer open direction="left" onOpenChange={handleOpenChange}>
      <DrawerContent className="h-full w-100 sm:max-w-100">
        {region && (
          <SearchFormHeader
            regionPrefix={getRegionPrefix(region.properties.adm_nm)}
          />
        )}
        <div className="flex-1 overflow-auto p-4">
          {region ? JSON.stringify(region) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchDrawer;
