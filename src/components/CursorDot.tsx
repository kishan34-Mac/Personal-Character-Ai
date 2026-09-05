import { useEffect, useRef } from 'react';

export default function CursorDot() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      outer.style.display = 'none';
      inner.style.display = 'none';
      return;
    }

    let ox = 0, oy = 0, ix = 0, iy = 0, mx = 0, my = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const interactiveSelector = 'button, input, textarea, a, [data-cursor="interactive"]';
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(interactiveSelector)) {
        outer.style.width = '28px';
        outer.style.height = '28px';
        outer.style.borderColor = 'var(--char-accent, #f0ede8)';
        outer.style.opacity = '1';
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(interactiveSelector)) {
        outer.style.width = '16px';
        outer.style.height = '16px';
        outer.style.borderColor = 'rgba(240,237,232,0.3)';
      }
    };
    const onDown = () => {
      outer.style.transform = 'scaleX(0.6) scaleY(1.4)';
    };
    const onUp = () => {
      outer.style.transform = 'scale(1)';
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    let raf = 0;
    const loop = () => {
      ox += (mx - ox) * 0.1; oy += (my - oy) * 0.1;
      ix += (mx - ix) * 0.3; iy += (my - iy) * 0.3;
      outer.style.left = `${ox - 8}px`;
      outer.style.top = `${oy - 8}px`;
      inner.style.left = `${ix - 1.5}px`;
      inner.style.top = `${iy - 1.5}px`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          left: '-100px',
          top: '-100px',
          width: '16px',
          height: '16px',
          border: '1px solid rgba(240,237,232,0.3)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, transform 0.15s ease',
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          left: '-100px',
          top: '-100px',
          width: '3px',
          height: '3px',
          background: 'var(--text)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}
