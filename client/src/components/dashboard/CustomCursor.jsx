import React, { useState, useEffect } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, canvas, .cursor-pointer');
      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-3 h-3 bg-cyan-glow rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 shadow-cyan-glow"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      />
      <div
        className={`fixed top-0 left-0 w-8 h-8 border border-cyan-glow/60 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          hovered ? 'scale-150 border-thermal-orange bg-thermal-orange/10' : 'scale-100'
        }`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      />
    </>
  );
}
