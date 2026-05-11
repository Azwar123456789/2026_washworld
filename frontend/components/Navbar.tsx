"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "HJEM", icon: "/home.svg" },
  { href: "/activity", label: "AKTIVITET", icon: "/activity.svg" },
  { href: "/access", label: "ADGANG", icon: "/scan.svg" },
  { href: "/locations", label: "VASKEHAL", icon: "/vaskehal.svg" },
  { href: "/profile", label: "PROFIL", icon: "/profile.svg" },
];

export default function Navbar() {
  const pathname = usePathname();

  const showNavbarRoutes = [
    "/dashboard",
    "/activity",
    "/access",
    "/locations",
    "/profile",
  ];

  if (!showNavbarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-link ${isActive ? "active" : ""}`}
          >
            <img
              src={item.icon}
              alt={item.label}
              className="bottom-nav-icon"
            />
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}