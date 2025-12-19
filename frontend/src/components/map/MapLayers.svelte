<script>
  import { onDestroy } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import { MAP_SCALE_METERS_PER_PIXEL } from '../../config/mortarConfig';
  import { viewerStore, overlayStore, mortarPosition, targetPosition } from '../../stores/mapStore.js';

  let selectedMortarType;
  let selectedAmmoType;
  export let selectedRing = 0;

  let viewer = null;
  let overlay = null;
  let viewMapSize = { x: 0 };

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

  function createRingPoints(radius, center_x, center_y) {
    if (!viewer) return [];
    const points = [];
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const point = new OpenSeadragon.Point(center_x + Math.cos(angle) * radius, center_y + Math.sin(angle) * radius);
      const screenPoint = viewer.viewport.pixelFromPoint(point);
      points.push(screenPoint);
    }
    return points;
  }

  function addRangeLabel(svg, rangeMeters, radius, position) {
    if (!viewer) return;
    const point = new OpenSeadragon.Point(position.x, position.y - radius);
    const screenPoint = viewer.viewport.pixelFromPoint(point);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', screenPoint.x);
    label.setAttribute('y', screenPoint.y - 5);
    label.setAttribute('fill', 'black');
    label.setAttribute('font-size', '12px');
    label.setAttribute('text-anchor', 'middle');
    label.textContent = `${Math.round(rangeMeters)}m`;
    svg.appendChild(label);
  }

  function drawMortar(svg) {
    if (!viewer || !mortarPos) return;
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
    if (mortarPos) {
      drawMortar(svg);
    }
    if (targetPos) {
      drawTarget(svg);
    }
  }

  onDestroy(() => {
    unsubViewer && unsubViewer();
    unsubOverlay && unsubOverlay();
    unsubMortar && unsubMortar();
    unsubTarget && unsubTarget();
  });
</script>

<!-- This component renders only into the viewer overlay element provided by the map store -->
<div aria-hidden="true"></div>
