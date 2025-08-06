import { describe, it, expect } from "vitest";
import { MapCoordinateSystem } from "../utils/mapCoordinates";
import { createRef } from "react";

function makeContainer(width = 1000, height = 600, left = 0, top = 0) {
  const el = document.createElement("div");
  Object.defineProperty(el, "getBoundingClientRect", {
    value: () => ({
      width,
      height,
      left,
      top,
      right: left + width,
      bottom: top + height,
    }),
  });
  const ref = createRef<HTMLDivElement>();
  // @ts-expect-error test shim assigns current directly
  ref.current = el;
  return ref;
}

function approx(a: number, b: number, eps = 1e-6) {
  expect(Math.abs(a - b)).toBeLessThanOrEqual(eps);
}

describe("MapCoordinateSystem round-trip", () => {
  it("screenToNormalized(normalizedToScreen(p)) ≈ p across zoom/pan combos", () => {
    const ref = makeContainer();
    const combos: Array<[number, number, number]> = [
      [1, 0, 0],
      [1.5, 0.1, -0.1],
      [2.0, -0.3, 0.2],
      [3.5, 0.0, 0.0],
    ];
    const points: Array<[number, number]> = [
      [0.1, 0.1],
      [0.5, 0.5],
      [0.9, 0.9],
      [0.05, 0.95],
    ];
    for (const [z, px, py] of combos) {
      const cs = new MapCoordinateSystem(z, px, py, ref);
      for (const [nx, ny] of points) {
        const s = cs.normalizedToScreen(nx, ny);
        const n2 = cs.screenToNormalized(s.x, s.y);
        // unwrap x because it wraps 0..1
        const dx = ((((n2.x - nx + 0.5) % 1) + 1) % 1) - 0.5;
        approx(dx, 0, 1e-5);
        approx(n2.y, ny, 1e-5);
      }
    }
  });
});

describe("cursor-locked zoom formula", () => {
  it("keeps the same world point under the cursor after zoom", () => {
    const ref = makeContainer();

    const zoom = 2;
    const panX = 0.1;
    const panY = -0.05;
    const cs = new MapCoordinateSystem(zoom, panX, panY, ref);

    // Choose an arbitrary screen point (mouse)
    const mouseX = 640; // px
    const mouseY = 320; // px

    // World coordinate under cursor BEFORE zoom
    const before = cs.screenToNormalized(mouseX, mouseY);

    // Target zoom (like wheel/pinch)
    const newZoom = 3;

    const rect = ref.current!.getBoundingClientRect();
    const mouseRelX = (mouseX - rect.left) / rect.width; // 0..1
    const mouseRelY = (mouseY - rect.top) / rect.height; // 0..1

    // Closed-form used in WorldMap.tsx
    const panXAfter = (mouseRelX - 0.5) / newZoom - (before.x - 0.5);
    const panYAfter = mouseRelY - 0.5 - newZoom * (before.y - 0.5);

    const csAfter = new MapCoordinateSystem(newZoom, panXAfter, panYAfter, ref);
    const sAfter = csAfter.normalizedToScreen(before.x, before.y);

    approx(sAfter.x, mouseX, 1e-4);
    approx(sAfter.y, mouseY, 1e-4);
  });
});

describe("constrainPan", () => {
  it("forces panY=0 at zoom=1 and wraps panX", () => {
    const ref = makeContainer();
    const cs = new MapCoordinateSystem(1, 0, 0, ref);

    // panY should snap to 0 at zoom 1 regardless of input
    const c1 = cs.constrainPan(0.2, 0.8, 1);
    expect(c1.y).toBe(0);

    // panX wraps to [-1,1] range repeatedly
    const c2 = cs.constrainPan(3.2, 0, 1); // many wraps to the right
    expect(c2.x).toBeGreaterThanOrEqual(-1);
    expect(c2.x).toBeLessThanOrEqual(1);
    const c3 = cs.constrainPan(-2.7, 0, 1); // many wraps to the left
    expect(c3.x).toBeGreaterThanOrEqual(-1);
    expect(c3.x).toBeLessThanOrEqual(1);
  });

  it("clamps vertical pan at higher zooms", () => {
    const ref = makeContainer();
    const z = 3; // allows +/- (z-1)/2 = 1
    const cs = new MapCoordinateSystem(z, 0, 0, ref);

    const top = cs.constrainPan(0, 5, z); // way too high
    approx(top.y, 1);

    const bottom = cs.constrainPan(0, -7, z); // way too low
    approx(bottom.y, -1);
  });
});

describe("pan delta scaling", () => {
  it("screen shift equals drag dx/dy when pan deltas are dx/(w*zoom) and dy/height", () => {
    const width = 1200;
    const height = 800;
    const ref = makeContainer(width, height, 0, 0);

    const zoom = 2.5;
    const panX = 0.12;
    const panY = -0.08;
    const cs = new MapCoordinateSystem(zoom, panX, panY, ref);

    // pick an arbitrary world point
    const nx = 0.3;
    const ny = 0.6;
    const s0 = cs.normalizedToScreen(nx, ny);

    // simulate a pointer drag in pixels
    const dx = 37; // px
    const dy = -22; // px

    // pan deltas derived from transform equations
    const dpx = dx / (width * zoom);
    const dpy = dy / height;

    const csAfter = new MapCoordinateSystem(zoom, panX + dpx, panY + dpy, ref);
    const s1 = csAfter.normalizedToScreen(nx, ny);

    approx(s1.x - s0.x, dx, 1e-4);
    approx(s1.y - s0.y, dy, 1e-4);
  });
});
