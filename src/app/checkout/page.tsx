import { getStoreSettings } from '@/app/actions';
import CheckoutClient from '@/app/components/CheckoutClient';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const store = await getStoreSettings();
  const storeName = store?.store_name || "KUI'S CLOSET";
  const whatsappNumber = store?.whatsapp_number;

  return (
    <CheckoutClient storeName={storeName} whatsappNumber={whatsappNumber} />
  );
}
