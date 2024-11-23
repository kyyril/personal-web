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

export default async function Home() {
  const data = await getJSONData();
  return (
    <main className="min-h-screen">
      <section
        id="home"
        className="container max-w-5xl mx-auto py-12 md:py-16 lg:py-20 h-[90vh]"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="w-1/2 mx-auto lg:w-1/3">
            <Image
              src="/assets/profile.jpeg"
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
                Hey👋, I&apos;m {data.personalInfo.name}
              </h1>
            </div>
            <p className="max-w-[600px] lg:text-lg text-gray-500 font-light dark:text-gray-400">
              {data.personalInfo.bio}
            </p>
            <div className="space-x-4 mt-2">
              <Link
                target="_blank"
                href={data.contactInfo.github}
                prefetch={false}
              >
                <Button
                  className="hover:text-violet-500"
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
                  className="hover:text-violet-500"
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
                  className="hover:text-violet-500"
                  variant="secondary"
                  size="sm"
                >
                  <EnvelopeClosedIcon />
                </Button>
              </Link>

              <Link target="_blank" href={data.contactInfo.cv} prefetch={false}>
                <Button
                  className="hover:text-violet-500"
                  variant="secondary"
                  size="sm"
                >
                  <Link1Icon />
                  <span className="ml-1 font-light">Resume</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="education"
        className="max-w-7xl w-full mt-10 px-4 md:px-16 mx-auto"
      >
        <h2 className="font-semibold text-3xl md:text-5xl mb-12">Education</h2>
        <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
          {data.education.map((ed) => (
            <div key={ed.id} className="grid gap-1 relative">
              <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2 dark:bg-gray-50" />

              <h4 className="text-xl font-semibold">{ed.degree}</h4>
              <h5>{ed.institution}</h5>
              <div className="text-gray-500 dark:text-gray-400">
                {ed.startDate} - {ed.endDate}
              </div>
              <p className="mt-2 text-sm text-gray-500">{ed.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
