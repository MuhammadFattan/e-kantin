"use client";

import { Store } from "lucide-react";
import CanteenCard from "@/components/CanteenCard";
import ConsoleShell from "@/components/ConsoleShell";
import { EmptyState, PageHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function AdminCanteensPage() {
  const { canteens, products } = useStore();

  return (
    <ConsoleShell type="admin" title="Kantin / UMKM">
      <PageHeading
        eyebrow="Data usaha terdaftar"
        title="Kantin & UMKM"
        description="Daftar kantin dan UMKM yang terdaftar di platform."
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
    </ConsoleShell>
  );
}