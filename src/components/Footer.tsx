import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-4 container mx-auto border-t mt-20 text-center">
      <p className="text-sm">
        ©
        <Link
          href="https://github.com/kyyril/"
          className="ml-1 text-custom underline hover:opacity-50"
        >
          kyyril
        </Link>
      </p>
    </footer>
  );
}
