import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
  Link1Icon,
} from "@radix-ui/react-icons";
import { getJSONData } from "@/lib/server";
import Education from "@/components/Education";
import { Data } from "@/lib/interfaces/data";
import Experience from "@/components/Experience";
import { Metadata } from "next";
import Bio from "@/components/Bio";

export const metadata: Metadata = {
  title: "HOME - khairil rahman hakiki",
  description:
    "I’m an Information Systems student who loves programming, especially software web development. I specialize in Next.js with Typescript and am currently learning backend development with Golang.",
};

export default async function Home() {
  const data: Data = await getJSONData();
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
