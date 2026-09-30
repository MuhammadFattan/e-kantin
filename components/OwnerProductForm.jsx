"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import { Button, FormField, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES } from "@/lib/data";

const menuImages = [
  [
    "Pempek Palembang",
    "/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-3.webp",
  ],
  [
    "Nasi Goreng",
    "/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-4.webp",
  ],
  [
    "Ayam Geprek",
    "/manus-storage/async-images/petRyJmbOytV1UZDVF4HRc/image-1.webp",
  ],
  [
    "Mie Goreng",
    "/manus-storage/async-images/petRyJmbOytV1UZDVF4HRc/image-2.webp",
  ],
  ["Tekwan", "/manus-storage/async-images/petRyJmbOytV1UZDVF4HRc/image-3.webp"],
  ["Es Teh", "/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-5.webp"],
  [
    "Es Jeruk",
    "/manus-storage/async-images/petRyJmbOytV1UZDVF4HRc/image-4.webp",
  ],
  [
    "Kopi Susu",
    "/manus-storage/async-images/petRyJmbOytV1UZDVF4HRc/image-5.webp",
  ],
];

export default function OwnerProductForm({ productId }) {
  const router = useRouter();
  const {
    currentUser,
    canteens,
    products,
    addProduct,
    updateProduct,
    hydrated,
  } = useStore();
  const canteen = canteens.find((item) => item.ownerId === currentUser?.id);
  const editing = Boolean(productId);
  const product = editing
    ? products.find(
        (item) => item.id === productId && item.canteenId === canteen?.id,
      )
    : null;
  const [missing, setMissing] = useState(false);
  const [values, setValues] = useState({
    name: "",
    category: "makanan",
    description: "",
    price: "",
    image: menuImages[0][1],
    available: true,
  });
  useEffect(() => {
    if (!editing) {
      setMissing(false);
      return;
    }
    const existing = products.find(
      (item) => item.id === productId && item.canteenId === canteen?.id,
    );
    if (existing) {
      setValues({
        name: existing.name || "",
        category: existing.category || "makanan",
        description: existing.description || "",
        price: String(existing.price || ""),
        image: existing.image || menuImages[0][1],
        available: existing.available !== false,
      });
      setMissing(false);
    } else if (hydrated) setMissing(true);
  }, [canteen?.id, editing, hydrated, productId, products]);
  function change(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  function submit(event) {
    event.preventDefault();
    const payload = {
      ...values,
      price: Number(values.price),
      canteenId: product?.canteenId || canteen?.id,
      rating: product?.rating || 4.7,
    };
    if (editing && product) updateProduct(product.id, payload);
    else if (!editing) addProduct(payload);
    router.push("/owner/products");
  }
  return (
    <ConsoleShell
      type="owner"
      title={editing ? "Edit Produk" : "Tambah Produk"}
    >
      <Link href="/owner/products" className="back-link">
        <ArrowLeft size={15} />
        Kembali ke produk
      </Link>
      <PageHeading
        eyebrow={canteen?.name || "Menu kantin"}
        title={editing ? "Edit produk" : "Tambah produk"}
        description="Isi informasi menu agar mahasiswa dapat menemukan dan memesan produk ini."
      />
      <section className="form-card">
        {missing ? (
          <div className="empty-state">
            <h3>Produk tidak ditemukan</h3>
            <p>Produk ini mungkin sudah dihapus dari data demo.</p>
            <Link
              href="/owner/products"
              className="button button-secondary button-md"
            >
              Kembali ke daftar produk
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2>
              <ImagePlus
                size={17}
                style={{ verticalAlign: "-4px", marginRight: 7 }}
              />
              Informasi produk
            </h2>
            <div className="form-grid">
              <FormField id="product-name" label="Nama produk" required>
                <input
                  className="field-input"
                  id="product-name"
                  required
                  minLength={2}
                  maxLength={70}
                  value={values.name}
                  onChange={(event) => change("name", event.target.value)}
                  placeholder="Contoh: Pempek Kapal Selam"
                />
              </FormField>
              <FormField id="product-category" label="Kategori" required>
                <select
                  className="field-select"
                  id="product-category"
                  required
                  value={values.category}
                  onChange={(event) => change("category", event.target.value)}
                >
                  {CATEGORIES.filter((item) => item.id !== "all").map(
                    (item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ),
                  )}
                </select>
              </FormField>
              <div className="span-two">
                <FormField id="product-description" label="Deskripsi" required>
                  <textarea
                    className="field-textarea"
                    id="product-description"
                    required
                    minLength={5}
                    maxLength={220}
                    value={values.description}
                    onChange={(event) =>
                      change("description", event.target.value)
                    }
                    placeholder="Jelaskan bahan atau keunikan produk."
                  />
                </FormField>
              </div>
              <FormField id="product-price" label="Harga (Rupiah)" required>
                <input
                  className="field-input"
                  id="product-price"
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={values.price}
                  onChange={(event) => change("price", event.target.value)}
                  placeholder="Contoh: 15000"
                />
              </FormField>
              <FormField
                id="product-image"
                label="Foto produk"
                hint="Pilih foto demo yang paling sesuai atau masukkan alamat gambar langsung."
              >
                <select
                  className="field-select"
                  id="product-image"
                  value={values.image}
                  onChange={(event) => change("image", event.target.value)}
                >
                  {menuImages.map(([label, src]) => (
                    <option key={src} value={src}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="span-two">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={values.available}
                    onChange={(event) =>
                      change("available", event.target.checked)
                    }
                  />
                  Produk tersedia dan dapat dipesan
                </label>
              </div>
            </div>
            <div className="form-footer">
              <Link
                href="/owner/products"
                className="button button-secondary button-md"
              >
                Batal
              </Link>
              <Button type="submit" variant="primary">
                <Save size={15} />
                {editing ? "Simpan perubahan" : "Tambah produk"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </ConsoleShell>
  );
}
