import { Form } from "@/components/Form";
import { GuestBookLoadingForm, LoadingMessage } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/db";
import {
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Suspense } from "react";
import { formatDistanceToNow } from "date-fns";
import { unstable_noStore as noStore } from "next/cache";
import { Metadata } from "next";
import Image from "next/image";
import {
  PersonIcon,
  EnvelopeClosedIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

export const metadata: Metadata = {
  title: `GUESTBOOKS - khairil rahman hakiki`,
  description:
    "I’m an Information Systems student who loves programming, especially software web development. I specialize in Next.js with Typescript and am currently learning backend development with Golang.",
};

async function getGuestBookEntry() {
  noStore();
  const data = await prisma.guestBookEntry.findMany({
    select: {
      User: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      message: true,
      id: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 29,
  });

  return data;
}

export default function GuestBook() {
  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <h1 className="text-custom text-3xl font-semibold lg:text-4xl flex items-end justify-end pt-4 pb-2">
        Guest<span className="font-bold text-primary font-mono">Books📑</span>
      </h1>
      <p className="text-lg font-semibold lg:text-lg pt-3">
        <span className="bg-primary-foreground rounded-full">Hey!👋🏻</span>
      </p>
      <p className="text-sm lg:text-sm pt-2">
        Feel free to leave a message in my guestbook! I will be happy to read
        whatever you write. 😁
      </p>
      <Card className="mt-8">
        <CardHeader className="flex flex-col w-full">
          <Suspense fallback={<GuestBookLoadingForm />}>
            <GuestBookForm />
          </Suspense>
          <ul className="pt-5 gap-y-4 flex flex-col">
            <Suspense fallback={<LoadingMessage />}>
              <GuestBookEntries />
            </Suspense>
          </ul>
        </CardHeader>
      </Card>
    </section>
  );
}

async function GuestBookEntries() {
  const data = await getGuestBookEntry();
  if (data.length === 0) {
    return null;
  }
  return data.map((item) => (
    <li key={item.id}>
      <div className="flex items-start flex-col">
        <p className="text-custom rounded-3xl from-accent pl-1 break-words">
          {item.User?.firstName} {item.User?.lastName} :{" "}
          <span className="text-foreground">{item.message}</span>
        </p>
        <p className="text-muted-foreground pl-1 break-words text-xs bg-primary-foreground rounded-full ">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </p>
      </div>
    </li>
  ));
}

async function GuestBookForm() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) {
    return (
      <div className="space-y-4">
        {/* User Information Display */}
        <div className="bg-primary-foreground rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PersonIcon className="w-5 h-5" />
              Welcome back!
            </h3>
            <LogoutLink>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExitIcon className="w-4 h-4" />
                Logout
              </Button>
            </LogoutLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <PersonIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>
                {user.given_name} {user.family_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <EnvelopeClosedIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>

            {user.picture && (
              <div className="flex items-center gap-2">
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-medium">Profile Picture</span>
              </div>
            )}
          </div>
        </div>

        {/* Message Form */}
        <Form />
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-4 flex-col md:flex-row">
      <Input type="text" placeholder="input messege..." />
      <RegisterLink>
        <Button>SignUp</Button>
      </RegisterLink>
    </div>
  );
}
