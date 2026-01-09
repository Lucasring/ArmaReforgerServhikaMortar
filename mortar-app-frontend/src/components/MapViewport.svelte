<script lang='ts'>
    import MapCanvas from './MapCanvas.svelte';
	import type OpenSeadragon from 'openseadragon';
    import type { Point, MapClickEvent } from '$lib/types';
    import { onMount } from 'svelte';
	import type { CanvasDoubleClickEvent } from 'openseadragon';

    // OpenseaDragon Viewer Instance
    let viewer : OpenSeadragon.Viewer | null = $state(null);

    // --- Event Handlers ---
    let map_click_event : MapClickEvent | null = $state(null)

    // --- Initial Mount & OpenSeadragon Initialization ---
    onMount(async () => {
        const OSD = (await import("openseadragon")).default;
        viewer = new OSD.Viewer({
                id : 'openseadragon-instance',
                prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
                tileSources: {
                    type: "image",
                    url: "/map.jpg",
                },
                showNavigationControl: false,
                gestureSettingsMouse: { clickToZoom: false },
                maxZoomLevel: 5,
                springStiffness: 150,
                clickTimeThreshold: 350,  // Default is 300, 350 is more forgiving
                clickDistThreshold: 10,   // Default is 5, 10 allows for slight finger/mouse shake
            });

        // --- Register Event Handlers ---
        viewer.addHandler('canvas-click', (e) => {
            const event : MouseEvent = e.originalEvent as MouseEvent
            map_click_event = {
                type : "click",
                position : {
                    x : event.clientX,
                    y : event.clientY
                }
            }
        });

        viewer.addHandler('canvas-double-click', (e : CanvasDoubleClickEvent) => {
            const event : MouseEvent = e.originalEvent as MouseEvent
            map_click_event = {
                type : "double-click",
                position : {
                    x : event.clientX,
                    y : event.clientY
                }
            }
        });
    });
    
</script>


<div class='w-screen h-screen'>
    <!-- Openseadragon Map -->
    <div 
        role="presentation"
        id='openseadragon-instance'  
        class="w-full h-full bg-black" 
        oncontextmenu={(e) => {e.preventDefault()}}>
    </div>
    <div class="absolute inset-0 pointer-events-none z-10">
        <MapCanvas map_click_event={map_click_event} osd_viewer={viewer}></MapCanvas>
    </div>
</div>