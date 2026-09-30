"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Clock3,
  PackageCheck,
  Store,
  Truck,
} from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import { Button, EmptyState, PageHeading, StatusBadge } from "@/components/ui";
import { ORDER_TRANSITIONS } from "@/lib/data";
import { useStore } from "@/context/StoreContext";
import { formatDate, formatRupiah } from "@/lib/utils";

function nextAction(order) {
  if (order.status === "Menunggu") return ["Diproses", "Terima Pesanan"];
  if (order.status === "Diproses")
    return order.fulfillmentMethod === "delivery"
      ? ["Siap Diantar", "Pesanan Siap"]
      : ["Siap Diambil", "Siap Diambil"];
  if (order.status === "Siap Diambil") return ["Selesai", "Selesaikan Pesanan"];
  if (order.status === "Siap Diantar")
    return ["Dalam Pengantaran", "Mulai Pengantaran"];
  if (order.status === "Dalam Pengantaran")
    return ["Selesai", "Selesaikan Pesanan"];
  return null;
}
const icons = {
  Menunggu: Clock3,
  Diproses: ClipboardList,
  "Siap Diambil": PackageCheck,
  "Siap Diantar": PackageCheck,
  "Dalam Pengantaran": Truck,
};

export default function OwnerOrdersPage() {
  const {
    currentUser,
    owners,
    canteens,
    orders,
    updateOrderStatus,
    requestConfirmation,
  } = useStore();
  const owner = owners.find((item) => item.id === currentUser?.id) || owners[0];
  const canteen =
    canteens.find((item) => item.ownerId === owner?.id) || canteens[0];
  const [filter, setFilter] = useState("Semua");
  const menu = useMemo(
    () =>
      orders.filter(
        (item) =>
          item.canteenId === canteen?.id &&
          (filter === "Semua" || item.status === filter),
      ),
    [canteen?.id, filter, orders],
  );
  async function cancel(order) {
    const confirmed = await requestConfirmation({
      title: `Batalkan pesanan ${order.id}?`,
      description:
        "Status pesanan akan menjadi Dibatalkan dan tidak dapat dilanjutkan.",
      confirmLabel: "Batalkan pesanan",
      danger: true,
    });
    if (confirmed) updateOrderStatus(order.id, "Dibatalkan");
  }
  return (
    <ConsoleShell type="owner" title="Pesanan">
      <PageHeading
        eyebrow={canteen?.name || "Pesanan kantin"}
        title="Pesanan masuk"
        description="Proses pesanan makan di tempat maupun pengantaran hingga selesai."
      />
      <div className="console-filter-row">
        <label className="filter-label" htmlFor="order-status-filter">
          Status
        </label>
        <select
          id="order-status-filter"
          className="field-select"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>Semua</option>
          <option>Menunggu</option>
          <option>Diproses</option>
          <option>Siap Diambil</option>
          <option>Siap Diantar</option>
          <option>Dalam Pengantaran</option>
          <option>Selesai</option>
          <option>Dibatalkan</option>
        </select>
        <span className="table-secondary">{menu.length} pesanan</span>
      </div>
      {menu.length ? (
        <div>
          {menu.map((order) => {
            const action = nextAction(order);
            const choices = ORDER_TRANSITIONS[order.status] || [];
            const Icon = icons[order.status] || Check;
            return (
              <article className="console-order-card" key={order.id}>
                <div className="console-order-head">
                  <div>
                    <h3>
                      #{order.id}{" "}
                      <span style={{ color: "#9aa3b1", fontWeight: 500 }}>
                        · {order.customerName}
                      </span>
                    </h3>
                    <small>
                      {formatDate(order.createdAt)} ·{" "}
                      {order.phone || "Tanpa nomor telepon"}
                    </small>
                  </div>
                  <StatusBadge
                    status={
                      order.status === "Menunggu"
                        ? "Menunggu Konfirmasi"
                        : order.status
                    }
                  />
                </div>
                <div className="order-fulfillment-summary">
                  <b>
                    {order.fulfillmentMethod === "delivery"
                      ? "Diantar"
                      : order.fulfillmentMethod === "dine-in"
                        ? `Makan di tempat · ${order.partySize} kursi`
                        : "Ambil di kantin"}
                  </b>
                  {order.fulfillmentMethod === "delivery" && (
                    <span>{order.deliveryAddress}</span>
                  )}
                </div>
                <div className="console-order-items">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="console-order-item"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                  {order.note && (
                    <small className="order-note">
                      <b>Catatan:</b> {order.note}
                    </small>
                  )}
                </div>
                <div className="console-order-foot">
                  <strong>Total {formatRupiah(order.total)}</strong>
                  <div className="console-order-actions">
                    {action && choices.includes(action[0]) && (
                      <Button
                        size="sm"
                        variant={action[0] === "Selesai" ? "primary" : "accent"}
                        onClick={() => updateOrderStatus(order.id, action[0])}
                      >
                        <Icon size={14} />
                        {action[1]}
                      </Button>
                    )}
                    {choices.includes("Dibatalkan") && (
                      <Button
                        size="sm"
                        variant="danger-ghost"
                        onClick={() => cancel(order)}
                      >
                        Batalkan
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="Tidak ada pesanan pada status ini"
          description="Pesanan baru akan muncul di sini setelah pelanggan checkout."
        />
      )}
    </ConsoleShell>
  );
}
