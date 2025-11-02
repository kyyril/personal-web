import ListProject from "@/components/Project/ListProject";
import { getJSONProject } from "@/lib/server";

export default async function ProjectListWrapper() {
  const data = await getJSONProject();
  return <ListProject projects={data.projects} />;
}