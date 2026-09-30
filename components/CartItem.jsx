"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function CartItem({ line, product, canteen }) {
  const { setCartQuantity, removeCartItem } = useStore();
  if (!product) return null;
  return (
    <div className="cart-item">
      <Link href={`/products/${product.id}`} className="cart-item-image">
        <FoodImage src={product.image} alt={product.name} />
      </Link>
      <div>
        <Link href={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="cart-canteen">
          {canteen?.name || "Kantin Kampus"} · {formatRupiah(product.price)}
        </div>
        <div className="cart-item-actions">
          <div className="quantity-control">
            <button
              type="button"
              aria-label={`Kurangi ${product.name}`}
              onClick={() =>
                line.quantity <= 1
                  ? removeCartItem(product.id)
                  : setCartQuantity(product.id, line.quantity - 1)
              }
            >
              <Minus size={13} />
            </button>
            <span>{line.quantity}</span>
            <button
              type="button"
              aria-label={`Tambah ${product.name}`}
              onClick={() => setCartQuantity(product.id, line.quantity + 1)}
            >
              <Plus size={13} />
            </button>
          </div>
          <button
            type="button"
            className="remove-button"
            onClick={() => removeCartItem(product.id)}
          >
            <Trash2 size={13} />
            Hapus
          </button>
        </div>
      </div>
      <strong className="cart-line-total">
        {formatRupiah(product.price * line.quantity)}
      </strong>
    </div>
  );
}
