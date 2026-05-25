import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollDownIndicator() {
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide if user scrolls more than 20px
      if (window.scrollY > 20) {
        setShowIndicator(false);
      } else {
        setShowIndicator(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    // Scroll down by 80% of viewport height
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: "smooth"
    });
  };

  return (
    <div 
      className={`scroll-down-indicator ${!showIndicator ? "hidden-indicator" : ""}`} 
      onClick={handleScrollDown}
      aria-label="Scroll down"
    >
      <ChevronDown size={32} />
    </div>
  );
}
