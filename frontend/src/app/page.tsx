import dynamic from "next/dynamic";
import React from "react";
import { data } from "../lib/data";
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
  title: "Khairil Rahman Hakiki | Software Engineer",
  description:
    "Welcome to the personal website of Khairil Rahman Hakiki, a passionate Software Engineer specializing in Next.js and TypeScript. Explore my projects, experience, and feel free to get in touch.",
  alternates: {
    canonical: "https://kyyril.vercel.app",
  },
  openGraph: {
    title: "Khairil Rahman Hakiki | Software Engineer",
    description:
      "Welcome to the personal website of Khairil Rahman Hakiki, a passionate Software Engineer specializing in Next.js and TypeScript. Explore my projects, experience, and feel free to get in touch.",
    type: "website",
    url: "https://kyyril.vercel.app",
    images: [
      {
        url: "https://kyyril.vercel.app/assets/profile.webp",
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Software Engineer Portfolio",
      },
    ],
  },
};

export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Khairil Rahman Hakiki's background?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Khairil Rahman Hakiki is an Information Systems student who loves programming, especially software development. He specializes in React.js and Node.js with TypeScript.",
                },
              },
              {
                "@type": "Question",
                name: "What technologies does Khairil work with?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Khairil specializes in React.js, Node.js, TypeScript, Next.js, and web development technologies. He has experience in full-stack development and modern web frameworks.",
                },
              },
              {
                "@type": "Question",
                name: "How can I get in touch with Khairil?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can explore my projects and reach out through the guestbook, chat feature, or connect on my social media profiles mentioned in the website.",
                },
              },
              {
                "@type": "Question",
                name: "What kind of projects does Khairil work on?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Khairil works on various web applications, open-source contributions, and personal experiments. You can view his latest projects in the Projects section of this website.",
                },
              },
            ],
          }),
        }}
      />
      <div className="min-h-screen w-full mx-auto max-w-4xl px-4 py-4 md:py-8">
        <section
          id="bio"
          role="region"
          aria-labelledby="bio-heading"
          className="container mb-24"
        >
          <h1 id="bio-heading" className="sr-only">
            Biography and Introduction
          </h1>
          <Bio />
        </section>

        <section className="container">
          <div
            id="experience"
            role="region"
            aria-labelledby="experience-heading"
            className="mb-12 md:mb-24"
          >
            <h2
              id="experience-heading"
              className="font-semibold text-2xl md:text-3xl text-right mb-2"
            >
              Experience
            </h2>
            <div>
              <Experience data={data} />
            </div>
          </div>

          <div id="education" role="region" aria-labelledby="education-heading">
            <h3
              id="education-heading"
              className="font-semibold text-2xl md:text-3xl text-right mb-2"
            >
              Education
            </h3>
            <div>
              <Education data={data} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
