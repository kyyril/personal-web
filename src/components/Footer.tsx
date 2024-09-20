import Link from "next/link";
export default function Footer() {
  return (
    <footer className="py-4 container border-t mt-20">
      <p className="text-sm text-center">
        ©
        <Link
          href="https://github.com/kyyril/"
          className="ml-1 text-violet-700"
        >
          kyyril
        </Link>
      </p>
    </footer>
  );
}
