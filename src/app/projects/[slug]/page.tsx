import { getJSONData } from "@/lib/server";
import Image from "next/image";

export default async function Detailproject({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getJSONData();
  if (!data || !data.projects) {
    return <p>Project not found</p>;
  }

  const project = data.projects.find((project) => project.id === params.slug);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <section className="h-[90vh] max-w-7xl w-full mt-10 px-4 md:px-16 mx-auto">
      <div className="w-full lg:w-1/2 flex justify-center items-center relative group">
        <Image
          src={project.cover}
          alt={project.title}
          height={100}
          loading="lazy"
          width={500}
          className="rounded-md w-full"
        />
      </div>
      <h1>{project.title}</h1>

      <p>{project.details.description}</p>
      <p>
        <strong>Date:</strong> {project.details.date}
      </p>

      <div>
        <h2>Features:</h2>
        <ul>
          {project.details.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Images:</h2>
        <div className="flex space-x-4">
          {/* {project.details.image.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              height={100}
              width={100}
              loading="lazy"
              className="rounded-md"
            />
          ))} */}
        </div>
      </div>
    </section>
  );
}
