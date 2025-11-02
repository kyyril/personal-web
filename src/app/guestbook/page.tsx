import { Metadata } from "next";
import { FirebaseGuestbook } from "@/components/FirebaseGuestbook";

export const metadata: Metadata = {
  title: "Guestbook | Khairil's Personal Website",
  description:
    "Leave a message for Khairil and see what others have to say. Your feedback and comments are greatly appreciated!",
  openGraph: {
    title: "Guestbook | Khairil's Personal Website",
    description:
      "Leave a message for Khairil and see what others have to say. Your feedback and comments are greatly appreciated!",
    url: "https://kyyril.vercel.app/guestbook",
  },
  twitter: {
    title: "Guestbook | Khairil's Personal Website",
    description:
      "Leave a message for Khairil and see what others have to say. Your feedback and comments are greatly appreciated!",
  },
};

export default function GuestBook() {
  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <h1 className="text-custom text-3xl font-semibold lg:text-4xl flex items-end justify-end pt-4 pb-2">
        Guest<span className="font-bold text-primary font-mono">Books</span>
      </h1>

      <h1 className="text-red-600 font-bold">Still under development!</h1>

      <div className="mt-8">
        <FirebaseGuestbook />
      </div>
    </section>
  );
}
