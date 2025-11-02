import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pb-24 container mx-auto mt-20 text-center">
      <div className="flex justify-center gap-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          Home
        </Link>
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary">
          Projects
        </Link>
        <Link href="/guestbook" className="text-sm text-muted-foreground hover:text-primary">
          Guestbook
        </Link>
        <Link href="/chat" className="text-sm text-muted-foreground hover:text-primary">
          Chat
        </Link>
      </div>
    </footer>
  );
}
