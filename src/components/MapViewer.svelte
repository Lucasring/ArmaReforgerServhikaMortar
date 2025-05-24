<script>
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import { MAP_SCALE_METERS_PER_PIXEL } from '../config/mortarConfig';
  
  export let selectedMortarType;
  export let selectedAmmoType;
  export let selectedRing;
  
  // Export these variables so they can be used by parent components
  export let mortarPosition = null;
  export let targetPosition = null;
  
  let viewer;
  let overlay;
  let viewerElement;
  let contextMenu;
  let contextMenuPosition = { x: 0, y: 0 };
  let showContextMenu = false;
  let isDragging = false;
  let lastClickTime = 0;
  
  onMount(() => {
    console.log('MapViewer mounted');
    
    // Ensure the viewer element exists
    if (!viewerElement) {
      console.error('Viewer element not found');
      return;
    }
    
    try {
      viewer = OpenSeadragon({
        id: 'map-viewer',
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/',
        tileSources: {
          type: 'image',
          url: '/map.jpg'
        },
        showNavigationControl: true,
        showRotationControl: true,
        gestureSettingsMouse: {
          clickToZoom: false
        },
        debugMode: true,
        maxZoomLevel: 10,
        springStiffness: 150,
      });
      
      console.log('OpenSeadragon viewer initialized');
      
      // Create SVG overlay
      overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      viewer.canvas.appendChild(overlay);
      
      // Add double-click handler to the viewer element
      viewerElement.addEventListener('dblclick', (event) => {
        console.log('Viewer double-clicked');
        const rect = viewerElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        contextMenuPosition = { x, y };
        showContextMenu = true;
      });
      
      // Update overlay when view changes
      viewer.addHandler('animation', updateOverlay);
      viewer.addHandler('pan', updateOverlay);
      viewer.addHandler('zoom', updateOverlay);
      
      // Add error handler
      viewer.addHandler('tile-loaded-failed', (event) => {
        console.error('Tile load failed:', event);
      });
      
      // Add ready handler
      viewer.addHandler('ready', () => {
        console.log('Viewer is ready');
      });
      
    } catch (error) {
      console.error('Error initializing OpenSeadragon:', error);
    }

    // Add document click listener for closing menu
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  });
  
  function updateOverlay() {
    if (!overlay || !viewer) {
      console.log('Cannot update overlay: overlay or viewer not ready');
      return;
    }
    
    console.log('Updating overlay with:', {
      selectedRing,
      hasMortarPosition: !!mortarPosition,
      hasTargetPosition: !!targetPosition,
      hasAmmoType: !!selectedAmmoType,
      ringData: selectedAmmoType?.ballistics?.rings?.[selectedRing]
    });
    
    // Clear existing overlay
    overlay.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    overlay.appendChild(svg);
    
    if (mortarPosition) {
      const mortarPoint = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(mortarPosition.x, mortarPosition.y));
      const mortarCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      mortarCircle.setAttribute('cx', mortarPoint.x);
      mortarCircle.setAttribute('cy', mortarPoint.y);
      mortarCircle.setAttribute('r', '10');
      mortarCircle.setAttribute('fill', 'blue');
      mortarCircle.setAttribute('stroke', 'white');
      mortarCircle.setAttribute('stroke-width', '2');
      svg.appendChild(mortarCircle);
      
      // Draw range rings
      if (selectedAmmoType?.ballistics?.rings?.[selectedRing]) {
        const ringData = selectedAmmoType.ballistics.rings[selectedRing];
        console.log('Drawing rings for ring:', selectedRing, 'with data:', ringData);
        
        if (ringData && ringData.length > 0) {
          // Get min and max range from the ring data
          const minRangeMeters = Math.min(...ringData.map(point => point.range));
          const maxRangeMeters = Math.max(...ringData.map(point => point.range));
          console.log('Ring ranges:', { minRangeMeters, maxRangeMeters });
          
          // Convert meters to viewport coordinates
          const minRangePixels = minRangeMeters / MAP_SCALE_METERS_PER_PIXEL;
          const maxRangePixels = maxRangeMeters / MAP_SCALE_METERS_PER_PIXEL;
          
          // Convert to viewport coordinates using the container size
          const containerSize = viewer.viewport.getContainerSize();
          const SCALE_CORRECTION = 1.2875;
          const minRange = minRangePixels / (containerSize.x * 25 * SCALE_CORRECTION);
          const maxRange = maxRangePixels / (containerSize.x * 25 * SCALE_CORRECTION);
          
          console.log('Ring viewport ranges:', { minRange, maxRange });
          
          // Create and draw rings
          const createRingPoints = (radius) => {
            const points = [];
            const segments = 64;
            for (let i = 0; i < segments; i++) {
              const angle = (i / segments) * Math.PI * 2;
              const point = new OpenSeadragon.Point(
                mortarPosition.x + Math.cos(angle) * radius,
                mortarPosition.y + Math.sin(angle) * radius
              );
              const screenPoint = viewer.viewport.pixelFromPoint(point);
              points.push(screenPoint);
            }
            return points;
          };
          
          // Draw min range ring
          const minRingPoints = createRingPoints(minRange);
          const minRingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          minRingPath.setAttribute('d', `M ${minRingPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`);
          minRingPath.setAttribute('fill', 'none');
          minRingPath.setAttribute('stroke', 'rgba(0, 0, 255, 0.5)');
          minRingPath.setAttribute('stroke-width', '3');
          svg.appendChild(minRingPath);
          
          // Draw max range ring
          const maxRingPoints = createRingPoints(maxRange);
          const maxRingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          maxRingPath.setAttribute('d', `M ${maxRingPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`);
          maxRingPath.setAttribute('fill', 'none');
          maxRingPath.setAttribute('stroke', 'rgba(0, 0, 255, 0.5)');
          maxRingPath.setAttribute('stroke-width', '3');
          svg.appendChild(maxRingPath);
          
          // Add range labels
          const addRangeLabel = (rangeMeters, radius) => {
            const point = new OpenSeadragon.Point(
              mortarPosition.x,
              mortarPosition.y - radius
            );
            const screenPoint = viewer.viewport.pixelFromPoint(point);
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', screenPoint.x);
            label.setAttribute('y', screenPoint.y - 5);
            label.setAttribute('fill', 'white');
            label.setAttribute('font-size', '14px');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('stroke', 'black');
            label.setAttribute('stroke-width', '0.5');
            label.textContent = `${Math.round(rangeMeters)}m`;
            svg.appendChild(label);
          };
          
          addRangeLabel(minRangeMeters, minRange);
          addRangeLabel(maxRangeMeters, maxRange);
        }
      }
    }
    
    if (targetPosition) {
      const targetPoint = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(targetPosition.x, targetPosition.y));
      const targetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      targetCircle.setAttribute('cx', targetPoint.x);
      targetCircle.setAttribute('cy', targetPoint.y);
      targetCircle.setAttribute('r', '10');
      targetCircle.setAttribute('fill', 'red');
      targetCircle.setAttribute('stroke', 'white');
      targetCircle.setAttribute('stroke-width', '2');
      svg.appendChild(targetCircle);
      
      // Draw line between mortar and target
      if (mortarPosition) {
        const mortarPoint = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(mortarPosition.x, mortarPosition.y));
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', mortarPoint.x);
        line.setAttribute('y1', mortarPoint.y);
        line.setAttribute('x2', targetPoint.x);
        line.setAttribute('y2', targetPoint.y);
        line.setAttribute('stroke', 'rgba(255, 0, 0, 0.5)');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    }
  }
  
  function handleMenuClick(type, event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Menu item clicked:', type);
    
    // Convert pixel coordinates to OpenSeadragon point format
    const pixel = new OpenSeadragon.Point(contextMenuPosition.x, contextMenuPosition.y);
    const viewportPoint = viewer.viewport.pointFromPixel(pixel);
    
    if (type === 'mortar') {
      console.log('Setting mortar position:', viewportPoint);
      mortarPosition = { x: viewportPoint.x, y: viewportPoint.y };
    } else if (type === 'target') {
      console.log('Setting target position:', viewportPoint);
      targetPosition = { x: viewportPoint.x, y: viewportPoint.y };
    }
    
    updateOverlay();
    showContextMenu = false;
  }
  
  // Close menu when clicking outside
  function handleOutsideClick(event) {
    if (showContextMenu && !event.target.closest('.context-menu')) {
      showContextMenu = false;
    }
  }
  
  // Update overlay when mortar or ammo type changes
  $: if (selectedMortarType && selectedAmmoType) {
    console.log('Mortar or ammo type changed, updating overlay');
    updateOverlay();
  }
  
  // Update overlay when ring changes
  $: if (selectedRing !== undefined) {
    console.log('Ring changed to:', selectedRing, 'updating overlay');
    updateOverlay();
  }
  
  // Update overlay when positions change
  $: if (mortarPosition || targetPosition) {
    console.log('Position changed, updating overlay');
    updateOverlay();
  }
  
  // Add and remove document click listener
  $: if (showContextMenu) {
    document.addEventListener('click', handleOutsideClick);
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
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
        on:click|stopPropagation={(e) => handleMenuClick('mortar', e)}
        role="menuitem"
      >
        Set Mortar Position
      </button>
      <button 
        type="button"
        class="menu-item" 
        on:click|stopPropagation={(e) => handleMenuClick('target', e)}
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