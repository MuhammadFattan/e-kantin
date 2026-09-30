import Link from "next/link";
import { MapPin, Package, Star } from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { StatusBadge } from "@/components/ui";

export default function CanteenCard({ canteen, productCount = 0 }) {
  return (
    <Link href={`/canteens/${canteen.id}`} className="canteen-card card-hover">
      <div className="canteen-card-image">
        <FoodImage src={canteen.image} alt={canteen.name} />
        <StatusBadge status={canteen.status} />
        <span className="rating-pill">
          <Star size={13} fill="currentColor" />
          {canteen.rating}
        </span>
      </div>
      <div className="canteen-card-body">
        <h3>{canteen.name}</h3>
        <p className="muted-row">
          <MapPin size={15} />
          {canteen.location}
        </p>
        <p className="muted-row">
          <Package size={15} />
          {productCount} produk <span className="dot-separator">·</span> Buka{" "}
          {canteen.hours || "08.00–16.00"}
        </p>
      </div>
    </Link>
  );
}
