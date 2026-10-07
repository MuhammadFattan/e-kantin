"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import { Button, FormField, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

const blank = {
  name: "",
  username: "",
  phone: "",
  canteenName: "",
  location: "",
  description: "",
  status: "Aktif",
};

export default function OwnerForm({ ownerId }) {
  const router = useRouter();
  const { owners, canteens, addOwner, updateOwner, hydrated } = useStore();
  const [values, setValues] = useState(blank);
  const [missing, setMissing] = useState(false);
  const editing = Boolean(ownerId);
  const owner = editing ? owners.find((item) => item.id === ownerId) : null;
  useEffect(() => {
    if (!editing) {
      setValues(blank);
      setMissing(false);
      return;
    }
    const existing = owners.find((item) => item.id === ownerId);
    const canteen =
      existing && canteens.find((item) => item.ownerId === existing.id);
    if (existing) {
      setValues({
        name: existing.name || "",
        username: existing.username || "",
        phone: existing.phone || "",
        canteenName: canteen?.name || "",
        location: canteen?.location || "",
        description: canteen?.description || "",
        status: existing.status || "Aktif",
      });
      setMissing(false);
    } else if (hydrated) setMissing(true);
  }, [canteens, editing, hydrated, ownerId, owners]);
  function change(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  function submit(event) {
    event.preventDefault();
    if (editing && owner) updateOwner(owner.id, values);
    else if (!editing) addOwner(values);
    router.push("/admin/owners");
  }
  return (
    <ConsoleShell
      type="admin"
      title={editing ? "Edit Pemilik" : "Tambah Pemilik"}
    >
      <Link href="/admin/owners" className="back-link">
        <ArrowLeft size={15} />
        Kembali ke daftar pemilik
      </Link>
      <PageHeading
        eyebrow="Data usaha"
        title={editing ? "Edit pemilik kantin" : "Tambah pemilik kantin"}
        description="Informasi ini dipakai untuk menghubungkan akun pemilik dengan usaha kantinnya."
      />
      <section className="form-card">
        {missing ? (
          <div className="empty-state">
            <h3>Data pemilik tidak ditemukan</h3>
            <p>Pemilik ini mungkin sudah dihapus dari data demo.</p>
            <Link
              href="/admin/owners"
              className="button button-secondary button-md"
            >
              Kembali
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2>
              <Building2
                size={17}
                style={{ verticalAlign: "-4px", marginRight: 7 }}
              />
              Informasi pemilik
            </h2>
            <div className="form-grid">
              <FormField id="owner-name" label="Nama pemilik" required>
                <input
                  className="field-input"
                  id="owner-name"
                  required
                  minLength={2}
                  value={values.name}
                  onChange={(event) => change("name", event.target.value)}
                  placeholder="Contoh: Budi Santoso"
                />
              </FormField>
              <FormField id="owner-username" label="Username" required>
                <input
                  className="field-input"
                  id="owner-username"
                  required
                  minLength={3}
                  value={values.username}
                  onChange={(event) =>
                    change(
                      "username",
                      event.target.value.replace(/\s/g, "").toLowerCase(),
                    )
                  }
                  placeholder="Contoh: budiusaha"
                />
              </FormField>
              <FormField id="owner-phone" label="Nomor telepon" required>
                <input
                  className="field-input"
                  id="owner-phone"
                  type="tel"
                  required
                  minLength={8}
                  value={values.phone}
                  onChange={(event) => change("phone", event.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                />
              </FormField>
              <FormField id="owner-status" label="Status akun">
                <select
                  className="field-select"
                  id="owner-status"
                  value={values.status}
                  onChange={(event) => change("status", event.target.value)}
                >
                  <option>Aktif</option>
                  <option>Nonaktif</option>
                </select>
              </FormField>
              <div className="span-two">
                <hr className="form-divider" />
              </div>
              <div className="span-two">
                <h2 style={{ marginBottom: 3 }}>Informasi kantin / UMKM</h2>
                <p className="form-section-hint">
                  Informasi usaha yang dikelola oleh pemilik ini.
                </p>
              </div>
              <FormField id="canteen-name" label="Nama kantin" required>
                <input
                  className="field-input"
                  id="canteen-name"
                  required
                  value={values.canteenName}
                  onChange={(event) =>
                    change("canteenName", event.target.value)
                  }
                  placeholder="Contoh: Kantin Bu Siti"
                />
              </FormField>
              <FormField id="canteen-location" label="Lokasi kantin" required>
                <input
                  className="field-input"
                  id="canteen-location"
                  required
                  value={values.location}
                  onChange={(event) => change("location", event.target.value)}
                  placeholder="Contoh: Gedung Fakultas Syariah"
                />
              </FormField>
              <div className="span-two">
                <FormField id="canteen-description" label="Deskripsi usaha">
                  <textarea
                    className="field-textarea"
                    id="canteen-description"
                    value={values.description}
                    onChange={(event) =>
                      change("description", event.target.value)
                    }
                    placeholder="Ceritakan singkat menu atau ciri usaha ini."
                  />
                </FormField>
              </div>
            </div>
            <div className="form-footer">
              <Link
                href="/admin/owners"
                className="button button-secondary button-md"
              >
                Batal
              </Link>
              <Button type="submit" variant="primary">
                <Save size={15} />
                {editing ? "Simpan perubahan" : "Tambah pemilik"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </ConsoleShell>
  );
}
