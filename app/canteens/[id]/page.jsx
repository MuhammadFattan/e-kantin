import CanteenDetail from "@/components/CanteenDetail";
import { STATIC_CANTEEN_IDS } from "@/lib/data";

export function generateStaticParams() {
  return STATIC_CANTEEN_IDS.map((id) => ({ id }));
}
export const dynamicParams = false;

export default async function CanteenPage({ params }) {
  const { id } = await params;
  return <CanteenDetail canteenId={id} />;
}
