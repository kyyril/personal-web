"use client";
import { Data } from "@/lib/interfaces/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  Link1Icon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

function Bio({ data }: { data: Data }) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
      <div className="w-1/2 mx-auto lg:w-1/3">
        <Image
          src={"/assets/profile.webp"}
          width={280}
          height={280}
          alt="image"
          priority
          className="mx-auto aspect-square overflow-hidden object-cover object-center rounded-full"
        />
      </div>
      <div className="w-full px-4 md:px-8 mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter ">
            Hey! I&apos;m Khairil
          </h1>
        </div>
        <p className="max-w-[600px] lg:text-lg font-light opacity-70">
          I’m an Information Systems student who loves programming, especially
          software development. I specialize in{" "}
          <span className="font-semibold">Next.js</span> with{" "}
          <span className="font-semibold">Typescript</span> and am currently
          learning backend development with{" "}
          <span className="font-semibold">Golang</span>.
        </p>
        <div className="space-x-4 mt-2">
          <Link target="_blank" href={data.contactInfo.github} prefetch={false}>
            <Button className="hover:text-custom" variant="secondary" size="sm">
              <GitHubLogoIcon />
            </Button>
          </Link>

          <Link
            target="_blank"
            href={data.contactInfo.linkedin}
            prefetch={false}
          >
            <Button className="hover:text-custom" variant="secondary" size="sm">
              <LinkedInLogoIcon />
            </Button>
          </Link>
          <Link
            target="_blank"
            href={`mailto:${data.contactInfo.email}`}
            prefetch={false}
          >
            <Button className="hover:text-custom" variant="secondary" size="sm">
              <EnvelopeClosedIcon />
            </Button>
          </Link>

          <Link target="_blank" href={data.contactInfo.cv} prefetch={false}>
            <Button className="hover:text-custom" variant="secondary" size="sm">
              <Link1Icon />
              <span className="ml-1 font-light">Resume</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Bio;
