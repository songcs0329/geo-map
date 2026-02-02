import SearchDrawer from "@/components/pages/search/SearchDrawer";

type Params = Promise<{ adm_cd: string }>;

type SearchDetailPageProps = {
  params: Params;
};

export default async function SearchDetailPage(props: SearchDetailPageProps) {
  const params = await props.params;

  return <SearchDrawer adm_cd={params.adm_cd} />;
}
