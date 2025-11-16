"use client";

export default function Transition({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-100">
      {children}
    </div>
  );
}
