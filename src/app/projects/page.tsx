import ListProject from "@/components/Project/ListProject";
import { getJSONProject } from "@/lib/server";

export default async function ProjectPage() {
  const data = await getJSONProject();

  return (
    <section className="max-w-6xl min-h-screen w-full mt-10 px-4 md:px-16 mx-auto">
      <h1 className="mb-6 text-3xl font-bold lg:text-4xl flex items-end pb-4 pt-2">
        Projects
      </h1>
      <ListProject projects={data.projects} />
    </section>
  );
}
