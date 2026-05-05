"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Gauge, QrCode, MapPin, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "HJEM", icon: House },
  { href: "/activity", label: "AKTIVITET", icon: Gauge },
  { href: "/access", label: "ADGANG", icon: QrCode },
  { href: "/locations", label: "VASKEHAL", icon: MapPin },
  { href: "/profile", label: "PROFIL", icon: User },
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
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={20} className="bottom-nav-icon" />
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}


 //if (pathname === "/login" || pathname === "/signup") {
  //return null;
//}