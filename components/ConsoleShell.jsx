"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  Users,
  ClipboardList,
  UserRound,
  Menu,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Verifikasi", icon: BadgeCheck },
  { href: "/admin/owners", label: "Pemilik Kantin", icon: Users },
  { href: "/admin/canteens", label: "Kantin / UMKM", icon: Store },
];
const ownerNav = [
  { href: "/owner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owner/products", label: "Produk", icon: Package },
  { href: "/owner/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/owner/profile", label: "Profil Kantin", icon: Store },
];

export default function ConsoleShell({ type = "owner", title, children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { currentUser, owners, canteens, hydrated, signOut } = useStore();
  const [open, setOpen] = useState(false);
  const isAdmin = type === "admin";
  const navItems = isAdmin ? adminNav : ownerNav;
  const roleLabel = isAdmin ? "Administrator" : "Pemilik Kantin";
  const activeUser = isAdmin
    ? {
        name: currentUser?.role === "admin" ? currentUser.name : "Admin Kantin",
      }
    : currentUser;
  const activeOwner = owners.find((owner) => owner.id === currentUser?.id);
  const canAccess = isAdmin
    ? currentUser?.role === "admin"
    : currentUser?.role === "owner" &&
      activeOwner?.status === "Aktif" &&
      canteens.some((canteen) => canteen.ownerId === activeOwner.id);

  function leaveDemo() {
    signOut();
    router.push("/login");
  }

  if (!hydrated)
    return (
      <main className="console-access-page" role="status" aria-live="polite">
        <div className="console-access-card">
          <span className="access-icon">
            <Store size={22} />
          </span>
          <h1>Memuat demo…</h1>
          <p>Memeriksa sesi dan data demo.</p>
        </div>
      </main>
    );
  if (!canAccess)
    return (
      <main className="console-access-page">
        <div className="console-access-card">
          <span className="access-icon">
            <Store size={22} />
          </span>
          <span className="eyebrow">Mode demonstrasi</span>
          <h1>Akses {roleLabel}</h1>
          <p>
            Pilih peran {isAdmin ? "Admin" : "Pemilik Kantin"} yang sesuai untuk
            membuka workspace ini. Akun pemilik nonaktif tidak dapat masuk.
          </p>
          <Link href="/login" className="button button-primary button-md">
            Pilih peran demo
          </Link>
          <Link href="/" className="access-back-link">
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );

  return (
    <div className={`console-layout ${open ? "sidebar-open" : ""}`}>
      <aside className="console-sidebar">
        <Link href="/" className="console-brand">
          <span className="brand-mark">
            <img src="/brand/kantin-icon.svg" alt="" />
          </span>
          <span>
            <strong>Kantin</strong>
          </span>
        </Link>
        <div className="console-role-label">
          WORKSPACE<span>{roleLabel}</span>
        </div>
        <nav className="console-nav" aria-label={`Menu ${roleLabel}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/owner" || item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "console-nav-active" : ""}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight size={15} className="console-nav-chevron" />
                )}
              </Link>
            );
          })}
        </nav>
        {!isAdmin && (
          <Link href="/admin" className="console-nav external-link">
            <Users size={18} />
            <span>Demo Admin</span>
          </Link>
        )}
        <div className="sidebar-bottom">
          <div className="demo-note">
            <span className="demo-note-icon">
              <UserRound size={16} />
            </span>
            <span>
              <b>Mode demonstrasi</b>
              <small>Data tersimpan di browser</small>
            </span>
          </div>
          <button type="button" className="logout-link" onClick={leaveDemo}>
            <LogOut size={17} />
            Keluar
          </button>
          <Link href="/" className="back-store-link">
            <ArrowLeft size={15} />
            Kembali ke storefront
          </Link>
        </div>
      </aside>
      <div className="console-content">
        <header className="console-topbar">
          <button
            className="console-menu-button"
            aria-label="Buka navigasi"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu size={21} />
          </button>
          <div className="console-breadcrumb">
            <span>{isAdmin ? "Admin" : "Pemilik Kantin"}</span>
            <ChevronRight size={14} />
            {title}
          </div>
          <Link href="/login" className="console-profile">
            <span className="avatar-mini">{activeUser?.name?.[0] || "U"}</span>
            <span>
              {activeUser?.name ||
                (isAdmin ? "Admin Kantin" : "Pilih akun demo")}
            </span>
          </Link>
        </header>
        <div className="console-page">{children}</div>
      </div>
      {open && (
        <button
          className="sidebar-scrim"
          aria-label="Tutup navigasi"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
