import dynamic from "next/dynamic";
import React from "react";
import { data } from "../lib/data";
import { Data } from "../types";
import { Metadata } from "next";
import EducationSkeleton from "../components/EducationSkeleton";
import ExperienceSkeleton from "../components/ExperienceSkeleton";
import BioSkeleton from "../components/BioSkeleton";

const Bio = dynamic(() => import("../components/Bio"), {
  loading: () => <BioSkeleton />,
});
const Experience = dynamic(() => import("../components/Experience"), {
  loading: () => <ExperienceSkeleton />,
});
const Education = dynamic(() => import("../components/Education"), {
  loading: () => <EducationSkeleton />,
});

export const metadata: Metadata = {
  title: "Khairil Rahman Hakiki | Frontend Developer",
  description:
    "Welcome to the personal website of Khairil Rahman Hakiki, a passionate Frontend Developer specializing in Next.js and TypeScript. Explore my projects, experience, and feel free to get in touch.",
};

export default function Home() {
  return (
    <main className="min-h-screen max-w-6xl w-full mx-auto">
      <section
        id="bio"
        className="container max-w-5xl mx-auto py-12 md:py-16 lg:py-20 h-screen"
      >
        <Bio data={data} />
      </section>

      <section className="max-w-6xl w-full px-4 md:px-16 mx-auto">
        <div id="experience" className="mb-24">
          <h2 className="font-semibold text-3xl md:text-5xl mb-12">
            Experience
          </h2>
          <Experience data={data} />
        </div>

        <div id="education">
          <h2 className="font-semibold text-3xl md:text-5xl mb-12">
            Education
          </h2>
          <Education data={data} />
        </div>
      </section>
    </main>
  );
}
