import dynamic from "next/dynamic";
import React from "react";
import { data } from "../lib/data";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "../lib/seo";
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

/**
 * Homepage metadata with proper canonical URL
 * This ensures the homepage is correctly indexed without duplicates
 */
export const metadata: Metadata = {
  title: "Khairil Rahman Hakiki | Software Engineer",
  description: SEO_DESCRIPTION.main,
  keywords: [
    ...PERSONAL_KEYWORDS,
    "Software Engineer",
    "Full Stack Developer",
    "Web Development",
    "React",
    "Node.js",
    "TypeScript",
  ],
  // Key fix for "Alternate page with proper canonical tag"
  alternates: generateAlternates("/"),
  openGraph: generateOpenGraph({
    title: "Khairil Rahman Hakiki | Software Engineer",
    description: SEO_DESCRIPTION.main,
    path: "/",
    type: "website",
  }),
  twitter: generateTwitter({
    title: "Khairil Rahman Hakiki | Software Engineer",
    description: SEO_DESCRIPTION.main,
  }),
};

export default function Home() {
  // FAQ structured data for rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Khairil Rahman Hakiki's background?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Khairil Rahman Hakiki is a Software Engineer specializing in building scalable, maintainable systems. He combines a strong academic foundation in Information Systems with hands-on experience in full-stack development and clean architecture principles.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Khairil work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Khairil specializes in React.js, Node.js, TypeScript, Next.js, and modern web development technologies. He has extensive experience in full-stack development, cloud infrastructure, and building scalable systems.",
        },
      },
      {
        "@type": "Question",
        name: "How can I get in touch with Khairil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can explore his projects and reach out through the guestbook, chat feature, or connect on social media profiles including GitHub and LinkedIn.",
        },
      },
      {
        "@type": "Question",
        name: "What kind of projects does Khairil work on?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Khairil works on various web applications, open-source contributions, and personal experiments. His projects demonstrate expertise in building scalable, maintainable systems with clean architecture principles.",
        },
      },
    ],
  };

  return (
    <>
      {/* FAQ Structured Data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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
