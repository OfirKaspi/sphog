import { CONFIG } from "@/config/config";

export function getWhatsappLink() {
  const whatsappNumber = CONFIG.whatsappNumber;
  if (!whatsappNumber) return null;

  const message = encodeURIComponent("הי Sphog, אשמח לשמוע עוד פרטים.");
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}
