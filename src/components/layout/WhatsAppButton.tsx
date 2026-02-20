import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const WhatsAppButton = () => {
  const { data: settings = {} } = useSiteSettings();
  
  const isEnabled = settings['whatsapp_enabled'] === 'true';
  const whatsappNumber = settings['whatsapp_number']?.replace(/\D/g, '');
  const whatsappMessage = settings['whatsapp_message'] || 'Hi! I have a question about your products.';

  if (!isEnabled || !whatsappNumber) return null;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 group"
    >
      <span className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 transition-all duration-300">
        <MessageCircle className="h-6 w-6" />
      </span>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
        Chat with us
      </span>
    </a>
  );
};
