"use client";

import Link from "next/link";
import { ArrowRight, Building2, Package, Plus, Users } from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import { PageHeading, StatusBadge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function AdminDashboard() {
  const { owners, canteens, products } = useStore();
  return (
    <ConsoleShell type="admin" title="Dashboard">
      <PageHeading
        eyebrow="Ringkasan pengelolaan"
        title="Dashboard admin"
        description="Kelola akun pemilik dan lihat gambaran data kantin UMKM."
        action={
          <Link
            href="/admin/owners/create"
            className="button button-primary button-md"
          >
            <Plus size={16} />
            Tambah pemilik
          </Link>
        }
      />
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon">
            <Users size={19} />
          </span>
          <span>
            <small>Total pemilik kantin</small>
            <strong>{owners.length}</strong>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon coral">
            <Building2 size={19} />
          </span>
          <span>
            <small>Total kantin / UMKM</small>
            <strong>{canteens.length}</strong>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <Package size={19} />
          </span>
          <span>
            <small>Total produk</small>
            <strong>{products.length}</strong>
          </span>
        </div>
      </div>
      <section className="console-panel">
        <div className="console-panel-head">
          <div>
            <h2>Pemilik kantin terbaru</h2>
            <p>Data akun yang terhubung dengan usaha kampus.</p>
          </div>
          <Link href="/admin/owners" className="text-link">
            Kelola pemilik <ArrowRight size={14} />
          </Link>
        </div>
        <div className="console-table-wrap">
          <table className="console-table">
            <thead>
              <tr>
                <th>NAMA</th>
                <th>KANTIN / UMKM</th>
                <th>USERNAME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {owners.slice(0, 5).map((owner) => {
                const canteen = canteens.find(
                  (item) => item.ownerId === owner.id,
                );
                return (
                  <tr key={owner.id}>
                    <td>
                      <span className="table-primary">{owner.name}</span>
                      <div className="table-secondary">{owner.phone}</div>
                    </td>
                    <td>
                      {canteen?.name || "Belum dihubungkan"}
                      <div className="table-secondary">
                        {canteen?.location || "—"}
                      </div>
                    </td>
                    <td>@{owner.username}</td>
                    <td>
                      <StatusBadge status={owner.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {owners.length === 0 && (
          <p className="table-empty">Belum ada data pemilik kantin.</p>
        )}
      </section>
    </ConsoleShell>
  );
}
