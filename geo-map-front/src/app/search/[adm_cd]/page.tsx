import SearchDrawer from "@/components/pages/search/SearchDrawer";

type Params = Promise<{ adm_cd: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type SearchDetailPageProps = {
  params: Params;
  searchParams: SearchParams;
};

export default async function SearchDetailPage(props: SearchDetailPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <SearchDrawer adm_cd={params.adm_cd} />;
}
