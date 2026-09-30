import OwnerForm from '@/components/OwnerForm';
import { STATIC_OWNER_IDS } from '@/lib/data';

export function generateStaticParams() { return STATIC_OWNER_IDS.map((id) => ({ id })); }
export const dynamicParams = false;

export default async function EditOwnerPage({ params }) {
  const { id } = await params;
  return <OwnerForm ownerId={id} />;
}
