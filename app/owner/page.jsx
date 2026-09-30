"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Package, Plus, Store } from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import OrderCard from "@/components/OrderCard";
import { EmptyState, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function OwnerDashboard() {
  const { currentUser, owners, canteens, products, orders } = useStore();
  const owner = owners.find((item) => item.id === currentUser?.id) || owners[0];
  const canteen =
    canteens.find((item) => item.ownerId === owner?.id) || canteens[0];
  const canteenOrders = orders.filter((item) => item.canteenId === canteen?.id);
  const canteenProducts = products.filter(
    (item) => item.canteenId === canteen?.id,
  );
  const newOrders = canteenOrders.filter((item) => item.status === "Menunggu");
  const processing = canteenOrders.filter((item) => item.status === "Diproses");
  const activeProducts = canteenProducts.filter((item) => item.available);
  return (
    <ConsoleShell type="owner" title="Dashboard">
      <PageHeading
        eyebrow={`Halo, ${owner?.name || "Pemilik"}`}
        title="Dashboard usaha"
        description={`Pantau aktivitas ${canteen?.name || "kantin kamu"} hari ini.`}
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
      <div className="stat-grid">
        <Link href="/owner/orders" className="stat-card">
          <span className="stat-icon coral">
            <ClipboardList size={19} />
          </span>
          <span>
            <small>Pesanan baru</small>
            <strong>{newOrders.length}</strong>
          </span>
        </Link>
        <Link href="/owner/orders" className="stat-card">
          <span className="stat-icon amber">
            <Store size={19} />
          </span>
          <span>
            <small>Pesanan diproses</small>
            <strong>{processing.length}</strong>
          </span>
        </Link>
        <Link href="/owner/products" className="stat-card">
          <span className="stat-icon green">
            <Package size={19} />
          </span>
          <span>
            <small>Produk aktif</small>
            <strong>{activeProducts.length}</strong>
          </span>
        </Link>
      </div>
      <section className="console-panel">
        <div className="console-panel-head">
          <div>
            <h2>Pesanan terbaru</h2>
            <p>Periksa pesanan yang masuk dari mahasiswa dan staf.</p>
          </div>
          <Link href="/owner/orders" className="text-link">
            Semua pesanan <ArrowRight size={14} />
          </Link>
        </div>
        {canteenOrders.length ? (
          <div className="order-list">
            {canteenOrders.slice(0, 3).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                canteen={canteen}
                showCustomer
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Belum ada pesanan masuk"
            description="Pesanan pelanggan akan muncul di sini."
          />
        )}
      </section>
      <section className="console-panel">
        <div className="console-panel-head">
          <div>
            <h2>Produk aktif</h2>
            <p>{activeProducts.length} menu sedang tersedia di kantin.</p>
          </div>
          <Link href="/owner/products" className="text-link">
            Kelola produk <ArrowRight size={14} />
          </Link>
        </div>
        <div className="product-grid">
          {canteenProducts.slice(0, 4).map((product) => (
            <div className="dashboard-mini-product" key={product.id}>
              <div className="food-image">
                <img src={product.image} alt={product.name} />
              </div>
              <b>{product.name}</b>
              <small>{product.available ? "Tersedia" : "Tidak tersedia"}</small>
            </div>
          ))}
        </div>
      </section>
    </ConsoleShell>
  );
}
