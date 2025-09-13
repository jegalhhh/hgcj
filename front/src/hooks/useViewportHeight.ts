import { useEffect } from "react";

const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      const h = window.innerHeight;
      const scale = Math.min(1, h / 912);
      document.documentElement.style.setProperty("--scale", `${scale}`);
    };

    setVh();
    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);
};

export default useViewportHeight;
