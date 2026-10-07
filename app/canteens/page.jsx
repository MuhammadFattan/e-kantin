"use client";

import { Store, Truck } from "lucide-react";
import CanteenCard from "@/components/CanteenCard";
import { EmptyState, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function CanteensPage() {
  const { canteens, products } = useStore();
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="Di sekitar kampus"
        title="Kantin & UMKM"
        description="Jelajahi pilihan kantin di lingkungan kampus."
      />
      {canteens.length ? (
        <div className="canteen-grid">
          {canteens.map((canteen) => (
            <CanteenCard
              key={canteen.id}
              canteen={canteen}
              productCount={
                products.filter((product) => product.canteenId === canteen.id)
                  .length
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Store}
          title="Belum ada kantin"
          description="Data kantin akan muncul setelah ditambahkan oleh admin."
        />
      )}
      <div style={{ marginTop: 28 }} className="pickup-note">
        <Store size={16} />
        <span>
          Pilih menu untuk dipesan dan diambil langsung di kantin.
        </span>
      </div>
    </div>
  );
}
