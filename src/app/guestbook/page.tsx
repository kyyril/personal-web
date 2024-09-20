import { Form } from "@/components/Form";
import { GuestBookLoadingForm, LoadingMessage } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/db";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Suspense } from "react";
import { formatDistanceToNow } from "date-fns";

async function getGuestBookEntry() {
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
    <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
      <h1 className="text-4xl font-semibold lg:text-5xl pt-5">GuestBook</h1>
      <Card className="mt-10">
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
        <p className="text-muted-foreground bg-primary-foreground rounded-3xl bg-opacity-25 pl-3 break-words">
          {item.User?.firstName} {item.User?.lastName} :{" "}
          <span className="text-foreground">{item.message}</span>
        </p>
        <p className="text-muted-foreground pl-3 break-words text-xs">
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
      <div>
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
