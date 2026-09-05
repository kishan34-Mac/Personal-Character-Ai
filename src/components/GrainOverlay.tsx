import { useEffect, useRef } from 'react';

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let frame = 0;
    let imageData: ImageData;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      imageData = ctx.createImageData(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      frame++;
      if (frame % 3 === 0) {
        const data = imageData.data;
        const len = data.length;
        for (let i = 0; i < len; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = Math.random() * 15 + 5;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 8000,
        opacity: 0.035,
      }}
    />
  );
}
