import { CONFIG } from "@/config/config";
import { Mail, MapPin, Phone } from "lucide-react";
import MapNavigation from "@/components/common/MapNavigation";

const Contact = () => {
  const {
    contactEmail,
    phoneNumber,
    contactAddress,
  } = CONFIG;
  
  const contacts = [
    {
      icon: <Mail className="text-white" />,
      text: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    {
      icon: <Phone className="text-white" />,
      text: phoneNumber,
      href: `tel:${phoneNumber}`,
    },
    {
      icon: <MapPin className="text-white" />,
      text: contactAddress,
      isAddress: true,
    },
  ];

  return (
    <ul className="grid lg:grid-flow-col gap-5">
      {contacts.map((contact) => (
        <li
          key={contact.text}
          className="flex gap-5 border-b-[1px] border-white pb-5 md:pb-2"
        >
          <div className="flex gap-2 items-center text-sm">
            {contact.href ? (
              <a href={contact.href} className="flex gap-2 text-white">
                {contact.icon}
                <span className="ml-2">{contact.text}</span>
              </a>
            ) : (
              <>
                {contact.icon}
                <span>{contact.text}</span>
              </>
            )}
          </div>
          {contact.isAddress && <MapNavigation />}
        </li>
      ))}
    </ul>
  );
};

export default Contact;
