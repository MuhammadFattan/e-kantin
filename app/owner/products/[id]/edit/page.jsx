import OwnerProductForm from "@/components/OwnerProductForm";
import { STATIC_PRODUCT_IDS } from "@/lib/data";

export function generateStaticParams() {
  return STATIC_PRODUCT_IDS.map((id) => ({ id }));
}
export const dynamicParams = false;

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return <OwnerProductForm productId={id} />;
}
