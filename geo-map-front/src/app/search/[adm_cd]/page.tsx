import SearchDrawer from "@/components/pages/search/SearchDrawer";
import { geoJSONRegionByAdmCdQueryOptions } from "@/hooks/useGetGeoJSONRegionByAdmCd";
import { SearchFormSort } from "@/hooks/useSearchForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Params = Promise<{ adm_cd: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type SearchDetailPageProps = {
  params: Params;
  searchParams: SearchParams;
};

export default async function SearchDetailPage(props: SearchDetailPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    geoJSONRegionByAdmCdQueryOptions(params.adm_cd)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchDrawer
        adm_cd={params.adm_cd}
        keyword={(searchParams.keyword ?? "") as string}
        sort={(searchParams.sort ?? "sim") as SearchFormSort}
      />
      ;
    </HydrationBoundary>
  );
}
