"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Search, ShoppingBag, UserRound } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, currentUser } = useStore();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const links = [
    { href: "/", label: "Beranda" },
    { href: "/search", label: "Cari" },
    { href: "/orders", label: "Pesanan" },
  ];
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">
            <img src="/brand/kantin-icon.svg" alt="" />
          </span>
          <span className="brand-copy">
            <strong>Kantin</strong>
            <small>Raden Fatah</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.href}
              className={pathname === link.href ? "nav-active" : ""}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/canteens" className="header-canteens">
            Kantin
          </Link>
          <Link
            href="/cart"
            className="cart-link"
            aria-label={`Keranjang, ${count} produk`}
          >
            <ShoppingBag size={19} />
            <span>Keranjang</span>
            {count > 0 && <b className="cart-count">{count}</b>}
          </Link>
          <Link href="/login" className="profile-link">
            {currentUser ? (
              <span className="avatar-mini">{currentUser.name[0]}</span>
            ) : (
              <UserRound size={18} />
            )}
            <span>
              {currentUser?.role === "owner"
                ? "Pemilik"
                : currentUser?.role === "admin"
                  ? "Admin"
                  : "Profil"}
            </span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mobile-header-actions">
          <Link href="/search" className="icon-button" aria-label="Cari">
            <Search size={19} />
          </Link>
          <Link
            href="/cart"
            className="icon-button cart-mobile"
            aria-label={`Keranjang, ${count} produk`}
          >
            <ShoppingBag size={20} />
            {count > 0 && <b className="cart-count">{count}</b>}
          </Link>
        </div>
      </div>
    </header>
  );
}
