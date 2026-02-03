"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import useGetGeoJSONRegionByAdmCd from "@/hooks/map/useGetGeoJSONRegionByAdmCd";
import { SearchFormSort } from "@/hooks/search/useSearchForm";
import SearchFormHeader from "./SearchFormHeader";
import SearchTabs from "./SearchTabs";

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

  if (isLoading || !region) return null;

  return (
    <Drawer open direction="left" onOpenChange={handleOpenChange}>
      <DrawerContent className="h-full w-100 sm:max-w-100">
        <SearchFormHeader address={region.properties.adm_nm} />
        <div className="scrollbar-hide flex-1 overflow-auto bg-gray-50 p-4">
          <SearchTabs
            keyword={keyword}
            sort={sort}
            address={region.properties.adm_nm}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchDrawer;
