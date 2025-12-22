<script>
  import { onMount, onDestroy } from "svelte";
  import OpenSeadragon from "openseadragon";
  import MapControls from "./map/MapControls.svelte";
  import MapLayers from "./map/MapLayers.svelte";
  import { 
    mortarPosition as mortarStore, 
    targetPosition as targetStore, 
    setCursorFromPixel,
    setViewer
  } from '../stores/mapStore.js';

  let {
    selectedMortarType,
    selectedAmmoType,
    selectedRing,
    mortarPosition = $bindable(null),
    targetPosition = $bindable(null)
  } = $props();

  let viewer;
  let viewerElement = $state();
  let controlsRef;

  onMount(() => {
    if (!viewerElement) return;

    viewer = OpenSeadragon({
      id: "map-viewer",
      prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/",
      tileSources: {
        type: "image",
        url: "/map.jpg",
      },
      showNavigationControl: true,
      gestureSettingsMouse: { clickToZoom: false },
      maxZoomLevel: 50,
      springStiffness: 150,
    });

    // Register viewer with global store
    setViewer(viewer, viewerElement);

    // Double click for context menu
    const handleDblClick = (event) => {
      const rect = viewerElement.getBoundingClientRect();
      controlsRef?.openMenu({ 
        x: event.clientX - rect.left, 
        y: event.clientY - rect.top 
      });
    };

    // Track cursor
    const handleMouseMove = (event) => {
      const rect = viewerElement.getBoundingClientRect();
      setCursorFromPixel({ 
        x: event.clientX - rect.left, 
        y: event.clientY - rect.top 
      });
    };

    const handleMouseLeave = () => setCursorFromPixel(null);

    viewerElement.addEventListener("dblclick", handleDblClick);
    viewerElement.addEventListener('mousemove', handleMouseMove);
    viewerElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      viewerElement.removeEventListener("dblclick", handleDblClick);
      viewerElement.removeEventListener('mousemove', handleMouseMove);
      viewerElement.removeEventListener('mouseleave', handleMouseLeave);
      viewer.destroy();
    };
  });

  // Sync props with global store
  const unsubMortar = mortarStore.subscribe(p => { mortarPosition = p; });
  const unsubTarget = targetStore.subscribe(p => { targetPosition = p; });

  onDestroy(() => {
    unsubMortar();
    unsubTarget();
  });
</script>

<div class="map-container">
  <div id="map-viewer" bind:this={viewerElement}></div>
  <MapControls bind:this={controlsRef} />
  <MapLayers 
    {selectedMortarType} 
    {selectedAmmoType} 
    {selectedRing} 
  />
</div>

<style>
  .map-container, #map-viewer {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .map-container { background: #333; }
</style>