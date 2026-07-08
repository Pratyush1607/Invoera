export interface ChartPoint {
  x: number;
  y: number;
}

/** Smooth cubic-bezier path through points (Catmull-Rom style tangents). */
export function smoothPath(pts: ChartPoint[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) {
    // A single data point has nothing to draw a line between — render a flat
    // line across the full width at that value instead of an empty path, so
    // brand-new accounts with only one month of history still show something.
    return `M0,${pts[0].y.toFixed(2)} L100,${pts[0].y.toFixed(2)}`;
  }
  if (pts.length === 2) {
    return `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)} L${pts[1].x.toFixed(2)},${pts[1].y.toFixed(2)}`;
  }
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

export interface LineData {
  pts: ChartPoint[];
  smoothPath: string;
  areaPath: string;
}

/** Values normalized 0-100 (e.g. % of max) -> a bottom-anchored line/area, y=0 at top. */
export function lineFromPct(valsPct: number[]): LineData {
  const n = valsPct.length;
  const stepX = n > 1 ? 100 / (n - 1) : 100;
  const pts = valsPct.map((p, i) => ({ x: i * stepX, y: 100 - p }));
  const smooth = smoothPath(pts);
  return { pts, smoothPath: smooth, areaPath: `${smooth} L100,100 L0,100 Z` };
}

/** Values normalized -1..1 -> a line diverging above/below a y=50 zero line. */
export function lineDiverging(valsNorm: number[]): LineData {
  const n = valsNorm.length;
  const stepX = n > 1 ? 100 / (n - 1) : 100;
  const pts = valsNorm.map((v, i) => ({ x: i * stepX, y: 50 - v * 45 }));
  const smooth = smoothPath(pts);
  if (pts.length <= 1) {
    const y = pts[0]?.y ?? 50;
    return { pts, smoothPath: smooth, areaPath: `M0,50 L0,${y} L100,${y} L100,50 Z` };
  }
  const tail = smooth.slice(smooth.indexOf(" "));
  return { pts, smoothPath: smooth, areaPath: `M0,50 ${tail} L100,50 Z` };
}
