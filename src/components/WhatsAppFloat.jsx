import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/+919025391516?text=Hi!%20I%20need%20help%20with%20BGMI%20accounts."
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Contact on WhatsApp"
    >
      <div className="whatsapp-tooltip">Chat with us!</div>
      <MessageCircle size={32} />
    </a>
  );
}
