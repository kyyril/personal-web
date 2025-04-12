"use client";
import { Data } from "@/lib/interfaces/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  Link1Icon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

function Bio({ data }: { data: Data }) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-1/2 mx-auto lg:w-1/3"
      >
        <Image
          src={"/assets/profile.webp"}
          width={280}
          height={280}
          loading="lazy"
          alt="image"
          className="mx-auto aspect-square overflow-hidden object-cover object-center rounded-full"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full px-4 md:px-8 mx-auto"
      >
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-5xl font-semibold tracking-tighter"
          >
            Hey! I&apos;m Khairil
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-[600px] lg:text-lg font-light opacity-70"
        >
          I'm an Information Systems student who loves programming, especially
          software development. I specialize in{" "}
          <span className="font-semibold">Next.js</span> with{" "}
          <span className="font-semibold">Typescript</span> and am currently
          learning backend development with{" "}
          <span className="font-semibold">Golang</span>.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-x-4 mt-2"
        >
          {[
            { href: data.contactInfo.github, icon: <GitHubLogoIcon /> },
            { href: data.contactInfo.linkedin, icon: <LinkedInLogoIcon /> },
            {
              href: `mailto:${data.contactInfo.email}`,
              icon: <EnvelopeClosedIcon />,
            },
            {
              href: data.contactInfo.cv,
              icon: <Link1Icon />,
              text: "Resume",
            },
          ].map((item, index) => (
            <motion.span
              key={item.href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link target="_blank" href={item.href} prefetch={false}>
                <Button
                  className="hover:text-custom"
                  variant="secondary"
                  size="sm"
                >
                  {item.icon}
                  {item.text && (
                    <span className="ml-1 font-light">{item.text}</span>
                  )}
                </Button>
              </Link>
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Bio;
