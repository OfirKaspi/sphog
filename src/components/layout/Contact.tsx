import { CONFIG } from "@/config/config";
import { Mail, MapPin, Phone } from "lucide-react";
import MapNavigation from "@/components/common/MapNavigation";

const Contact = () => {
  const {
    contactEmail,
    phoneNumber,
    contactAddress,
  } = CONFIG
  
  const contacts = [
    { icon: <Mail className="text-white" />, text: contactEmail },
    { icon: <Phone className="text-white" />, text: phoneNumber },
    { icon: <MapPin className="text-white" />, text: contactAddress, isAddress: true },
  ]

  return (
    <ul className="grid lg:grid-flow-col gap-5">
      {contacts.map((contact) => (
        <li key={contact.text} className="flex gap-5 border-b-2 border-secondary pb-5 md:pb-2">
          <div className="flex gap-2 items-center text-sm">
            {contact.icon}
            {contact.text}
          </div>
          {contact.isAddress && <MapNavigation />}
        </li>
      ))}
    </ul>
  );
}

export default Contact