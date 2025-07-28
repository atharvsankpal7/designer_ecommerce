import { getHeaderData } from '@/lib/actions';
import { WhatsAppFloat } from './whatsapp-float';

export async function WhatsAppFloatWrapper() {
  const headerData = await getHeaderData();
  
  return (
    <WhatsAppFloat 
      phoneNumber={headerData.whatsappNumber}
      message="Hello! I'm interested in your products and would like to know more."
    />
  );
}