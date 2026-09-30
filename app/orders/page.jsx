"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import OrderCard from "@/components/OrderCard";
import { EmptyState, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function OrdersPage() {
  const { orders, canteens, currentUser } = useStore();
  const visibleOrders =
    currentUser?.role === "student"
      ? orders.filter((order) => order.userId === currentUser.id)
      : [];
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="Pesanan kamu"
        title="Riwayat pesanan"
        description="Lihat pesanan yang sudah dibuat dan pantau statusnya."
      />
      {currentUser?.role !== "student" ? (
        <EmptyState
          icon={ClipboardList}
          title="Masuk sebagai mahasiswa atau staf"
          description="Riwayat hanya dapat dilihat oleh akun pembeli yang masuk."
          action={
            <Link href="/login" className="button button-primary button-md">
              Masuk
            </Link>
          }
        />
      ) : visibleOrders.length ? (
        <div className="order-list">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              canteen={canteens.find((item) => item.id === order.canteenId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada pesanan"
          description="Pesanan yang berhasil dibuat akan tercatat di sini."
          action={
            <Link href="/canteens" className="button button-primary button-md">
              Pilih menu
            </Link>
          }
        />
      )}
    </div>
  );
}
