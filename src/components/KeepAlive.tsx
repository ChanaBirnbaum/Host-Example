// KeepAlive.tsx
import React, { ReactNode, useRef } from "react";

interface KeepAliveProps {
  id: string; // מזהה ייחודי לקומפוננטה
  children: ReactNode;
}

const cache = new Map<string, React.ReactElement>();

export const KeepAlive: React.FC<KeepAliveProps> = ({ id, children }) => {
  const stored = cache.get(id);

  // פעם ראשונה — נשמור את הקומפוננטה בזיכרון
  const elementRef = useRef<React.ReactElement>(
    stored ?? <>{children}</>
  );

  if (!stored) {
    cache.set(id, elementRef.current);
  }

  return elementRef.current;
};
