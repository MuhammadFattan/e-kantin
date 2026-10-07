"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Store, Utensils } from "lucide-react";
import CanteenCard from "@/components/CanteenCard";
import CategoryStrip from "@/components/CategoryStrip";
import ProductCard from "@/components/ProductCard";
import { EmptyState, PageHeading, SectionHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { normalizeCategory } from "@/lib/data";

export default function SearchPage() {
  const router = useRouter();
  const { canteens, products } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    const requestedCategory = params.get("category");
    setCategory(requestedCategory ? normalizeCategory(requestedCategory) : "all");
  }, []);
  const normalized = query.trim().toLocaleLowerCase("id-ID");
  const foundCanteens = useMemo(
    () =>
      canteens.filter(
        (item) =>
          !normalized ||
          `${item.name} ${item.location} ${item.description}`
            .toLocaleLowerCase("id-ID")
            .includes(normalized),
      ),
    [canteens, normalized],
  );
  const foundProducts = useMemo(
    () =>
      products.filter((item) => {
        const canteen = canteens.find((place) => place.id === item.canteenId);
        const matchesText =
          !normalized ||
          `${item.name} ${item.description} ${canteen?.name || ""}`
            .toLocaleLowerCase("id-ID")
            .includes(normalized);
        const matchesCategory =
          category === "all" || normalizeCategory(item.category) === category;
        return item.available && matchesText && matchesCategory;
      }),
    [canteens, category, normalized, products],
  );

  function submit(event) {
    event.preventDefault();
    router.push(
      `/search?q=${encodeURIComponent(query)}${category !== "all" ? `&category=${category}` : ""}`,
    );
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow="Temukan menu"
        title="Cari makanan favoritmu"
        description="Cari menu atau kantin di sekitar kampus."
      />
      <form className="search-panel" onSubmit={submit}>
        <Search size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari makanan atau nama kantin..."
          aria-label="Cari menu"
        />
        <button type="submit">Cari</button>
      </form>
      <CategoryStrip
        active={category}
        onSelect={(value) => {
          setCategory(value);
          router.push(
            `/search?q=${encodeURIComponent(query)}&category=${value}`,
          );
        }}
        compact
      />
      <p className="search-meta">
        <SlidersHorizontal
          size={13}
          style={{ verticalAlign: "-2px", marginRight: 5 }}
        />
        {foundProducts.length} menu dan {foundCanteens.length} kantin ditemukan
        {normalized ? ` untuk “${query.trim()}”` : ""}.
      </p>
      {foundCanteens.length > 0 && (
        <section className="search-section">
          <SectionHeading
            title="Kantin"
            description="Usaha kuliner yang cocok dengan pencarianmu."
          />
          <div className="canteen-grid">
            {foundCanteens.map((canteen) => (
              <CanteenCard
                key={canteen.id}
                canteen={canteen}
                productCount={
                  products.filter((product) => product.canteenId === canteen.id)
                    .length
                }
              />
            ))}
          </div>
        </section>
      )}
      <section className="search-section">
        <SectionHeading
          title="Menu"
          description="Pilih produk untuk melihat detail atau menambahkannya ke keranjang."
        />
        {foundProducts.length ? (
          <div className="product-grid">
            {foundProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                canteen={canteens.find((item) => item.id === product.canteenId)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Utensils}
            title="Menu belum ditemukan"
            description="Coba kata kunci lain atau pilih kategori yang berbeda."
          />
        )}
      </section>
    </div>
  );
}
