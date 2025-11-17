import React from "react";
import { GithubIcon, LinkedinIcon, DocumentIcon } from "./Icons";
import { HERO_DATA } from "../constants";
import Image from "next/image";
import { contactInfo } from "@/lib/data";

const SOCIAL_LINKS = [
  { name: "GitHub", url: contactInfo.github, icon: <GithubIcon /> },
  { name: "LinkedIn", url: contactInfo.linkedin, icon: <LinkedinIcon /> },
  { name: "Resume", url: contactInfo.cv, icon: <DocumentIcon /> },
];

const Bio: React.FC = () => {
  return (
    <section>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Khairil Rahman
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Software Engineer
          </p>
        </div>
        <Image
           src={"/assets/profile.webp"}
           width={100}
           height={100}
           alt="Profile photo"
           loading="lazy"
           className="aspect-square h-20 w-20 overflow-hidden object-cover object-center rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300 flex-shrink-0"
           aria-label="View profile photo in full size"
         />
      </div>
      <div className="flex items-center gap-x-6 mb-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
          >
            {link.icon}
            <span className="hidden md:inline text-sm font-medium">{link.name}</span>
          </a>
        ))}
      </div>

      <div>
        <p className="max-w-[600px] lg:text-lg text-gray-500 dark:text-gray-400 font-light">
          Information Systems student specializing in software development. I
          leverage <span className="font-semibold">React.js</span> and{" "}
          <span className="font-semibold">Node.js</span> with{" "}
          <span className="font-semibold">Typescript</span> to build robust,
          scalable applications.{" "}
        </p>
      </div>
    </section>
  );
};

export default Bio;
