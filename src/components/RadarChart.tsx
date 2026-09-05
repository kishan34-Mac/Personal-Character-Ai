import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { PersonaStats } from '@/context/PersonaContext';

const AXES = ['Courage', 'Wisdom', 'Power', 'Mystery', 'Heart'] as const;
type AxisKey = (typeof AXES)[number];

export default function RadarChart({
  stats,
  accentColor,
  size = 280,
}: {
  stats: PersonaStats;
  accentColor: string;
  size?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 50;
    const radius = (size - margin * 2) / 2;
    const cx = size / 2;
    const cy = size / 2;

    const angleFor = (i: number) => (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
    const pointFor = (i: number, value: number) => {
      const r = (value / 100) * radius;
      return [cx + Math.cos(angleFor(i)) * r, cy + Math.sin(angleFor(i)) * r] as [number, number];
    };

    // Background rings
    [20, 40, 60, 80, 100].forEach((level) => {
      const pts = AXES.map((_, i) => pointFor(i, level));
      svg.append('polygon')
        .attr('points', pts.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(240,237,232,0.06)')
        .attr('stroke-width', 0.5);
    });

    // Axis lines
    AXES.forEach((_, i) => {
      const [px, py] = pointFor(i, 100);
      svg.append('line')
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', px)
        .attr('y2', py)
        .attr('stroke', 'rgba(240,237,232,0.1)')
        .attr('stroke-width', 0.5);
    });

    // Axis labels
    AXES.forEach((label, i) => {
      const [px, py] = pointFor(i, 118);
      svg.append('text')
        .attr('x', px)
        .attr('y', py)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'DM Mono, monospace')
        .attr('font-size', 10)
        .attr('fill', 'rgba(240,237,232,0.4)')
        .attr('letter-spacing', '0.1em')
        .text(label.toUpperCase());
    });

    const statValues = AXES.map((k) => (stats as Record<string, number>)[k.toLowerCase()] ?? 0);

    // Data polygon (start at zero)
    const zeroPts = AXES.map((_, i) => pointFor(i, 0));
    const realPts = AXES.map((_, i) => pointFor(i, statValues[i]));

    const polygon = svg.append('polygon')
      .attr('points', zeroPts.map((p) => p.join(',')).join(' '))
      .attr('fill', hexToRgba(accentColor, 0.12))
      .attr('stroke', accentColor)
      .attr('stroke-width', 1.5)
      .style('opacity', 0);

    polygon
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .attr('points', realPts.map((p) => p.join(',')).join(' '));

    // Data points
    AXES.forEach((_, i) => {
      svg.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 3)
        .attr('fill', accentColor)
        .transition()
        .delay(i * 100)
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr('cx', realPts[i][0])
        .attr('cy', realPts[i][1]);
    });
  }, [stats, accentColor, size]);

  return <svg ref={svgRef} width={size} height={size} style={{ display: 'block' }} />;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 240;
  const g = parseInt(h.substring(2, 4), 16) || 237;
  const b = parseInt(h.substring(4, 6), 16) || 232;
  return `rgba(${r},${g},${b},${alpha})`;
}
