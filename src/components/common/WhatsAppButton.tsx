"use client";

import { useEffect, useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { MessageCircle, Phone } from "lucide-react";
import { CONFIG } from "@/config/config";
import useResponsive from "@/hooks/useResponsive";
import { redirectToPlatform } from "@/utils/redirectToPlatform";

const WhatsAppButton = () => {
  const size = 48;

  const phoneNumber = CONFIG.whatsappNumber;
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  /**
   * Initial position of the button (bottom-right corner).
   * Set only on client after layout is ready.
  */
  const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);

  const { isDesktop } = useResponsive()

  useEffect(() => {
    const padding = isDesktop ? 16 : 8;
    const x = window.innerWidth - size - padding;
    const y = window.innerHeight - size - 8;
    setInitialPosition({ x, y });
  }, [isDesktop]);

  const { position, handleMouseDown, handleTouchStart, wasDragged, isDragging } = useDraggable({
    size,
    initialPosition,
  });

  // Track if component has entered for animation purposes
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (position) setIsVisible(true);
  }, [position]);

  // Don't render until position is known
  if (!position) return null;

  const handleClick = () => {
    redirectToPlatform(whatsappUrl, wasDragged.current)
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`fixed z-50 rounded-full 
        ${isDragging ? "" : "transition-all duration-500 ease-out"
        } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="שלח הודעה בוואטסאפ"
        className="relative bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <MessageCircle size={32} color="white" />
        <Phone size={12} className="absolute text-white fill-white" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
