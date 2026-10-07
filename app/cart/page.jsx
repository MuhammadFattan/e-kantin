"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";
import CartItem from "@/components/CartItem";
import { Button, EmptyState, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function CartPage() {
  const { cart, products, canteens } = useStore();
  const items = cart
    .map((line) => ({
      line,
      product: products.find((product) => product.id === line.productId),
    }))
    .filter((entry) => entry.product);
  const total = items.reduce(
    (sum, { line, product }) => sum + product.price * line.quantity,
    0,
  );
  const canteen = items[0]
    ? canteens.find((item) => item.id === items[0].product.canteenId)
    : null;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="Siap dinikmati"
        title="Keranjang kamu"
        description={
          items.length
            ? "Cek kembali pilihan menu sebelum membuat pesanan."
            : "Produk yang kamu pilih akan muncul di sini."
        }
      />
      {items.length ? (
        <div className="cart-layout">
          <section className="cart-list">
            <div style={{ padding: "13px 0 8px" }}>
              <span className="product-canteen">
                <Store size={14} />
                Dipesan dari{" "}
                <b style={{ color: "var(--navy)" }}>{canteen?.name}</b>
              </span>
            </div>
            {items.map(({ line, product }) => (
              <CartItem
                key={product.id}
                line={line}
                product={product}
                canteen={canteen}
              />
            ))}
          </section>
          <aside className="summary-card">
            <h2>Ringkasan pesanan</h2>
            <div className="summary-row">
              <span>
                {items.reduce((sum, { line }) => sum + line.quantity, 0)} item
              </span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="summary-row">
              <span>Pengambilan</span>
              <span>Di kantin</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <strong>{formatRupiah(total)}</strong>
            </div>
            <div className="pickup-note">
              <Store size={15} />
              <span>
                Pesanan ini untuk diambil langsung di <b>{canteen?.name}</b>.
                Belum ada layanan antar.
              </span>
            </div>
            <Link
              href="/checkout"
              className="button button-primary button-lg"
              style={{ width: "100%", marginTop: 14 }}
            >
              Lanjut ke Checkout <ArrowRight size={16} />
            </Link>
            <Link
              href={`/canteens/${canteen?.id}`}
              className="continue-shopping"
            >
              Tambah menu lain dari kantin ini
            </Link>
          </aside>
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="Keranjangmu masih kosong"
          description="Yuk, cari menu favorit dari kantin kampus."
          action={
            <Link href="/canteens" className="button button-primary button-md">
              Jelajahi kantin
            </Link>
          }
        />
      )}
    </div>
  );
}
