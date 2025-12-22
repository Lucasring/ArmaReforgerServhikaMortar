<script lang="ts">
  import { onDestroy } from 'svelte';
  import * as OpenSeadragon from 'openseadragon';
  import { MAP_SCALE_METERS_PER_PIXEL } from '../../config/mortarConfig';
  import { 
    viewerStore, 
    overlayStore, 
    mortarPosition, 
    targetPosition, 
    cursorPixel 
  } from '../../stores/mapStore.js';

  // --- Types & Props ---

  interface MapLayerProps {
    selectedMortarType: any;
    selectedAmmoType: any;
    selectedRing: number;
  }

  interface Point { x: number; y: number; }

  let { selectedMortarType, selectedAmmoType, selectedRing = 0 }: MapLayerProps = $props();

  let viewer: any = null;
  let overlay: HTMLElement | null = null;
  let viewMapSize = { x: 0, y: 0 };
  
  let mPos: any = null;
  let tPos: any = null;
  let cPixel: any = null;

  // --- SVG PRIMITIVES (The Library) ---

  function createSVGElement(tag: string) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  /**
   * Applies a dictionary of attributes to an SVG element
   */
  function applyAttributes(el: SVGElement, attr: Record<string, any>) {
    Object.entries(attr).forEach(([key, val]) => el.setAttribute(key, String(val)));
  }

  /**
   * Draws a circle at a World Coordinate
   */
  function drawCircle(svg: SVGElement, center: Point, radius: number, attr: any) {
    const p = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(center.x, center.y));
    const el = createSVGElement('circle');
    el.setAttribute('cx', String(p.x));
    el.setAttribute('cy', String(p.y));
    el.setAttribute('r', String(radius));
    applyAttributes(el, attr);
    svg.appendChild(el);
  }

  /**
   * Draws a line. Can accept World Coords or Screen Coords (pixels)
   */
  function drawLine(svg: SVGElement, p1: Point, p2: Point, attr: any, isScreenSpace = false) {
    const s1 = isScreenSpace ? p1 : viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(p1.x, p1.y));
    const s2 = isScreenSpace ? p2 : viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(p2.x, p2.y));
    
    const el = createSVGElement('line');
    el.setAttribute('x1', String(s1.x)); el.setAttribute('y1', String(s1.y));
    el.setAttribute('x2', String(s2.x)); el.setAttribute('y2', String(s2.y));
    applyAttributes(el, attr);
    svg.appendChild(el);
  }

  /**
   * Draws a range ring based on meters
   */
  function drawRing(svg: SVGElement, center: Point, radiusInMeters: number, attr: any) {
    if (viewMapSize.x <= 0) return;
    const containerSize = viewer.viewport.getContainerSize();
    const ratio = containerSize.x / viewMapSize.x;
    
    // Scale meters to pixels based on project config
    const rPixels = radiusInMeters * MAP_SCALE_METERS_PER_PIXEL * 1.333;
    const finalRadius = (rPixels * ratio) / containerSize.x;
    
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const pt = new OpenSeadragon.Point(
        center.x + Math.cos(angle) * finalRadius, 
        center.y + Math.sin(angle) * finalRadius
      );
      const sp = viewer.viewport.pixelFromPoint(pt);
      if (sp) points.push(`${sp.x},${sp.y}`);
    }
    
    const el = createSVGElement('path');
    el.setAttribute('d', `M ${points.join(' L ')} Z`);
    applyAttributes(el, attr);
    svg.appendChild(el);
  }

  /**
   * Draws text at a World Coordinate
   */
  function drawText(svg: SVGElement, text: string, pos: Point, attr: any) {
    const p = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(pos.x, pos.y));
    const el = createSVGElement('text');
    el.setAttribute('x', String(p.x));
    el.setAttribute('y', String(p.y));
    el.textContent = text;
    applyAttributes(el, attr);
    svg.appendChild(el);
  }

  // --- LAYER RENDERERS ---

  function drawMortarLayer(svg: SVGElement) {
    if (!mPos) return;

    // Mortar Location Icon
    drawCircle(svg, mPos, 6, { 
        fill: '#3b82f6', 
        stroke: 'black', 
        'stroke-width': 2 
    });
    
    // Range Ring
    const ringData = selectedAmmoType?.ballistics?.rings?.[selectedRing]?.at(-1);
    if (ringData) {
      drawRing(svg, mPos, ringData.range, { 
        fill: 'none', 
        stroke: 'rgba(59, 130, 246, 0.5)', 
        'stroke-width': 3 
      });

      // Range Label
      drawText(svg, `${ringData.range}m`, mPos, {
        fill: '#3b82f6', 
        'font-size': '14px', 
        'font-weight': 'bold',
        'text-anchor': 'middle', 
        dy: -15 
      });
    }
  }

  function drawTargetLayer(svg: SVGElement) {
    if (!tPos) return;

    // Target Location Icon
    drawCircle(svg, tPos, 3, { 
        fill: '#ef4444', 
        stroke: 'black', 
        'stroke-width': 2 
    });

    // Distance Line
    if (mPos) {
      drawLine(svg, mPos, tPos, { 
        stroke: 'rgba(239, 68, 68, 0.6)', 
        'stroke-width': 2, 
        'stroke-dasharray': '5,5' 
      });
    }
  }

  function drawCrosshairLayer(svg: SVGElement) {
    if (!cPixel || !overlay) return;
    const colorAttr = { stroke: 'orange', 'stroke-opacity': 0.5, 'stroke-width': 1 };
    
    // Horizontal
    drawLine(svg, {x: 0, y: cPixel.y}, {x: overlay.clientWidth, y: cPixel.y}, colorAttr, true);
    // Vertical
    drawLine(svg, {x: cPixel.x, y: 0}, {x: cPixel.x, y: overlay.clientHeight}, colorAttr, true);
  }

  // --- MAIN RENDER LOGIC ---

  function renderOverlay() {
    if (!overlay || !viewer) return;

    const item = viewer.world.getItemAt(0);
    if (item) viewMapSize = item.getContentSize();

    overlay.innerHTML = '';
    const svg = createSVGElement('svg') as unknown as SVGElement;
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    overlay.appendChild(svg);

    drawMortarLayer(svg);
    drawTargetLayer(svg);
    drawCrosshairLayer(svg);
  }

  // --- LIFECYCLE & STORES ---

  $effect(() => {
    // Reactive dependencies
    const _deps = [selectedMortarType, selectedAmmoType, selectedRing, mPos, tPos, cPixel];
    if (viewer && overlay) {
      renderOverlay();
    }
  });

  const unsubs = [
    viewerStore.subscribe(v => { 
      if (viewer) {
        viewer.removeHandler('animation', renderOverlay);
        viewer.removeHandler('zoom', renderOverlay);
      }
      viewer = v; 
      if (viewer) {
        viewer.addHandler('animation', renderOverlay);
        viewer.addHandler('zoom', renderOverlay);
      }
      renderOverlay();
    }),
    overlayStore.subscribe(o => { overlay = o; renderOverlay(); }),
    mortarPosition.subscribe(p => { mPos = p; renderOverlay(); }),
    targetPosition.subscribe(p => { tPos = p; renderOverlay(); }),
    cursorPixel.subscribe(c => { cPixel = c; renderOverlay(); })
  ];

  onDestroy(() => {
    if (viewer) {
        viewer.removeHandler('animation', renderOverlay);
        viewer.removeHandler('zoom', renderOverlay);
    }
    unsubs.forEach(u => u());
  });
</script>

<div class="overlay-layer" aria-hidden="true"></div>

<style>
  .overlay-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  /* Optional: Global SVG styles */
  :global(.overlay-layer svg text) {
    font-family: sans-serif;
    user-select: none;
    paint-order: stroke;
    stroke: rgba(255, 255, 255, 0.8);
    stroke-width: 3px;
  }
</style>