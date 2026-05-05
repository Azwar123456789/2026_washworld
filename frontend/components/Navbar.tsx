"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
  return null;
}

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/sign-up">Sign up</Link>
      <Link href="/login">Login</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/locations">Find vaskehal</Link>
    </nav>
  );
}