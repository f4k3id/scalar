import React from 'react';

export default function ResizeHandle({ value, onChange, min = 140, max = 720, scale = 1, label = 'Resize panel' }) {
  const onPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const x0 = e.clientX;
    const w0 = Number(value) || min;
    const sc = scale > 0 ? scale : 1;
    const move = (ev) => {
      const next = Math.min(max, Math.max(min, w0 + (ev.clientX - x0) / sc));
      onChange(Math.round(next));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div
      className="panel-resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      title={label}
      onPointerDown={onPointerDown}
    />
  );
}
