import { useState, useEffect } from "react";

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLargeTablet, setIsLargeTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateMatch = () => {
      const width = window.innerWidth;

      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 768);
      setIsLargeTablet(width >= 768 && width >= 1024);
      setIsDesktop(width >= 1024);

    };

    updateMatch();
    window.addEventListener("resize", updateMatch);

    return () => window.removeEventListener("resize", updateMatch);
  }, []);

  return { isMobile, isTablet, isLargeTablet, isDesktop };
};

export default useResponsive;
