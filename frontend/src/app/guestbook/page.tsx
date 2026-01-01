import { Metadata } from "next";
import { guestbookMetadata } from "./metadata";
import Breadcrumb from "../../components/Breadcrumb";
import FirebaseGuestbookClient from "./FirebaseGuestbookClient";

export const metadata: Metadata = guestbookMetadata;

export default function GuestBook() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Guestbook" },
  ];

  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="mt-8">
        <h1 className="text-4xl font-bold mb-8">Guestbook</h1>
        <FirebaseGuestbookClient />
      </div>
    </section>
  );
}
