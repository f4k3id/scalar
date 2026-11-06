import React, { useEffect, useRef, useState } from 'react';

export default function FitScale({ children }) {
  const boxRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;

    const measure = () => {
      const nw = inner.scrollWidth;
      const nh = inner.scrollHeight;
      const aw = box.clientWidth;
      const ah = box.clientHeight;
      if (nw <= 0 || nh <= 0 || aw <= 0 || ah <= 0) return;
      const next = Math.round(Math.min(aw / nw, ah / nh) * 1000) / 1000;
      setScale((prev) => (Math.abs(prev - next) > 0.008 ? next : prev));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(inner);
    measure();
    return () => ro.disconnect();
  }, []);

  return (
    <div className="fit-box" ref={boxRef}>
      <div
        className="fit-inner"
        ref={innerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}
