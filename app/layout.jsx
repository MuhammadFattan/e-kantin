import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import GlobalChrome from "@/components/GlobalChrome";

export const metadata = {
  title: "Kantin Raden Fatah — Makan Enak di Kampus",
  description:
    "Temukan makanan favoritmu di kantin UMKM UIN Raden Fatah Palembang.",
  icons: { icon: "/brand/kantin-icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <StoreProvider>
          <GlobalChrome>{children}</GlobalChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
