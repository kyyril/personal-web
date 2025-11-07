"use client";
import { Data } from "../lib/interfaces/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

function Bio({ data }: { data: Data }) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
      <div className="w-1/2 mx-auto lg:w-1/3">
        <Dialog>
          <DialogTrigger asChild>
            <Image
              src={"/assets/profile.webp"}
              width={280}
              height={280}
              alt="Profile photo"
              loading="lazy"
              className="mx-auto aspect-square overflow-hidden object-cover object-center rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300"
              aria-label="View profile photo in full size"
            />
          </DialogTrigger>
          <DialogContent className="bg-transparent shadow-none border-none rounded">
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/assets/profile.webp"
                width={400}
                height={400}
                alt="Katou Megumin"
                className="rounded object-cover"
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full px-4 md:px-8 mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter ">
            Hey! I&apos;m Khairil
          </h1>
        </div>
        <p className="max-w-[600px] lg:text-lg font-light opacity-70">
          Information Systems student specializing in software development. I
          leverage <span className="font-semibold">React.js</span> and{" "}
          <span className="font-semibold">Node.js</span> with{" "}
          <span className="font-semibold">Typescript</span> to build robust,
          scalable applications.{" "}
        </p>
        <div className="space-x-4 mt-2">
          <Link target="_blank" href={data.contactInfo.github} prefetch={false}>
            <Button
              className="hover:text-custom"
              variant="secondary"
              size="sm"
              aria-label="Visit GitHub profile"
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
              aria-label="Visit LinkedIn profile"
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
              aria-label="Send email"
            >
              <EnvelopeClosedIcon />
            </Button>
          </Link>

          <Link target="_blank" href={data.contactInfo.cv} prefetch={false}>
            <Button
              variant={"link"}
              className="hover:text-custom"
              size="sm"
              aria-label="Download resume"
            >
              <Paperclip />
              <span className="text-md">Resume</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Bio;
