import { FirebaseGuestbook } from "../../components/FirebaseGuestbook";
import { guestbookMetadata } from "./metadata";

export const metadata = guestbookMetadata;

export default function GuestBook() {
  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <div className="mt-8">
        <FirebaseGuestbook />
      </div>
    </section>
  );
}
