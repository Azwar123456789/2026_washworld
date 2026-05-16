"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "HJEM", icon: "/home.svg" },
  { href: "/activity", label: "AKTIVITET", icon: "/activity.svg" },
  { href: "/qr", label: "SCAN MIG", icon: "/qr.svg" },
  { href: "/locations", label: "VASKEHAL", icon: "/vaskehal.svg" },
  { href: "/profile", label: "PROFIL", icon: "/profile.svg" },
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
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/activity" &&
            pathname.startsWith("/activity/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-link ${isActive ? "active" : ""}`}
          >
            <span className="bottom-nav-icon">
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
              />
            </span>

            <span className="bottom-nav-label">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}