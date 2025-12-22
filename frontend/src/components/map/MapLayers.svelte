<script lang="ts">
  import { onDestroy } from 'svelte';
  import * as OpenSeadragon from 'openseadragon';
  import { MAP_SCALE_METERS_PER_PIXEL } from '../../config/mortarConfig';
  import { viewerStore, overlayStore, mortarPosition, targetPosition, cursorPixel, cursorWorld, pointFromPixel } from '../../stores/mapStore.js';
  import * as Utils from './MapUtils'

  export let selectedMortarType;
  export let selectedAmmoType;
  export let selectedRing = 0;

  // Re-render overlay when parent props change
  $: if (typeof selectedMortarType !== 'undefined' || typeof selectedAmmoType !== 'undefined' || typeof selectedRing !== 'undefined') {
    try { renderOverlay(); } catch (e) { /* ignore */ }
  }

  let viewer : any = null;
  let overlay : any = null;
  let viewMapSize : any = { x: 0 };

  const unsubViewer = viewerStore.subscribe((v) => {
    viewer = v;
    if (viewer) renderOverlay();
  });

  const unsubOverlay = overlayStore.subscribe((o) => {
    overlay = o;
    if (overlay) renderOverlay();
  });

  let mortarPos = null;
  let targetPos = null;
  const unsubMortar = mortarPosition.subscribe((p) => {
    mortarPos = p;
    renderOverlay();
  });

  const unsubTarget = targetPosition.subscribe((p) => {
    targetPos = p;
    renderOverlay();
  });

  let cursorPixelValue = null;
  let cursorWorldValue = null;
  const unsubCursorPixel = cursorPixel.subscribe((c) => {
    cursorPixelValue = c;
    renderOverlay();
  });

  const unsubCursorWorld = cursorWorld.subscribe((c) => {
    cursorWorldValue = c;
    renderOverlay();
  });

  function createRingPoints(radius, center_x, center_y) {
    if (!viewer) return [];
    const points = [];
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      try {
        const angle = (i / segments) * Math.PI * 2;
        const point = new OpenSeadragon.Point(center_x + Math.cos(angle) * radius, center_y + Math.sin(angle) * radius);
        const screenPoint = viewer.viewport && typeof viewer.viewport.pixelFromPoint === 'function'
          ? viewer.viewport.pixelFromPoint(point)
          : null;
        if (screenPoint && Number.isFinite(screenPoint.x) && Number.isFinite(screenPoint.y)) {
          points.push(screenPoint);
        }
      } catch (e) {
        // ignore individual point errors and continue
      }
    }
    return points;
  }

  function addRangeLabel(svg, rangeMeters, radius, position) {
    if (!viewer) return;
    try {
      const point = new OpenSeadragon.Point(position.x, position.y - radius);
      const screenPoint = viewer.viewport && typeof viewer.viewport.pixelFromPoint === 'function'
        ? viewer.viewport.pixelFromPoint(point)
        : null;
      if (!screenPoint || !Number.isFinite(screenPoint.x) || !Number.isFinite(screenPoint.y)) return;
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', screenPoint.x);
      label.setAttribute('y', screenPoint.y - 5);
      label.setAttribute('fill', 'black');
      label.setAttribute('font-size', '12px');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = `${Math.round(rangeMeters)}m`;
      svg.appendChild(label);
    } catch (e) {
      console.debug('addRangeLabel error', e);
    }
  }

  function drawMortar(svg) {
    if (!viewer || !mortarPos) return;
    try {
      if (typeof console !== 'undefined' && console.debug) console.debug('[MapLayers] drawMortar', { mortarPos });
    } catch (e) {}
    const mortarPoint = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(mortarPos.x, mortarPos.y));
    const mortarCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    mortarCircle.setAttribute('cx', mortarPoint.x);
    mortarCircle.setAttribute('cy', mortarPoint.y);
    mortarCircle.setAttribute('r', '5');
    mortarCircle.setAttribute('fill', 'blue');
    mortarCircle.setAttribute('stroke', 'white');
    mortarCircle.setAttribute('stroke-width', '2');
    svg.appendChild(mortarCircle);
  }

  function drawTarget(svg) {
    if (!viewer || !targetPos) return;
    try {
      if (typeof console !== 'undefined' && console.debug) console.debug('[MapLayers] drawTarget', { targetPos });
    } catch (e) {}
    const targetPoint = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(targetPos.x, targetPos.y));
    const targetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    targetCircle.setAttribute('cx', targetPoint.x);
    targetCircle.setAttribute('cy', targetPoint.y);
    targetCircle.setAttribute('r', '5');
    targetCircle.setAttribute('fill', 'red');
    targetCircle.setAttribute('stroke', 'white');
    targetCircle.setAttribute('stroke-width', '2');
    svg.appendChild(targetCircle);
  }

  function drawRangeRings(svg) {
    try {
      if (!viewer || !mortarPos) return;
      if (typeof console !== 'undefined' && console.debug) console.debug('[MapLayers] drawRangeRings start', { selectedAmmoTypePresent: !!selectedAmmoType, selectedRing, mortarPos });
      if (!selectedAmmoType?.ballistics?.rings?.[selectedRing]) return;
      const ringData = selectedAmmoType.ballistics.rings[selectedRing];
      if (!ringData || ringData.length === 0) return;

      const minRangeMeters = Math.min(...ringData.map((p) => p.range));
      const maxRangeMeters = Math.max(...ringData.map((p) => p.range));

      const containerSize = viewer.viewport.getContainerSize();
      if (!viewMapSize || !viewMapSize.x || containerSize.x === 0) return;
      const RATIO_VIEWPORT_TO_CONTAINER = (containerSize.x / viewMapSize.x);

      const minRangePixels = minRangeMeters * MAP_SCALE_METERS_PER_PIXEL * 1.333333;
      const maxRangePixels = maxRangeMeters * MAP_SCALE_METERS_PER_PIXEL * 1.333333;

      const minRange = minRangePixels * RATIO_VIEWPORT_TO_CONTAINER / containerSize.x;
      const maxRange = maxRangePixels * RATIO_VIEWPORT_TO_CONTAINER / containerSize.x;

      const minRingPoints = createRingPoints(minRange, mortarPos.x, mortarPos.y);
      try { if (typeof console !== 'undefined' && console.debug) console.debug('[MapLayers] minRingPoints', { minRange, minRingPointsLength: minRingPoints.length }); } catch (e) {}
      if (minRingPoints.length > 0) {
        const minRingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        minRingPath.setAttribute('d', `M ${minRingPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`);
        minRingPath.setAttribute('fill', 'none');
        minRingPath.setAttribute('stroke', 'rgba(0, 0, 255, 0.5)');
        minRingPath.setAttribute('stroke-width', '3');
        svg.appendChild(minRingPath);
      }

      const maxRingPoints = createRingPoints(maxRange, mortarPos.x, mortarPos.y);
      try { if (typeof console !== 'undefined' && console.debug) console.debug('[MapLayers] maxRingPoints', { maxRange, maxRingPointsLength: maxRingPoints.length }); } catch (e) {}
      if (maxRingPoints.length > 0) {
        const maxRingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        maxRingPath.setAttribute('d', `M ${maxRingPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`);
        maxRingPath.setAttribute('fill', 'none');
        maxRingPath.setAttribute('stroke', 'rgba(0, 0, 255, 0.5)');
        maxRingPath.setAttribute('stroke-width', '3');
        svg.appendChild(maxRingPath);
      }

      addRangeLabel(svg, minRangeMeters, minRange, mortarPos);
      addRangeLabel(svg, maxRangeMeters, maxRange, mortarPos);
    } catch (e) {
      console.debug('drawRangeRings error', e);
    }
  }

  function drawDispersionRing(svg) {
    if (!viewer || !targetPos) return;
    if (!selectedAmmoType?.ballistics?.dispersions?.[selectedRing]) return;
    const dispersionData = selectedAmmoType.ballistics.dispersions[selectedRing];
    const containerSize = viewer.viewport.getContainerSize();
    const RATIO_VIEWPORT_TO_CONTAINER = (containerSize.x / viewMapSize.x);
    const dispersionRangePixels = dispersionData * MAP_SCALE_METERS_PER_PIXEL;
    const dispersionRange = dispersionRangePixels * RATIO_VIEWPORT_TO_CONTAINER / containerSize.x;

    const dispersionRingPoints = createRingPoints(dispersionRange, targetPos.x, targetPos.y);
    const dispersionRingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    dispersionRingPath.setAttribute('d', `M ${dispersionRingPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`);
    dispersionRingPath.setAttribute('fill', 'rgba(255, 0, 0, 0.25)');
    dispersionRingPath.setAttribute('stroke', 'rgba(255, 0, 0, 0.5)');
    dispersionRingPath.setAttribute('stroke-width', '3');
    svg.appendChild(dispersionRingPath);

    addRangeLabel(svg, dispersionData, dispersionRange, targetPos);
  }

  function drawLine(svg) {
    if (!viewer || !mortarPos || !targetPos) return;
    const mortarPoint = viewer.viewport.pixelFromPoint({x : mortarPos.x, y : mortarPos.y});
    const targetPoint = viewer.viewport.pixelFromPoint({x : targetPos.x, y : targetPos.y});
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', mortarPoint.x);
    line.setAttribute('y1', mortarPoint.y);
    line.setAttribute('x2', targetPoint.x);
    line.setAttribute('y2', targetPoint.y);
    line.setAttribute('stroke', 'rgba(255, 0, 0, 0.5)');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  }

  // function drawLine(svg, p1 : Utils.Point, p2 : Utils.Point) {
  //   if (!viewer || !mortarPos || !targetPos) return;
  //   const mortarPoint = viewer.viewport.pixelFromPoint({x : mortarPos.x, y : mortarPos.y});
  //   const targetPoint = viewer.viewport.pixelFromPoint({x : targetPos.x, y : targetPos.y});
  //   const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  //   line.setAttribute('x1', mortarPoint.x);
  //   line.setAttribute('y1', mortarPoint.y);
  //   line.setAttribute('x2', targetPoint.x);
  //   line.setAttribute('y2', targetPoint.y);
  //   line.setAttribute('stroke', 'rgba(255, 0, 0, 0.5)');
  //   line.setAttribute('stroke-width', '2');
  //   svg.appendChild(line);
  // }

  function renderOverlay() {

    if (!overlay || !viewer) return;

    const item = viewer.world && typeof viewer.world.getItemAt === 'function' ? viewer.world.getItemAt(0) : null;
    if (item && typeof item.getContentSize === 'function') {
      viewMapSize = item.getContentSize();
    }

    overlay.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    overlay.appendChild(svg);

    // Draw the mortar position if defined
    if (mortarPos) {
      drawMortar(svg);
      drawRangeRings(svg);
    }

    // Draw the target position if defined
    if (targetPos) {
      drawTarget(svg);
      drawDispersionRing(svg);
      drawLine(svg);
    }

    // draw cursor crosshair and grid label if present
    if (typeof cursorPixelValue !== 'undefined' && cursorPixelValue && svg) {
      const cxRaw = Number(cursorPixelValue.x);
      const cyRaw = Number(cursorPixelValue.y);
      const rect = overlay.getBoundingClientRect ? overlay.getBoundingClientRect() : { width: 0, height: 0 };
      const width = rect.width || overlay.clientWidth || 0;
      const height = rect.height || overlay.clientHeight || 0;

      // determine world coordinates first (may be from store or conversion)
      let world = cursorWorldValue;
      if (!world) {
        try {
          const wp = pointFromPixel(cursorPixelValue);
          if (wp) {
            world = { x: wp.x, y: wp.y };
          }
        } catch (e) {
          // ignore conversion errors
        }
      }

      // compute screen coords aligned with viewer's pixelFromPoint if possible
      let screenX = cxRaw;
      let screenY = cyRaw;
      if (world && viewer && typeof viewer.viewport?.pixelFromPoint === 'function') {
        try {
          const sp = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(world.x, world.y));
          if (sp) {
            screenX = sp.x;
            screenY = sp.y;
          }
        } catch (e) {
          // ignore and fall back to raw cursor pixel
        }
      }

      // Draw the Horizontal line
      const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hLine.setAttribute('x1', '0');
      hLine.setAttribute('y1', String(screenY));
      hLine.setAttribute('x2', String(width));
      hLine.setAttribute('y2', String(screenY));
      hLine.setAttribute('stroke', 'orange');
      hLine.setAttribute('stroke-width', '1');
      hLine.setAttribute('stroke-opacity', '0.9');
      svg.appendChild(hLine);

      // Draw the Vertical line
      const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      vLine.setAttribute('x1', String(screenX));
      vLine.setAttribute('y1', '0');
      vLine.setAttribute('x2', String(screenX));
      vLine.setAttribute('y2', String(height));
      vLine.setAttribute('stroke', 'orange');
      vLine.setAttribute('stroke-width', '1');
      vLine.setAttribute('stroke-opacity', '0.9');
      svg.appendChild(vLine);

      // Debug: log cursor values and draw a small dot to verify cursor rendering
      const cursorDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cursorDot.setAttribute('cx', String(screenX));
      cursorDot.setAttribute('cy', String(screenY));
      cursorDot.setAttribute('r', '3');
      cursorDot.setAttribute('fill', 'orange');
      cursorDot.setAttribute('pointer-events', 'none');
      svg.appendChild(cursorDot);

      if (world) {
        // `world` contains viewer/world coordinates (not raw image pixels).
        // Convert to image pixels using the loaded image size, then to meters.
        const imageX = (typeof viewMapSize.x === 'number') ? world.x * viewMapSize.x : world.x;
        // Flip Y so origin is bottom-left: world.y is measured from top, convert to image pixels from bottom
        const imageY = (typeof viewMapSize.y === 'number') ? ((1 - world.y) * viewMapSize.y) : world.y;
        const metersX = imageX * MAP_SCALE_METERS_PER_PIXEL;
        const metersY = imageY * MAP_SCALE_METERS_PER_PIXEL;
        const gridX = Math.floor(metersX / 10);
        const gridY = Math.floor(metersY / 10);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // place label slightly offset from cursor (use screen coords)
        const labelX = Math.min(screenX + 10, (overlay.clientWidth || width) - 10);
        const labelY = Math.max(screenY - 10, 14);
        label.setAttribute('x', String(labelX));
        label.setAttribute('y', String(labelY));
        label.setAttribute('fill', 'orange');
        label.setAttribute('font-size', '14px');
        label.setAttribute('pointer-events', 'none');
        // Format as `{COL} {ROW}` — show column then row (Y X)
        label.textContent = `0${gridX} 0${gridY}`;
        svg.appendChild(label);
      }
    }
  }

  onDestroy(() => {
    unsubViewer && unsubViewer();
    unsubOverlay && unsubOverlay();
    unsubMortar && unsubMortar();
    unsubTarget && unsubTarget();
    unsubCursorPixel && unsubCursorPixel();
    unsubCursorWorld && unsubCursorWorld();
  });
</script>

<!-- This component renders only into the viewer overlay element provided by the map store -->
<div aria-hidden="true"></div>
