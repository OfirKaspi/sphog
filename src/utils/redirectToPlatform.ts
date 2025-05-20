export const redirectToPlatform = (url: string, wasDragged?: boolean) => {
    if (wasDragged) return;
  
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener noreferrer");
    }
  };
  