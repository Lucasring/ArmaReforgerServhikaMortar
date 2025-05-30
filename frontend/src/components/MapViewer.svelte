<script>
  import { run, stopPropagation } from 'svelte/legacy';

  import { onMount } from "svelte";
  import OpenSeadragon from "openseadragon";
  import { MAP_SCALE_METERS_PER_PIXEL } from "../config/mortarConfig";


  
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
  let contextMenu;
  let contextMenuPosition = $state({ x: 0, y: 0 });
  let showContextMenu = $state(false);
  let isDragging = false;
  let lastClickTime = 0;
  let viewMapSize = { x: 0, y: 0 };

  onMount(() => {
    console.log("MapViewer mounted");

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
        maxZoomLevel: 10,
        springStiffness: 150,
      });

      console.log("OpenSeadragon viewer initialized");

      // Hook to loaded map
      viewer.addHandler("open", () => {
        const item = viewer.world.getItemAt(0);
        if (item) {
          viewMapSize = item.getContentSize();
          console.log("Map size:", viewMapSize);
        } else {
          console.warn("No map item loaded yet.");
        }
      });

      // Create SVG overlay
      overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.pointerEvents = "none";
      viewer.canvas.appendChild(overlay);

      // Add double-click handler to the viewer element
      viewerElement.addEventListener("dblclick", (event) => {
        console.log("Viewer double-clicked");
        const rect = viewerElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        contextMenuPosition = { x, y };
        showContextMenu = true;
      });

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
        console.log("Viewer is ready");
      });
    } catch (error) {
      console.error("Error initializing OpenSeadragon:", error);
    }

    // Add document click listener for closing menu
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  function updateOverlay() {
    if (!overlay || !viewer) {
      console.log("Cannot update overlay: overlay or viewer not ready");
      return;
    }

    let container = viewer.viewport.getContainerSize();
    console.log("Updating overlay with:", {
      selectedRing,
      container: container.x,
      pixels: 50.0 / MAP_SCALE_METERS_PER_PIXEL,
      ratio: (container.x / viewMapSize.x),
      adj: (50.0 / MAP_SCALE_METERS_PER_PIXEL) * (container.x / viewMapSize.x) / container.x,
      // hasMortarPosition: !!mortarPosition,
      // hasTargetPosition: !!targetPosition,
      // hasAmmoType: !!selectedAmmoType,
      // ringData: selectedAmmoType?.ballistics?.rings?.[selectedRing],
    });

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

    /// Calculate ranges in viewport screen space distance
    const minRangePixels = minRangeMeters * MAP_SCALE_METERS_PER_PIXEL;
    const maxRangePixels = maxRangeMeters * MAP_SCALE_METERS_PER_PIXEL;

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

  function handleMenuClick(type, event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Menu item clicked:", type);

    // Convert pixel coordinates to OpenSeadragon point format
    const pixel = new OpenSeadragon.Point(
      contextMenuPosition.x,
      contextMenuPosition.y,
    );
    const viewportPoint = viewer.viewport.pointFromPixel(pixel);

    if (type === "mortar") {
      console.log("Setting mortar position:", viewportPoint);
      mortarPosition = { x: viewportPoint.x, y: viewportPoint.y };
    } else if (type === "target") {
      console.log("Setting target position:", viewportPoint);
      targetPosition = { x: viewportPoint.x, y: viewportPoint.y };
    }

    updateOverlay();
    showContextMenu = false;
  }

  // Close menu when clicking outside
  function handleOutsideClick(event) {
    if (showContextMenu && !event.target.closest(".context-menu")) {
      showContextMenu = false;
    }
  }

  // Update overlay when mortar or ammo type changes
  run(() => {
    if (selectedMortarType && selectedAmmoType) {
      console.log("Mortar or ammo type changed, updating overlay");
      updateOverlay();
    }
  });

  // Update overlay when ring changes
  run(() => {
    if (selectedRing !== undefined) {
      console.log("Ring changed to:", selectedRing, "updating overlay");
      updateOverlay();
    }
  });

  // Update overlay when positions change
  run(() => {
    if (mortarPosition || targetPosition) {
      console.log("Position changed, updating overlay");
      updateOverlay();
    }
  });

  // Add and remove document click listener
  run(() => {
    if (showContextMenu) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
  });
</script>

<div class="map-container">
  <div id="map-viewer" bind:this={viewerElement}></div>
  {#if showContextMenu}
    <div
      class="context-menu"
      style="left: {contextMenuPosition.x}px; top: {contextMenuPosition.y}px;"
      role="menu"
    >
      <button
        type="button"
        class="menu-item"
        onclick={stopPropagation((e) => handleMenuClick("mortar", e))}
        role="menuitem"
      >
        Set Mortar Position
      </button>
      <button
        type="button"
        class="menu-item"
        onclick={stopPropagation((e) => handleMenuClick("target", e))}
        role="menuitem"
      >
        Set Target Position
      </button>
    </div>
  {/if}
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
