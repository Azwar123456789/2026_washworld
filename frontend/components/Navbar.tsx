import Link from "next/link";

export default function Navbar() {
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