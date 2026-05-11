"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "HJEM", icon: "⌂" },
  { href: "/activity", label: "AKTIVITET", icon: "◉" },
  { href: "/qr", label: "ADGANG", icon: "▣" },
  { href: "/locations", label: "VASKEHAL", icon: "⌖" },
  { href: "/profile", label: "PROFIL", icon: "♙" },
];

export default function Navbar() {
  const pathname = usePathname();

  const showNavbarRoutes = [
    "/dashboard",
    "/activity",
    "/qr",
    "/locations",
    "/profile",
  ];

  const shouldShowNavbar = showNavbarRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/activity" && pathname.startsWith("/activity/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-link ${isActive ? "active" : ""}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
