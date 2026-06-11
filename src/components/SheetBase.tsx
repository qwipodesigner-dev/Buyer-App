import { useState, useRef } from 'react';

// Reusable sheet header — handle + icon + title + subtitle + close button
// Matches the structure of the Qwipo reference design
export function SheetHeader({ icon, title, subtitle, onClose, dragHandlers }) {
  return (
    <>
      <div className="sheet-handle" {...(dragHandlers || {})}></div>
      <div className="sheet-header" {...(dragHandlers || {})}>
        {icon && <div className="sheet-header-icon">{icon}</div>}
        <div className="sheet-header-text">
          <div className="sheet-title">{title}</div>
          {subtitle && <div className="sheet-sub">{subtitle}</div>}
        </div>
        <button
          className="sheet-close-btn"
          onClick={onClose}
          aria-label="Close"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  );
}

// Swipe-down-to-close behavior — bind dragHandlers to handle/header area only
// so body content can still scroll normally
export function useSheetSwipe(onClose, threshold = 120) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  const start = (clientY) => {
    startYRef.current = clientY;
    draggingRef.current = true;
    setIsDragging(true);
  };

  const move = (clientY) => {
    if (!draggingRef.current) return;
    const delta = Math.max(0, clientY - startYRef.current);
    setDragY(delta);
  };

  const end = () => {
    if (!draggingRef.current) return;
    if (dragY > threshold) {
      onClose();
    }
    setDragY(0);
    setIsDragging(false);
    draggingRef.current = false;
  };

  const dragHandlers = {
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      start(e.clientY);
    },
    onPointerMove: (e) => move(e.clientY),
    onPointerUp: end,
    onPointerCancel: end,
    onTouchStart: (e) => start(e.touches[0].clientY),
    onTouchMove: (e) => move(e.touches[0].clientY),
    onTouchEnd: end,
  };

  const sheetStyle = {
    transform: dragY ? `translateY(${dragY}px)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return { dragHandlers, sheetStyle };
}

// Common discount/percent icon used in the Discounts sheet
export const PercentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);
