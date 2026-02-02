import SearchDrawerContents from "@/components/pages/search/SearchDrawerContents";

type Params = Promise<{ adm_cd: string }>;

type SearchDetailPageProps = {
  params: Params;
};

export default async function SearchDetailPage(props: SearchDetailPageProps) {
  const params = await props.params;

  return <SearchDrawerContents adm_cd={params.adm_cd} />;
}
