import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, LinkedinIcon, MailIcon } from "lucide-react";
import { getJSONData } from "@/lib/server";

export default async function Home() {
  const data = await getJSONData();
  return (
    <main>
      <section
        id="home"
        className="container max-w-5xl mx-auto py-12 md:py-16 lg:py-20"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="w-1/2 mx-auto lg:w-1/3">
            <Image
              src="/assets/profile.jpeg"
              width={280}
              height={280}
              alt="image"
              className="mx-auto aspect-square overflow-hidden object-cover object-center rounded-full"
            />
          </div>
          <div className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter ">
                Hey 👋, I&apos;m {data.personalInfo.name}
              </h1>
            </div>
            <p className="max-w-[600px] lg:text-lg text-gray-500 dark:text-gray-400">
              {data.personalInfo.bio}
            </p>
            <div className="space-x-4 mt-2">
              <Link
                target="_blank"
                href={data.contactInfo.github}
                prefetch={false}
              >
                <Button variant="secondary" size="icon">
                  <Github />
                </Button>
              </Link>

              <Link
                target="_blank"
                href={data.contactInfo.linkedin}
                prefetch={false}
              >
                <Button variant="secondary" size="sm">
                  <LinkedinIcon />
                </Button>
              </Link>
              <Link
                target="_blank"
                href={`mailto:${data.contactInfo.email}`}
                prefetch={false}
              >
                <Button variant="secondary" size="sm">
                  <MailIcon />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
