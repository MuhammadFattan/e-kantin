"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import FoodImage from "@/components/FoodImage";
import { Button, IconButton, PageHeading, StatusBadge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function OwnerProductsPage() {
  const {
    currentUser,
    owners,
    canteens,
    products,
    deleteProduct,
    requestConfirmation,
  } = useStore();
  const owner = owners.find((item) => item.id === currentUser?.id) || owners[0];
  const canteen =
    canteens.find((item) => item.ownerId === owner?.id) || canteens[0];
  const [query, setQuery] = useState("");
  const menu = useMemo(
    () =>
      products.filter(
        (item) =>
          item.canteenId === canteen?.id &&
          `${item.name} ${item.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [canteen?.id, products, query],
  );
  async function remove(product) {
    const yes = await requestConfirmation({
      title: "Hapus produk?",
      description: `${product.name} akan dihapus dari menu demo.`,
      confirmLabel: "Hapus produk",
      danger: true,
    });
    if (yes) deleteProduct(product.id);
  }
  return (
    <ConsoleShell type="owner" title="Produk">
      <PageHeading
        eyebrow={canteen?.name || "Menu kantin"}
        title="Produk"
        description="Tambah menu, atur harga, dan ubah ketersediaan produk."
        action={
          <Link
            href="/owner/products/create"
            className="button button-primary button-md"
          >
            <Plus size={16} />
            Tambah produk
          </Link>
        }
      />
      <section className="console-panel">
        <div className="console-panel-head">
          <div>
            <h2>Daftar menu</h2>
            <p>{menu.length} produk · data demo tersimpan di browser.</p>
          </div>
        </div>
        <div className="console-filter-row">
          <Search size={16} color="#8993a3" />
          <input
            className="field-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk..."
            aria-label="Cari produk"
          />
        </div>
        {menu.length ? (
          <div className="console-product-list">
            {menu.map((product) => (
              <div className="console-product-row" key={product.id}>
                <FoodImage src={product.image} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <small>{product.category}</small>
                </div>
                <div className="console-product-price product-row-price">
                  {formatRupiah(product.price)}
                </div>
                <div className="product-row-status">
                  <StatusBadge
                    status={product.available ? "Tersedia" : "Tidak tersedia"}
                  />
                </div>
                <div className="table-actions">
                  <Link
                    className="table-icon-button"
                    href={`/owner/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                  >
                    <Edit3 size={14} />
                  </Link>
                  <IconButton
                    className="table-icon-button danger"
                    label={`Hapus ${product.name}`}
                    onClick={() => remove(product)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-empty">
            Tidak ada produk yang cocok dengan pencarian.
          </div>
        )}
      </section>
    </ConsoleShell>
  );
}
