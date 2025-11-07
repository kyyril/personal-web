import { FirebaseGuestbook } from "../../components/FirebaseGuestbook";
import { guestbookMetadata } from "./metadata";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata = guestbookMetadata;

export default function GuestBook() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Guestbook" }
  ];

  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <h1 className="mb-6 text-3xl font-bold lg:text-4xl flex items-end pb-4 pt-2">
        Guestbook
      </h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Welcome to my guestbook! Feel free to share your thoughts, feedback, or just say hello.
        You can sign in with your Google account to leave a message and connect with other visitors.
      </p>
      <div className="mt-8">
        <FirebaseGuestbook />
      </div>
    </section>
  );
}
