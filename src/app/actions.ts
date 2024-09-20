"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function postData(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const message = formData.get("message") as string;

  const data = await prisma.guestBookEntry.create({
    data: {
      userId: user.id,
      message: message,
    },
  });
  revalidatePath("/guestbook");
}
