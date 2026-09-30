"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Store,
  Truck,
  Users,
} from "lucide-react";
import {
  EmptyState,
  LoadingState,
  PageHeading,
  StatusBadge,
} from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function OrderDetail({ orderId }) {
  const router = useRouter();
  const { orders, canteens, currentUser, hydrated } = useStore();
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setSuccess(
      new URLSearchParams(window.location.search).get("success") === "1",
    );
  }, []);
  if (!hydrated)
    return (
      <div className="page-container">
        <LoadingState />
      </div>
    );

  const order = orders.find((item) => item.id === orderId);
  if (!order)
    return (
      <div className="page-container">
        <Link href="/orders" className="back-link">
          <ArrowLeft size={15} />
          Riwayat pesanan
        </Link>
        <EmptyState
          icon={ShoppingBag}
          title="Pesanan tidak ditemukan"
          description="Nomor ini belum ada di data browser ini."
          action={
            <Link href="/canteens" className="button button-primary button-md">
              Jelajahi kantin
            </Link>
          }
        />
      </div>
    );
  if (currentUser?.role !== "student" || order.userId !== currentUser.id)
    return (
      <div className="page-container">
        <EmptyState
          icon={ShoppingBag}
          title="Pesanan ini bukan milik akun kamu"
          description="Masuk dengan akun mahasiswa/staf yang membuat pesanan untuk melihat detailnya."
          action={
            <Link href="/login" className="button button-primary button-md">
              Masuk
            </Link>
          }
        />
      </div>
    );

  const canteen = canteens.find((item) => item.id === order.canteenId);
  const delivery = order.fulfillmentMethod === "delivery";
  const steps = delivery
    ? ["Menunggu", "Diproses", "Siap Diantar", "Dalam Pengantaran", "Selesai"]
    : ["Menunggu", "Diproses", "Siap Diambil", "Selesai"];
  const cancelled = order.status === "Dibatalkan";
  const activeIndex = steps.indexOf(order.status);
  const serviceLabel = delivery
    ? "Diantar"
    : order.fulfillmentMethod === "dine-in"
      ? "Makan di tempat"
      : "Ambil di kantin";
  if (success)
    return (
      <div className="page-container">
        <div className="order-success">
          <div className="success-icon">
            <CheckCircle2 size={34} />
          </div>
          <span className="eyebrow">Berhasil dibuat</span>
          <h1>Pesanan berhasil dibuat</h1>
          <p>
            Pesananmu sudah tercatat. Tunggu konfirmasi dari pemilik kantin.
          </p>
          <div className="order-number-box">
            <PackageCheck size={17} />#{order.id}
          </div>
          <div>
            <StatusBadge status="Menunggu Konfirmasi" />
          </div>
          <div className="order-success-actions">
            <button
              type="button"
              className="button button-primary button-md"
              onClick={() => router.replace(`/orders/${order.id}`)}
            >
              Lihat status pesanan
            </button>
            <Link href="/" className="button button-secondary button-md">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="page-container">
      <Link href="/orders" className="back-link">
        <ArrowLeft size={15} />
        Riwayat pesanan
      </Link>
      <PageHeading
        eyebrow="Pelacakan pesanan"
        title={`Pesanan #${order.id}`}
        description={`Dibuat ${formatDate(order.createdAt)} · ${canteen?.name || "Kantin kampus"}`}
        action={
          <StatusBadge
            status={
              order.status === "Menunggu" ? "Menunggu Konfirmasi" : order.status
            }
          />
        }
      />
      <div className="order-detail-grid">
        <section className="checkout-card">
          <h2>Status pesanan</h2>
          {cancelled ? (
            <div className="cancel-state">
              <div className="cancel-icon">
                <Circle size={18} />
              </div>
              <div>
                <b>Pesanan dibatalkan</b>
                <p>
                  Pesanan ini tidak akan dilanjutkan. Hubungi pemilik kantin
                  jika membutuhkan informasi.
                </p>
              </div>
            </div>
          ) : (
            <div className="timeline">
              {steps.map((step, index) => {
                const done = index < activeIndex;
                const current = index === activeIndex;
                const Icon = done ? Check : current ? Clock3 : Circle;
                return (
                  <div
                    key={step}
                    className={`timeline-row ${done ? "done" : ""} ${current ? "current" : ""}`}
                  >
                    <span className="timeline-node">
                      <Icon size={15} />
                    </span>
                    <span className="timeline-text">
                      <b>
                        {step === "Menunggu" ? "Pesanan dibuat" : step}
                        {index === 0 && order.status === "Menunggu"
                          ? " · Menunggu Konfirmasi"
                          : ""}
                      </b>
                      <small>
                        {done
                          ? "Selesai"
                          : current
                            ? step === "Menunggu"
                              ? "Menunggu pemilik kantin"
                              : "Status saat ini"
                            : "Menunggu tahap sebelumnya"}
                      </small>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="pickup-note">
            {delivery ? (
              <Truck size={15} />
            ) : order.fulfillmentMethod === "dine-in" ? (
              <Users size={15} />
            ) : (
              <MapPin size={15} />
            )}
            <span>
              Metode: <b>{serviceLabel}</b>.{" "}
              {delivery
                ? `Alamat pengantaran: ${order.deliveryAddress}`
                : order.fulfillmentMethod === "dine-in"
                  ? `${order.partySize} kursi dipesan di ${canteen?.name || "kantin"}.`
                  : `Ambil di ${canteen?.name || "kantin"} setelah pesanan siap.`}
            </span>
          </div>
        </section>
        <aside className="summary-card">
          <h2>Detail pesanan</h2>
          <div className="product-info-box" style={{ margin: "0 0 12px" }}>
            <span className="hero-image-label-icon">
              <Store size={17} />
            </span>
            <span>
              <b>{canteen?.name || "Kantin Kampus"}</b>
              <small>
                <MapPin size={12} />
                {canteen?.location || "UIN Raden Fatah"}
              </small>
            </span>
          </div>
          {order.items.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className="checkout-summary-item"
            >
              <span>
                {item.productName} × {item.quantity}
              </span>
              <b>{formatRupiah(item.subtotal)}</b>
            </div>
          ))}
          <div className="summary-row">
            <span>Metode</span>
            <span>{serviceLabel}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatRupiah(order.total)}</strong>
          </div>
          {order.note && (
            <p className="summary-helper">Catatan: {order.note}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
