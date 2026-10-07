"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ConfirmHost, ToastHost } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function GlobalChrome({ children }) {
  const pathname = usePathname() || "/";
  const isConsole =
    pathname.startsWith("/admin") || pathname.startsWith("/owner");
  const { resetDemo, requestConfirmation } = useStore();
  async function confirmReset() {
    const confirmed = await requestConfirmation({
      title: "Reset data demo?",
      description:
        "Perubahan lokal akan dihapus dan seluruh data kembali ke contoh awal.",
      confirmLabel: "Reset data",
      danger: true,
    });
    if (confirmed) resetDemo();
  }
  return (
    <>
      {!isConsole && <Navbar />}
      <main className={isConsole ? "console-main" : "storefront-main"}>
        {children}
      </main>
      {!isConsole && (
        <footer className="site-footer">
          <div className="footer-inner">
            <span>© 2026 JajanGuys</span>
            <span>UMKM lokal, semangat kampus.</span>
            <button
              type="button"
              className="footer-reset"
              onClick={confirmReset}
            >
              Reset data demo
            </button>
          </div>
        </footer>
      )}
      <ToastHost />
      <ConfirmHost />
    </>
  );
}
