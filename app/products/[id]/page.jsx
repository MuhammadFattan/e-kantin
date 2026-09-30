import ProductDetail from "@/components/ProductDetail";
import { STATIC_PRODUCT_IDS } from "@/lib/data";

export function generateStaticParams() {
  return STATIC_PRODUCT_IDS.map((id) => ({ id }));
}
export const dynamicParams = false;

export default async function ProductPage({ params }) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
