import OrderDetail from "@/components/OrderDetail";
import { STATIC_ORDER_IDS } from "@/lib/data";

export function generateStaticParams() {
  return STATIC_ORDER_IDS.map((id) => ({ id }));
}
export const dynamicParams = false;

export default async function OrderPage({ params }) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}
