"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  ShieldAlert,
  Store,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button, FormField } from "@/components/ui";

const initial = {
  role: "student",
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  ktpNumber: "",
  canteenName: "",
  location: "",
  description: "",
  products: "",
  maxSeats: "10",
};

export default function SignupPage() {
  const router = useRouter();
  const { registerStudent, registerOwner, notify } = useStore();
  const [values, setValues] = useState(initial);
  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (values.password !== values.confirmPassword) {
      notify("Konfirmasi kata sandi belum cocok.", "error");
      return;
    }
    if (values.role === "student") {
      if (registerStudent(values)) router.push("/");
      return;
    }
    if (registerOwner(values)) router.push("/login");
  }

  return (
    <div className="login-page">
      <div className="login-back">
        <Link href="/login" className="back-link">
          <ArrowLeft size={15} />
          Kembali ke masuk
        </Link>
      </div>
      <div className="login-card signup-card">
        <div className="login-brand">
          <span className="brand-mark">
            <img src="/brand/kantin-icon.svg" alt="" />
          </span>
          <span>
            <b>Kantin Raden Fatah</b>
            <small>Buat akun baru</small>
          </span>
        </div>
        <span className="eyebrow">Pendaftaran akun</span>
        <h1>Daftar</h1>
        <p className="login-lede">
          Pilih jenis akun. Pendaftaran admin hanya dapat dilakukan oleh
          pengelola sistem.
        </p>
        <div
          className="signup-role-switch"
          role="group"
          aria-label="Jenis akun"
        >
          <button
            type="button"
            className={values.role === "student" ? "selected" : ""}
            onClick={() => update("role", "student")}
          >
            <GraduationCap size={17} />
            Mahasiswa / Staf
          </button>
          <button
            type="button"
            className={values.role === "owner" ? "selected" : ""}
            onClick={() => update("role", "owner")}
          >
            <Store size={17} />
            Pemilik kantin
          </button>
        </div>
        <form onSubmit={submit} className="signup-form">
          <h2>
            <Building2 size={17} />
            Data diri
          </h2>
          <div className="form-grid">
            <FormField id="signup-name" label="Nama lengkap" required>
              <input
                className="field-input"
                id="signup-name"
                required
                minLength={2}
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </FormField>
            <FormField id="signup-phone" label="Nomor telepon" required>
              <input
                className="field-input"
                id="signup-phone"
                type="tel"
                required
                minLength={8}
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </FormField>
            <FormField id="signup-username" label="Username" required>
              <input
                className="field-input"
                id="signup-username"
                required
                minLength={3}
                autoComplete="username"
                value={values.username}
                onChange={(event) =>
                  update(
                    "username",
                    event.target.value.replace(/\s/g, "").toLowerCase(),
                  )
                }
              />
            </FormField>
            <FormField id="signup-password" label="Kata sandi" required>
              <input
                className="field-input"
                id="signup-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={values.password}
                onChange={(event) => update("password", event.target.value)}
              />
            </FormField>
            <FormField
              id="signup-confirm-password"
              label="Ulangi kata sandi"
              required
            >
              <input
                className="field-input"
                id="signup-confirm-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(event) =>
                  update("confirmPassword", event.target.value)
                }
              />
            </FormField>
          </div>
          {values.role === "owner" && (
            <>
              <div className="signup-section-divider">
                <h2>
                  <ShieldAlert size={17} />
                  Verifikasi pemilik
                </h2>
                <p>Pengajuan diperiksa admin sebelum akun kantin aktif.</p>
              </div>
              <div className="form-grid">
                <FormField id="signup-ktp-number" label="Nomor KTP" required>
                  <input
                    className="field-input"
                    id="signup-ktp-number"
                    required
                    minLength={8}
                    value={values.ktpNumber}
                    onChange={(event) =>
                      update("ktpNumber", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  id="signup-canteen-name"
                  label="Nama kantin / usaha"
                  required
                >
                  <input
                    className="field-input"
                    id="signup-canteen-name"
                    required
                    value={values.canteenName}
                    onChange={(event) =>
                      update("canteenName", event.target.value)
                    }
                  />
                </FormField>
                <FormField id="signup-location" label="Lokasi kantin" required>
                  <input
                    className="field-input"
                    id="signup-location"
                    required
                    value={values.location}
                    onChange={(event) => update("location", event.target.value)}
                    placeholder="Gedung, fakultas, atau area"
                  />
                </FormField>
                <FormField
                  id="signup-max-seats"
                  label="Kapasitas kursi"
                  required
                >
                  <input
                    className="field-input"
                    id="signup-max-seats"
                    type="number"
                    required
                    min="1"
                    max="300"
                    value={values.maxSeats}
                    onChange={(event) => update("maxSeats", event.target.value)}
                  />
                </FormField>
                <div className="span-two">
                  <FormField id="signup-description" label="Deskripsi usaha">
                    <textarea
                      className="field-textarea"
                      id="signup-description"
                      value={values.description}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                    />
                  </FormField>
                </div>
                <div className="span-two">
                  <FormField
                    id="signup-products"
                    label="Data produk yang dijual"
                    required
                    hint="Cantumkan nama produk dan harga, satu produk per baris."
                  >
                    <textarea
                      className="field-textarea"
                      id="signup-products"
                      required
                      minLength={5}
                      value={values.products}
                      onChange={(event) =>
                        update("products", event.target.value)
                      }
                      placeholder={"Pempek kapal selam - 15000\nEs teh - 5000"}
                    />
                  </FormField>
                </div>
              </div>
            </>
          )}
          <Button
            type="submit"
            size="lg"
            style={{ width: "100%", marginTop: 21 }}
          >
            {values.role === "owner" ? "Kirim pendaftaran" : "Buat akun"}
          </Button>
        </form>
        <div className="signup-prompt">
          Sudah punya akun? <Link href="/login">Masuk</Link>
        </div>
      </div>
    </div>
  );
}
