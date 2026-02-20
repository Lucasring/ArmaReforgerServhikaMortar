<script lang="ts">
    
    export const ssr = false;

    // --- Custom Types ---
    interface Props {
        osd_viewer : OpenSeadragon.Viewer | null;
    }

    // --- Imports ---
	import { pageToWorldMeters } from '$lib/map/map_primatives';
    import OpenSeadragon from 'openseadragon';
	import { MAP_SCALE_METERS_PER_PIXEL } from '$lib/mortar_config';
	import { getMortarState, MortarState } from '$lib/mortar_state.svelte';
    
    // Canvas Layers
    import MortarLayer from '@components/map/canvas_layers/MortarLayer.svelte';
    import TargetLayer from '@components/map/canvas_layers/TargetLayer.svelte';
    import CrosshairLayer from '@components/map/canvas_layers/CrosshairLayer.svelte';
    import SessionTargetLayer from '@components/map/canvas_layers/SessionTargetLayer.svelte';

    // --- Variables ---
    let { osd_viewer } : Props = $props();
    let mortar_state : MortarState = getMortarState();
    let canvas_element : SVGSVGElement | null = $state(null);
    let map_dimensions = $derived.by(() => {
        if (osd_viewer) {
            const osd_world = osd_viewer.world.getItemAt(0);
            return {
                x : osd_world?.getContentSize().x,
                y : osd_world?.getContentSize().y,
            }
        }
    });

    // MapCanvas load effect
    $effect(() => {
        if (!osd_viewer) return;

        const setupOverlay = () => {
            if (!osd_viewer) return;

            const worldItem = osd_viewer.world.getItemAt(0);

            if (canvas_element && worldItem) {
                const image_size = worldItem.getContentSize();
                
                // Set coordinate system to match map pixels
                const map_size_x = image_size.x * MAP_SCALE_METERS_PER_PIXEL;
                const map_size_y = image_size.y * MAP_SCALE_METERS_PER_PIXEL
                canvas_element.setAttribute('viewBox', `0 0 ${map_size_x} ${map_size_y}`);

                // Prevent duplicate overlays
                if (!osd_viewer.getOverlayById(canvas_element)) {
                    osd_viewer.addOverlay({
                        element: canvas_element,
                        location: new OpenSeadragon.Rect(0, 0, 1, image_size.y / image_size.x)
                    });
                }
            }
        };

        // If the viewer is already open (hot reload case), run immediately
        if (osd_viewer.isOpen()) {
            setupOverlay();
        } else {
            // If refreshing, wait for the 'open' event (cold load case)
            osd_viewer.addOnceHandler('open', setupOverlay);
        }
    });

    function handleMouseMove(event: MouseEvent) {
        if (!osd_viewer) return;
        mortar_state.mouse_position = pageToWorldMeters(osd_viewer, {
            x : event.clientX,
            y : event.clientY,
        })
    }

</script>

<svelte:window onmousemove={handleMouseMove}/>

<!-- Component HTML Root -->
<div class="w-full h-full">
    <svg bind:this={canvas_element} class="point-events-none" style="width : 100%; height: 100%; pointer-events: none;">
        <SessionTargetLayer/>
        <MortarLayer/>
        <TargetLayer/>
        {#if map_dimensions}
            <CrosshairLayer map_width={map_dimensions.x} map_height={map_dimensions.y}/>
        {/if}
    </svg>
</div>