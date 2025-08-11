// PageB.tsx
import React, { useState } from "react";

export default function PageB() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h2>עמוד B</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="כתוב כאן..."
      />
    </div>
  );
}
