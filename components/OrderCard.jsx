import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function OrderCard({ order, canteen, showCustomer = false }) {
  const displayStatus =
    order.status === "Menunggu" ? "Menunggu Konfirmasi" : order.status;
  const fulfillment =
    order.fulfillmentMethod === "delivery"
      ? `Diantar · ${order.deliveryAddress}`
      : order.fulfillmentMethod === "dine-in"
        ? `Makan di tempat · ${order.partySize} kursi`
        : "Ambil di kantin";
  return (
    <article className="order-card">
      <div className="order-card-head">
        <div>
          <Link href={`/orders/${order.id}`} className="order-code">
            #{order.id}
          </Link>
          <p className="order-date">
            <CalendarDays
              size={12}
              style={{ verticalAlign: "-2px", marginRight: 4 }}
            />
            {formatDate(order.createdAt)}
            {canteen ? ` · ${canteen.name}` : ""}
            {showCustomer ? ` · ${order.customerName}` : ""}
          </p>
        </div>
        <StatusBadge status={displayStatus} />
      </div>
      <div className="order-card-items">
        {order.items.map((item, index) => (
          <div key={`${item.productId}-${index}`} className="order-card-item">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatRupiah(item.subtotal)}</span>
          </div>
        ))}
      </div>
      <div className="order-card-footer">
        <div className="order-card-total">
          <span className="order-fulfillment-label">{fulfillment}</span>
          <strong>{formatRupiah(order.total)}</strong>
        </div>
        <Link className="text-link" href={`/orders/${order.id}`}>
          Lihat detail <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
