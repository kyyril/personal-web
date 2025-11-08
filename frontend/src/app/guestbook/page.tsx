import { FirebaseGuestbook } from "../../components/FirebaseGuestbook";
import { guestbookMetadata } from "./metadata";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata = guestbookMetadata;

export default function GuestBook() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Guestbook" },
  ];

  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="mt-8">
        <FirebaseGuestbook />
      </div>
    </section>
  );
}
