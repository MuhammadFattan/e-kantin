"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ClipboardCheck,
  MapPin,
  PackageCheck,
  Store,
} from "lucide-react";
import { Button, EmptyState, FormField, PageHeading } from "@/components/ui";
import FoodImage from "@/components/FoodImage";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, products, canteens, currentUser, placeOrder } =
    useStore();
  const [values, setValues] = useState({
    name: currentUser?.role === "student" ? currentUser.name : "",
    phone: currentUser?.role === "student" ? currentUser.phone : "",
    note: "",
    fulfillmentMethod: "pickup",
    partySize: "1",
    deliveryAddress: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const items = cart
    .map((line) => ({
      line,
      product: products.find((product) => product.id === line.productId),
    }))
    .filter((entry) => entry.product);
  const total = items.reduce(
    (sum, { line, product }) => sum + line.quantity * product.price,
    0,
  );
  const canteen = items[0]
    ? canteens.find((item) => item.id === items[0].product.canteenId)
    : null;
  /*
  const occupiedSeats = orders
    .filter(
      (order) =>
        order.canteenId === canteen?.id &&
        order.fulfillmentMethod === "dine-in" &&
        !["Selesai", "Dibatalkan"].includes(order.status),
    )
    .reduce((sum, order) => sum + (Number(order.partySize) || 1), 0);
  const availableSeats = Math.max(
    0,
    (Number(canteen?.maxSeats) || 0) - occupiedSeats,
  );
  */

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  function submit(event) {
    event.preventDefault();
    if (currentUser?.role && currentUser.role !== "student")
      return (
        <div className="page-container">
          <PageHeading
            eyebrow="Checkout dibatasi"
            title="Pemesanan untuk pembeli"
            description="Akun pemilik dan admin tidak dapat membuat pesanan."
          />
          <EmptyState
            icon={Store}
            title="Gunakan akun mahasiswa / staf"
            description="Ganti ke akun pembeli untuk melanjutkan pesanan."
            action={
              <Link href="/login" className="button button-primary button-md">
                Ganti akun
              </Link>
            }
          />
        </div>
      );
    setSubmitting(true);
    const order = placeOrder(values);
    if (!order) {
      setSubmitting(false);
      return;
    }
    router.push(`/orders/${order.id}?success=1`);
  }

  if (!items.length)
    return (
      <div className="page-container">
        <PageHeading
          eyebrow="Langkah terakhir"
          title="Checkout"
          description="Periksa ringkasan dan informasi pesanan."
        />
        <EmptyState
          icon={ClipboardCheck}
          title="Belum ada pesanan untuk checkout"
          description="Tambahkan produk ke keranjang terlebih dahulu."
          action={
            <Link href="/canteens" className="button button-primary button-md">
              Jelajahi kantin
            </Link>
          }
        />
      </div>
    );

  return (
    <div className="page-container">
      <Link href="/cart" className="back-link">
        <ArrowLeft size={15} />
        Kembali ke keranjang
      </Link>
      <PageHeading
        eyebrow="Langkah terakhir"
        title="Checkout pesanan"
        description="Tentukan cara menerima pesanan dari kantin."
      />
      <div className="checkout-layout">
        <form onSubmit={submit} className="checkout-card">
          <h2>Informasi pemesan</h2>
          <div className="checkout-form">
            <FormField id="customer-name" label="Nama pemesan" required>
              <input
                className="field-input"
                id="customer-name"
                required
                minLength={2}
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Nama lengkap"
              />
            </FormField>
            <FormField id="phone" label="Nomor telepon" required>
              <input
                className="field-input"
                id="phone"
                type="tel"
                required
                minLength={8}
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="08xx-xxxx-xxxx"
              />
            </FormField>
            <div className="span-two">
              <FormField
                id="note"
                label="Catatan pesanan"
                hint="Contoh: tidak pedas, sambalnya dipisah."
              >
                <textarea
                  className="field-textarea"
                  id="note"
                  maxLength={240}
                  value={values.note}
                  onChange={(event) => update("note", event.target.value)}
                  placeholder="Ada permintaan khusus? (opsional)"
                />
              </FormField>
            </div>
          </div>
          <h2 style={{ marginTop: 24 }}>Cara menerima pesanan</h2>
          <div className="fulfillment-options">
            <label
              className={`fulfillment-option ${values.fulfillmentMethod === "pickup" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="pickup"
                checked={values.fulfillmentMethod === "pickup"}
                onChange={(event) =>
                  update("fulfillmentMethod", event.target.value)
                }
              />
              <PackageCheck size={18} />
              <span>
                <b>Ambil di kantin</b>
                <small>Ambil pesanan langsung setelah siap</small>
              </span>
            </label>
            {/*
            <label
              className={`fulfillment-option ${values.fulfillmentMethod === "dine-in" ? "selected" : ""} ${!canteen?.dineInOpen || !availableSeats ? "disabled" : ""}`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="dine-in"
                checked={values.fulfillmentMethod === "dine-in"}
                disabled={!canteen?.dineInOpen || !availableSeats}
                onChange={(event) =>
                  update("fulfillmentMethod", event.target.value)
                }
              />
              <Utensils size={18} />
              <span>
                <b>Makan di tempat</b>
                <small>
                  {canteen?.dineInOpen && availableSeats
                    ? `${availableSeats} kursi tersedia`
                    : "Tempat duduk penuh atau ditutup"}
                </small>
              </span>
            </label>
            <label
              className={`fulfillment-option ${values.fulfillmentMethod === "delivery" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="delivery"
                checked={values.fulfillmentMethod === "delivery"}
                onChange={(event) =>
                  update("fulfillmentMethod", event.target.value)
                }
              />
              <Truck size={18} />
              <span>
                <b>Diantar</b>
                <small>Pesanan dikirim ke alamat kamu</small>
              </span>
            </label>
            */}
          </div>
          {values.fulfillmentMethod === "pickup" ? (
            <div className="pickup-note">
              <Store size={15} />
              <span>
                Pesanan diambil langsung di {canteen?.name} setelah statusnya
                siap.
              </span>
            </div>
          ) : null}
          {/*
          {values.fulfillmentMethod === "dine-in" ? (
            <div className="checkout-form fulfillment-fields">
              <FormField id="party-size" label="Jumlah orang / kursi" required>
                <div className="number-input-with-icon">
                  <Users size={16} />
                  <input
                    className="field-input"
                    id="party-size"
                    type="number"
                    required
                    min="1"
                    max={Math.min(12, availableSeats || 1)}
                    value={values.partySize}
                    onChange={(event) =>
                      update("partySize", event.target.value)
                    }
                  />
                </div>
              </FormField>
              <p className="field-hint">
                Pesanan ini memesan kursi sampai statusnya selesai atau
                dibatalkan.
              </p>
            </div>
          ) : (
            <div className="fulfillment-fields">
              <FormField
                id="delivery-address"
                label="Alamat pengantaran"
                required
              >
                <textarea
                  className="field-textarea"
                  id="delivery-address"
                  required
                  minLength={8}
                  value={values.deliveryAddress}
                  onChange={(event) =>
                    update("deliveryAddress", event.target.value)
                  }
                  placeholder="Gedung, fakultas, nomor ruang, atau titik temu"
                />
              </FormField>
              <div className="pickup-note">
                <Truck size={15} />
                <span>
                  Pengantaran dikelola oleh kantin. Ongkos antar dikonfirmasi
                  langsung dengan pemilik.
                </span>
              </div>
            </div>
          )}
          */}
          <div className="pickup-selected">
            <span>
              <Store size={17} />
            </span>
            <span>
              <b>{canteen?.name}</b>
              <small>
                <MapPin size={12} />
                {canteen?.location}
              </small>
            </span>
            <Check
              size={17}
              style={{ marginLeft: "auto", color: "var(--green)" }}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            variant="accent"
            disabled={submitting}
            style={{ width: "100%", marginTop: 20 }}
          >
            {submitting ? (
              "Membuat pesanan…"
            ) : (
              <>
                Buat Pesanan{" "}
                <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
              </>
            )}
          </Button>
        </form>
        <aside className="summary-card">
          <h2>Ringkasan pesanan</h2>
          <div className="product-info-box" style={{ margin: "0 0 14px" }}>
            <FoodImage src={canteen?.image} alt={canteen?.name} />
            <span>
              <b>{canteen?.name}</b>
              <small>
                <MapPin size={12} />
                {canteen?.location}
              </small>
            </span>
          </div>
          {items.map(({ line, product }) => (
            <div key={product.id} className="checkout-summary-item">
              <span>
                {line.quantity} × {product.name}
              </span>
              <b>{formatRupiah(product.price * line.quantity)}</b>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatRupiah(total)}</strong>
          </div>
          <p className="summary-helper">
            Pembayaran dilakukan sesuai ketentuan kantin saat mengambil pesanan.
          </p>
        </aside>
      </div>
    </div>
  );
}
