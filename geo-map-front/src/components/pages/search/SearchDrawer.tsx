"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

import SearchFormHeader from "./SearchFormHeader";
import SearchTabs from "./SearchTabs";
import useGetGeoJSONRegionByAdmCd from "@/hooks/useGetGeoJSONRegionByAdmCd";
import { SearchFormSort } from "@/hooks/useSearchForm";

type SearchDrawerProps = {
  adm_cd: string;
  keyword: string;
  sort: SearchFormSort;
};

function SearchDrawer(props: SearchDrawerProps) {
  const { adm_cd, keyword, sort } = props;
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
        {region && <SearchFormHeader address={region.properties.adm_nm} />}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 scrollbar-hide">
          <SearchTabs keyword={keyword} sort={sort} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchDrawer;
