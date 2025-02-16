import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { getJSONData } from "@/lib/server";
import Education from "@/components/Education";
import { Data } from "@/lib/interfaces/data";
import Experience from "@/components/Experience";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HOME - khairil rahman hakiki",
  description:
    "I’m an Information Systems student who loves programming, especially software web development. I specialize in Next.js with Typescript and am currently learning backend development with Golang.",
};

export default async function Home() {
  const data: Data = await getJSONData();
  return (
    <main className="min-h-screen">
      <section
        id="home"
        className="container max-w-5xl mx-auto py-12 md:py-16 lg:py-20 h-[90vh]"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="w-1/2 mx-auto lg:w-1/3">
            <Image
              src={"/assets/profile.webp"}
              width={280}
              height={280}
              loading="lazy"
              alt="image"
              className="mx-auto aspect-square overflow-hidden object-cover object-center rounded-full"
            />
          </div>
          <div className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter ">
                Hey! I&apos;m Khairil
              </h1>
            </div>
            <p className="max-w-[600px] lg:text-lg font-light opacity-70">
              I’m an Information Systems student who loves programming,
              especially software development. I specialize in{" "}
              <span className="font-semibold">Next.js</span> with{" "}
              <span className="font-semibold">Typescript</span> and am currently
              learning backend development with Golang.
            </p>
            <div className="space-x-4 mt-2">
              <Link
                target="_blank"
                href={data.contactInfo.github}
                prefetch={false}
              >
                <Button
                  className="hover:text-custom"
                  variant="secondary"
                  size="sm"
                >
                  <GitHubLogoIcon />
                </Button>
              </Link>

              <Link
                target="_blank"
                href={data.contactInfo.linkedin}
                prefetch={false}
              >
                <Button
                  className="hover:text-custom"
                  variant="secondary"
                  size="sm"
                >
                  <LinkedInLogoIcon />
                </Button>
              </Link>
              <Link
                target="_blank"
                href={`mailto:${data.contactInfo.email}`}
                prefetch={false}
              >
                <Button
                  className="hover:text-custom"
                  variant="secondary"
                  size="sm"
                >
                  <EnvelopeClosedIcon />
                </Button>
              </Link>

              {/* <Link target="_blank" href={data.contactInfo.cv} prefetch={false}>
                <Button
                  className="hover:text-custom"
                  variant="secondary"
                  size="sm"
                >
                  <Link1Icon />
                  <span className="ml-1 font-light">Resume</span>
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
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
