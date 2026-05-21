import { useEffect } from "react";

export default function useSEO(title, description) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Maddy BGMI Store`;
    }
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
  }, [title, description]);
}
