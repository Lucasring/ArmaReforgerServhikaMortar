<script>
  import { run, stopPropagation } from 'svelte/legacy';

  import { onMount } from "svelte";
  import OpenSeadragon from "openseadragon";
  import { MAP_SCALE_METERS_PER_PIXEL } from "../config/mortarConfig";
  import MapControls from "./map/MapControls.svelte";
  import MapLayers from "./map/MapLayers.svelte";

  let MapLayerInstance;

  /**
   * @typedef {Object} Props
   * @property {any} selectedMortarType
   * @property {any} selectedAmmoType
   * @property {any} selectedRing
   * @property {any} [mortarPosition] - Export these variables so they can be used by parent components
   * @property {any} [targetPosition]
   */

  /** @type {Props} */
  let {
    selectedMortarType,
    selectedAmmoType,
    selectedRing,
    mortarPosition = $bindable(null),
    targetPosition = $bindable(null)
  } = $props();

  let viewer;
  let overlay;
  let viewerElement = $state();
  let controlsRef;
  let isDragging = false;
  let lastClickTime = 0;
  let viewMapSize = { x: 0, y: 0 };

  onMount(async () => {
    ;

    // Ensure the viewer element exists
    if (!viewerElement) {
      console.error("Viewer element not found");
      return;
    }

    try {
      viewer = OpenSeadragon({
        id: "map-viewer",
        prefixUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/",
        tileSources: {
          type: "image",
          url: "/map.jpg",
        },
        showNavigationControl: true,
        showRotationControl: true,
        gestureSettingsMouse: {
          clickToZoom: false,
        },
        debugMode: true,
        maxZoomLevel: 50,
        springStiffness: 150,
      });

      // Register the created viewer with the central mapStore so helpers
      // (pointFromPixel, setMortarPositionFromPixel, etc.) operate on the
      // same viewer instance.
      try {
        const { setViewer } = await import("../stores/mapStore.js");
        setViewer(viewer, viewerElement);
      } catch (e) {
        // import may fail in some build contexts; log and continue
        console.warn('Could not register viewer with mapStore:', e);
      }

      ;

      // Hook to loaded map
      viewer.addHandler("open", () => {
        const item = viewer.world.getItemAt(0);
        if (item) {
          viewMapSize = item.getContentSize();
          // console.log("Map size:", viewMapSize);
        } else {
          console.warn("No map item loaded yet.");
        }
      });

      // NOTE: overlay creation/attachment is handled by the central mapStore
      // when we call setViewer(viewer, viewerElement). Subscribe to the
      // overlayStore so we always draw into the store-provided overlay.

      // Add double-click handler to the viewer element
      viewerElement.addEventListener("dblclick", (event) => {
        const rect = viewerElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // delegate to MapControls component
        controlsRef && controlsRef.openMenu({ x, y });
      });

      // Mouse move for cursor overlay
      const _onMouseMove = (event) => {
        const rect = viewerElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        try {
          setCursorFromPixel({ x, y });
        } catch (e) {
          console.warn('setCursorFromPixel failed', e);
        }
      };

      const _onMouseLeave = () => {
        try { setCursorFromPixel(null); } catch (e) { }
      };

      // Attach listeners for mouse
      viewerElement.addEventListener('mousemove', _onMouseMove);
      viewerElement.addEventListener('mouseleave', _onMouseLeave);

      // Update overlay when view changes
      viewer.addHandler("animation", updateOverlay);
      viewer.addHandler("pan", updateOverlay);
      viewer.addHandler("zoom", updateOverlay);

      // Add error handler
      viewer.addHandler("tile-loaded-failed", (event) => {
        console.error("Tile load failed:", event);
      });

      // Add ready handler
      viewer.addHandler("ready", () => {
        ;
      });
    } catch (error) {
      console.error("Error initializing OpenSeadragon:", error);
    }

    // Clean up mouse listeners when component unmounts
    return () => {
      viewerElement.removeEventListener('mousemove', _onMouseMove);
      viewerElement.removeEventListener('mouseleave', _onMouseLeave);
    };
  });

  // Subscribe to central map store positions and overlay so menu actions
  // (which update the store) cause this component to redraw overlays.
  import { onDestroy } from 'svelte';
  import { overlayStore, mortarPosition as mortarStore, targetPosition as targetStore, setCursorFromPixel } from '../stores/mapStore.js';

  let _unsubOverlay = null;
  let _unsubMortar = null;
  let _unsubTarget = null;

  // subscribe immediately (if mapStore already has values this will sync)
  _unsubOverlay = overlayStore.subscribe((o) => {
    overlay = o;
    updateOverlay();
  });

  _unsubMortar = mortarStore.subscribe((p) => {
    mortarPosition = p;
    updateOverlay();
  });

  _unsubTarget = targetStore.subscribe((p) => {
    targetPosition = p;
    updateOverlay();
  });

  onDestroy(() => {
    _unsubOverlay && _unsubOverlay();
    _unsubMortar && _unsubMortar();
    _unsubTarget && _unsubTarget();
  });

  function updateOverlay() {
    if (!overlay || !viewer) {
      ;
      return;
    }

    let container = viewer.viewport.getContainerSize();

    overlay.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    overlay.appendChild(svg);

    if (mortarPosition) {
      drawMortar(svg);
      drawRangeRings(svg);
    }
    if (targetPosition) {
      drawTarget(svg);
      drawDispersionRing(svg);
      drawLine(svg);
    }
  }

  function createRingPoints(radius, center_x, center_y) {
    const points = [];
    const segments = 64;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const point = new OpenSeadragon.Point(
        center_x + Math.cos(angle) * radius,
        center_y + Math.sin(angle) * radius,
      );
      const screenPoint = viewer.viewport.pixelFromPoint(point);
      points.push(screenPoint);
    }
    return points;
  }

  function addRangeLabel(svg, rangeMeters, radius, position) {
    const point = new OpenSeadragon.Point(position.x, position.y - radius);
    const screenPoint = viewer.viewport.pixelFromPoint(point);
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("x", screenPoint.x);
    label.setAttribute("y", screenPoint.y - 5);
    label.setAttribute("fill", "black");
    label.setAttribute("font-size", "18px");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("stroke", "black");
    label.setAttribute("stroke-width", "0.5");
    label.textContent = `${Math.round(rangeMeters)}m`;
    svg.appendChild(label);
  }

  function drawMortar(svg) {
    const mortarPoint = viewer.viewport.pixelFromPoint(
      new OpenSeadragon.Point(mortarPosition.x, mortarPosition.y),
    );
    const mortarCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    mortarCircle.setAttribute("cx", mortarPoint.x);
    mortarCircle.setAttribute("cy", mortarPoint.y);
    mortarCircle.setAttribute("r", "5");
    mortarCircle.setAttribute("fill", "blue");
    mortarCircle.setAttribute("stroke", "white");
    mortarCircle.setAttribute("stroke-width", "2");
    svg.appendChild(mortarCircle);
  }

  function drawRangeRings(svg) {

    // Get the range data for the selected ring
    if (!selectedAmmoType?.ballistics?.rings?.[selectedRing]) return;
    const ringData = selectedAmmoType.ballistics.rings[selectedRing];
    if (!ringData || ringData.length === 0) return;

    /// Calculate the min and max range
    const minRangeMeters = Math.min(...ringData.map((point) => point.range));
    const maxRangeMeters = Math.max(...ringData.map((point) => point.range));

    /// Calculate the viewport to container space ratio
    const containerSize = viewer.viewport.getContainerSize();
    const RATIO_VIEWPORT_TO_CONTAINER = (containerSize.x / viewMapSize.x);

    /// Calculate ranges in viewport screen space distance / 1.333333 is adjustment factor from map
    const minRangePixels = minRangeMeters * MAP_SCALE_METERS_PER_PIXEL * 1.333333;
    const maxRangePixels = maxRangeMeters * MAP_SCALE_METERS_PER_PIXEL * 1.333333;

    /// Calculate the min/max ranges as a ratio of container space width
    const minRange = minRangePixels * RATIO_VIEWPORT_TO_CONTAINER / containerSize.x;
    const maxRange = maxRangePixels * RATIO_VIEWPORT_TO_CONTAINER / containerSize.x;

    // Draw the min range ring
    const minRingPoints = createRingPoints(
      minRange,
      mortarPosition.x,
      mortarPosition.y,
    );
    const minRingPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    minRingPath.setAttribute(
      "d",
      `M ${minRingPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`,
    );
    minRingPath.setAttribute("fill", "none");
    minRingPath.setAttribute("stroke", "rgba(0, 0, 255, 0.5)");
    minRingPath.setAttribute("stroke-width", "3");
    svg.appendChild(minRingPath);

    // Draw the max range ring
    const maxRingPoints = createRingPoints(
      maxRange,
      mortarPosition.x,
      mortarPosition.y,
    );
    const maxRingPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    maxRingPath.setAttribute(
      "d",
      `M ${maxRingPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`,
    );
    maxRingPath.setAttribute("fill", "none");
    maxRingPath.setAttribute("stroke", "rgba(0, 0, 255, 0.5)");
    maxRingPath.setAttribute("stroke-width", "3");
    svg.appendChild(maxRingPath);
    
    // Add range labels
    addRangeLabel(svg, minRangeMeters, minRange, mortarPosition);
    addRangeLabel(svg, maxRangeMeters, maxRange, mortarPosition);
  }

  function drawTarget(svg) {
    // Draw the Target Position
    const targetPoint = viewer.viewport.pixelFromPoint(
      new OpenSeadragon.Point(targetPosition.x, targetPosition.y),
    );
    const targetCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    targetCircle.setAttribute("cx", targetPoint.x);
    targetCircle.setAttribute("cy", targetPoint.y);
    targetCircle.setAttribute("r", "5");
    targetCircle.setAttribute("fill", "red");
    targetCircle.setAttribute("stroke", "white");
    targetCircle.setAttribute("stroke-width", "2");
    svg.appendChild(targetCircle);
  }

  function drawDispersionRing(svg) {
    // Get the dispersion data for the selected ring
    if (!selectedAmmoType?.ballistics?.dispersions?.[selectedRing]) return;

    // Get the dispersion data from the config
    const dispersionData = selectedAmmoType.ballistics.dispersions[selectedRing];

    /// Calculate the viewport to container space ratio
    const containerSize = viewer.viewport.getContainerSize();
    const RATIO_VIEWPORT_TO_CONTAINER = (containerSize.x / viewMapSize.x);

    /// Calculate ranges in viewport screen space distance
    const dispersionRangePixels = dispersionData * MAP_SCALE_METERS_PER_PIXEL;

    /// Calculate the min/max ranges as a ratio of container space width
    const dispersionRange = dispersionRangePixels * RATIO_VIEWPORT_TO_CONTAINER / containerSize.x;

    // Draw the dispersion ring
    const dispersionRingPoints = createRingPoints(
      dispersionRange,
      targetPosition.x,
      targetPosition.y,
    );
    const dispersionRingPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    dispersionRingPath.setAttribute(
      "d",
      `M ${dispersionRingPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`,
    );
    dispersionRingPath.setAttribute("fill", "rgba(255, 0, 0, 0.25)");
    dispersionRingPath.setAttribute("stroke", "rgba(255, 0, 0, 0.5)");
    dispersionRingPath.setAttribute("stroke-width", "3");
    svg.appendChild(dispersionRingPath);

    // Add range labels
    addRangeLabel(svg, dispersionData, dispersionRange, targetPosition);
  }

  function drawLine(svg) {
    if (!mortarPosition || !targetPosition) return;
    const mortarPoint = viewer.viewport.pixelFromPoint(
      new OpenSeadragon.Point(mortarPosition.x, mortarPosition.y),
    );
    const targetPoint = viewer.viewport.pixelFromPoint(
      new OpenSeadragon.Point(targetPosition.x, targetPosition.y),
    );
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", mortarPoint.x);
    line.setAttribute("y1", mortarPoint.y);
    line.setAttribute("x2", targetPoint.x);
    line.setAttribute("y2", targetPoint.y);
    line.setAttribute("stroke", "rgba(255, 0, 0, 0.5)");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }

  // Context menu behavior moved into MapControls component

  // Update overlay when mortar or ammo type changes
  run(() => {
    if (selectedMortarType && selectedAmmoType) {
      ;
      updateOverlay();
    }
  });

  // Update overlay when ring changes
  run(() => {
    if (selectedRing !== undefined) {
      ;
      updateOverlay();
    }
  });

  // Update overlay when positions change
  run(() => {
    if (mortarPosition || targetPosition) {
      ;
      updateOverlay();
    }
  });

  // MapControls handles its own outside-click behavior
</script>

  <div class="map-container">
    <div id="map-viewer" bind:this={viewerElement}></div>
    <MapControls bind:this={controlsRef} />
    <MapLayers bind:this={MapLayerInstance} {selectedMortarType} {selectedAmmoType} {selectedRing} />
  </div>

  <style>
  .map-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: #333; /* Add a background color to make it visible */
  }

  #map-viewer {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .context-menu {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #666;
    border-radius: 4px;
    padding: 5px 0;
    min-width: 150px;
    z-index: 1000;
  }

  .menu-item {
    display: block;
    width: 100%;
    padding: 8px 12px;
    color: white;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .menu-item:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
  }
</style>
