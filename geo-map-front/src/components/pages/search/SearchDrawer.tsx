"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRouter, useSearchParams } from "next/navigation";

import SearchFormHeader from "./SearchFormHeader";
import SearchTabs from "./SearchTabs";
import useGetGeoJSONRegionByAdmCd from "@/hooks/useGetGeoJSONRegionByAdmCd";

type SearchDrawerProps = {
  adm_cd: string;
};

function SearchDrawer(props: SearchDrawerProps) {
  const { adm_cd } = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "";
  const sort = (searchParams.get("sort") as "sim" | "date") ?? "sim";

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
        {region && <SearchFormHeader address={region.properties.adm_nm} />}
        <div className="flex-1 overflow-auto p-4">
          <SearchTabs keyword={keyword} sort={sort} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchDrawer;
