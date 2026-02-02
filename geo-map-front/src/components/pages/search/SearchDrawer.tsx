"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { getFeatureByAdmCd } from "@/lib/geoUtils";
import dongData from "@/data/dong.json";
import type { GeoJSONFeatureCollection } from "@/types/map";

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
        <DrawerHeader>
          <DrawerTitle>{region?.properties.adm_nm}</DrawerTitle>
          <DrawerDescription>
            {region?.properties.adm_nm}의 상세 정보입니다.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4">{JSON.stringify(region)}</div>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchDrawer;
