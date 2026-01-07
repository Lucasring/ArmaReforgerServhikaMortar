<script lang='ts'>
	import type OpenSeadragon from 'openseadragon';
    import { onMount } from 'svelte';

    function viewportClickHandler(event : OpenSeadragon.CanvasClickEvent) {
        if (event.quick) {
            console.log("Action: ", event.position)
        }
    }

    onMount(async () => {
        const OSD = (await import("openseadragon")).default;
        const viewer : OpenSeadragon.Viewer = new OSD.Viewer({
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
        viewer.addHandler('canvas-click', viewportClickHandler);
    });

</script>

<div class='w-screen h-screen'>
    <div id='openseadragon-instance'  class="w-full h-full bg-black"></div>
</div>