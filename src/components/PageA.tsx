// PageA.tsx
import React, { useState } from "react";

export default function PageA() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 20 }}>
      <h2>עמוד A</h2>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>הוסף</button>
    </div>
  );
}
