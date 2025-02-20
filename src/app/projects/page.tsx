import ListProject from "@/components/Project/ListProject";
import { getJSONProject } from "@/lib/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PROJECTS - khairil rahman hakiki",
  description:
    "I’m an Information Systems student who loves programming, especially software web development. I specialize in Next.js with Typescript and am currently learning backend development with Golang.",
};
export default async function ProjectPage() {
  const data = await getJSONProject();

  return (
    <section className="max-w-6xl min-h-screen w-full px-4 md:px-16 mx-auto">
      <h1 className="mb-6 text-3xl font-bold lg:text-4xl flex items-end pb-4 pt-2">
        Projects
      </h1>
      <ListProject projects={data.projects} />
    </section>
  );
}
