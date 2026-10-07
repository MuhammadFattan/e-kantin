"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button, FormField } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { accounts, authenticate, currentUser } = useStore();
  const [values, setValues] = useState({ username: "", password: "" });

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  function submit(event) {
    event.preventDefault();
    if (!authenticate(values.username, values.password)) return;
    const account = accounts.find(
      (item) =>
        item.username.toLowerCase() === values.username.trim().toLowerCase(),
    );
    router.push(
      account?.role === "owner"
        ? "/owner"
        : account?.role === "admin"
          ? "/admin"
          : "/",
    );
  }
  function useDemo(account) {
    setValues({ username: account.username, password: "demo123" });
  }

  return (
    <div className="login-page">
      <div className="login-back">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} />
          Kembali ke beranda
        </Link>
      </div>
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">
            <img src="/brand/kantin-icon.svg" alt="" />
          </span>
          <span>
            <b>JajanGuys</b>
            <small>Masuk ke akun kamu</small>
          </span>
        </div>
        <span className="eyebrow">Selamat datang</span>
        <h1>Masuk</h1>
        <p className="login-lede">
          Gunakan akun mahasiswa/staf, pemilik kantin, atau admin yang sudah
          terdaftar.
        </p>
        <form onSubmit={submit} className="login-form">
          <FormField id="login-username" label="Username" required>
            <input
              className="field-input"
              id="login-username"
              autoComplete="username"
              required
              value={values.username}
              onChange={(event) => update("username", event.target.value)}
            />
          </FormField>
          <FormField id="login-password" label="Kata sandi" required>
            <input
              className="field-input"
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
            />
          </FormField>
          <Button
            type="submit"
            size="lg"
            style={{ width: "100%", marginTop: 5 }}
          >
            Masuk <ArrowRight size={16} />
          </Button>
        </form>
        <div className="signup-prompt">
          Belum punya akun? <Link href="/signup">Daftar sekarang</Link>
        </div>
        <details className="demo-accounts">
          <summary>
            <UserRound size={14} />
            Akun demo
          </summary>
          <div className="demo-account-list">
            {accounts
              .filter((account) => account.password === "demo123")
              .map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => useDemo(account)}
                >
                  <span>
                    <b>{account.name}</b>
                    <small>
                      {account.username} ·{" "}
                      {account.role === "student"
                        ? "Mahasiswa/staf"
                        : account.role === "owner"
                          ? "Pemilik kantin"
                          : "Admin"}
                    </small>
                  </span>
                  <ArrowRight size={14} />
                </button>
              ))}
          </div>
          <small className="demo-credentials">
            <LockKeyhole size={12} /> Kata sandi akun demo: demo123
          </small>
        </details>
        <div className="demo-disclaimer">
          <Building2 size={15} />
          <span>
            Prototipe ini menyimpan data akun secara lokal di browser, bukan
            autentikasi server produksi.
          </span>
        </div>
      </div>
    </div>
  );
}
