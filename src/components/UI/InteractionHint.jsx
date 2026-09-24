import { useState, useEffect } from "react";

export function InteractionHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6500);
    const dismiss = () => setVisible(false);

    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("touchstart", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="interaction-hint-quiet" id="interaction-hint" aria-hidden="true">
      Drag to orbit · Scroll to zoom
    </div>
  );
}
