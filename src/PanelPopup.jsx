import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import FitScale from './FitScale.jsx';

// Full-window enlarged view of a panel. Any click (or Escape) closes it.
export default function PanelPopup({ open, onClose, label, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="panel-popup" role="dialog" aria-modal="true" aria-label={label} onClick={onClose} title="Click to close">
      <div className="panel-popup-card">
        <FitScale>{children}</FitScale>
      </div>
      <div className="panel-popup-hint">Click anywhere or press Esc to close</div>
    </div>,
    document.body,
  );
}
