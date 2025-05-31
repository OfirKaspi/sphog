import { useEffect } from "react";

export default function useScrollToCenter(
  trigger: boolean,
  ref: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (trigger && ref.current) {
      const element = ref.current;
      const offset = window.innerHeight / 2 - element.offsetHeight / 2;
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
    }
  }, [trigger, ref]);
}
