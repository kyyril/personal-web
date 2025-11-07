import { FirebaseGuestbook } from "../../components/FirebaseGuestbook";
import { guestbookMetadata } from "./metadata";

export const metadata = guestbookMetadata;

export default function GuestBook() {
  return (
    <section className="max-w-6xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <h1 className="text-custom text-3xl font-semibold lg:text-4xl text-center lg:text-left pt-4 pb-2">
        Guest<span className="font-bold text-primary ">Books</span>
      </h1>

      <div className="mt-8">
        <FirebaseGuestbook />
      </div>
    </section>
  );
}
