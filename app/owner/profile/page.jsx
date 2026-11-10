"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Save, Store, Upload, X } from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import FoodImage from "@/components/FoodImage";
import { Button, FormField, PageHeading, StatusBadge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

const initialValues = {
  name: "",
  location: "",
  description: "",
  status: "Buka",
  hours: "",
  maxSeats: 10,
  dineInOpen: true,
  paymentQr: "",
};

export default function OwnerProfilePage() {
  const { currentUser, owners, canteens, orders, updateCanteen, notify } =
    useStore();
  const owner = owners.find((item) => item.id === currentUser?.id) || owners[0];
  const canteen =
    canteens.find((item) => item.ownerId === owner?.id) || canteens[0];
  const [values, setValues] = useState(initialValues);
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
    (Number(values.maxSeats) || 0) - occupiedSeats,
  );

  useEffect(() => {
    if (canteen)
      setValues({
        ...initialValues,
        name: canteen.name || "",
        location: canteen.location || "",
        description: canteen.description || "",
        status: canteen.status || "Buka",
        hours: canteen.hours || "",
        maxSeats: canteen.maxSeats || 0,
        dineInOpen: canteen.dineInOpen !== false,
        paymentQr: canteen.paymentQr || "",
      });
  }, [canteen]);

  function change(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function uploadQr(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      notify("Gunakan QRIS berformat PNG, JPG, atau WebP.", "error");
      return;
    }
    if (file.size > 500 * 1024) {
      notify("Ukuran gambar QRIS maksimal 500 KB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") change("paymentQr", reader.result);
      else notify("Gambar QRIS tidak dapat dibaca.", "error");
    };
    reader.onerror = () => notify("Gambar QRIS tidak dapat dibaca.", "error");
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    if (!canteen) {
      notify("Data kantin tidak ditemukan.", "error");
      return;
    }
    updateCanteen(canteen.id, values);
  }

  return (
    <ConsoleShell type="owner" title="Profil Kantin">
      <PageHeading
        eyebrow="Informasi usaha"
        title="Profil kantin"
        description="Atur informasi publik, kapasitas tempat duduk, dan QRIS untuk pembayaran online."
      />
      <div className="profile-card">
        <div className="profile-preview">
          <FoodImage src={canteen?.image} alt={canteen?.name} />
          <div>
            <b>{values.name || "Nama kantin"}</b>
            <small>
              <MapPin size={11} style={{ verticalAlign: "-2px" }} />{" "}
              {values.location || "Lokasi kantin"}
            </small>
            <div style={{ marginTop: 8 }}>
              <StatusBadge status={values.status} />
            </div>
          </div>
        </div>
        <section className="form-card">
          <form onSubmit={submit}>
            <h2>
              <Store
                size={17}
                style={{ verticalAlign: "-4px", marginRight: 7 }}
              />
              Informasi publik
            </h2>
            <div className="form-grid">
              <FormField id="profile-name" label="Nama kantin" required>
                <input
                  className="field-input"
                  id="profile-name"
                  required
                  value={values.name}
                  onChange={(event) => change("name", event.target.value)}
                />
              </FormField>
              <FormField id="profile-location" label="Lokasi" required>
                <input
                  className="field-input"
                  id="profile-location"
                  required
                  value={values.location}
                  onChange={(event) => change("location", event.target.value)}
                />
              </FormField>
              <FormField id="profile-hours" label="Jam buka">
                <input
                  className="field-input"
                  id="profile-hours"
                  value={values.hours}
                  onChange={(event) => change("hours", event.target.value)}
                  placeholder="08.00–16.00"
                />
              </FormField>
              <FormField id="profile-status" label="Status kantin">
                <select
                  className="field-select"
                  id="profile-status"
                  value={values.status}
                  onChange={(event) => change("status", event.target.value)}
                >
                  <option>Buka</option>
                  <option>Tutup</option>
                </select>
              </FormField>
              <FormField
                id="profile-seats"
                label="Total kursi / tempat"
                required
                hint={`${occupiedSeats} kursi sedang dipesan · ${availableSeats} kursi tersedia`}
              >
                <input
                  className="field-input"
                  id="profile-seats"
                  type="number"
                  min={Math.max(1, occupiedSeats)}
                  max="300"
                  required
                  value={values.maxSeats}
                  onChange={(event) =>
                    change("maxSeats", Number(event.target.value))
                  }
                />
              </FormField>
              <div className="span-two">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={values.dineInOpen}
                    onChange={(event) =>
                      change("dineInOpen", event.target.checked)
                    }
                  />
                  Terima pesanan makan di tempat
                </label>
                <small className="field-hint">
                  Pemesanan makan di tempat otomatis ditutup saat semua kursi
                  terisi.
                </small>
              </div>
              <div className="span-two">
                <FormField id="profile-description" label="Deskripsi">
                  <textarea
                    className="field-textarea"
                    id="profile-description"
                    value={values.description}
                    onChange={(event) =>
                      change("description", event.target.value)
                    }
                    placeholder="Ceritakan usaha dan menu andalan kantin."
                  />
                </FormField>
              </div>
              <div className="span-two">
                <FormField
                  id="profile-payment-qr"
                  label="QRIS pembayaran online"
                  hint="Unggah gambar QRIS merchant maksimal 500 KB. File disimpan di browser demo ini."
                >
                  <label className="file-upload" htmlFor="profile-payment-qr">
                    <Upload size={15} />
                    <span>Pilih gambar QRIS</span>
                    <input
                      id="profile-payment-qr"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={uploadQr}
                    />
                  </label>
                </FormField>
                {values.paymentQr && (
                  <div className="payment-qr-preview">
                    <img src={values.paymentQr} alt="QRIS kantin" />
                    <Button
                      type="button"
                      size="sm"
                      variant="danger-ghost"
                      onClick={() => change("paymentQr", "")}
                    >
                      <X size={14} />
                      Hapus QRIS
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="pickup-note">
              <MapPin size={15} />
              <span>
                {availableSeats
                  ? `${availableSeats} dari ${values.maxSeats} kursi tersedia.`
                  : "Semua kursi sedang penuh; pemesanan makan di tempat tertutup otomatis."}{" "}
                Pengantaran tetap dapat dipilih saat kantin buka.
              </span>
            </div>
            <div className="form-footer">
              <Link href="/owner" className="button button-secondary button-md">
                Kembali
              </Link>
              <Button type="submit">
                <Save size={15} />
                Simpan profil
              </Button>
            </div>
          </form>
        </section>
      </div>
    </ConsoleShell>
  );
}
