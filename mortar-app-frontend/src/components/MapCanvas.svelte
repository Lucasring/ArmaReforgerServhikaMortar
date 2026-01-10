<script lang="ts">
    
    export const ssr = false;

    // --- Imports ---
    import type { Point, MapClickEvent } from '$lib/types';
	import { onMount } from 'svelte';
	import { drawCircle, pageToWorld } from '$lib/osd_map_primatives';
    import OpenSeadragon from 'openseadragon';

    // --- Custom Types ---
    interface Props {
        map_click_event : MapClickEvent | null;
        osd_viewer : OpenSeadragon.Viewer | null;
    }

    interface ContextMenu {
        is_hidden : boolean;
        position : Point;
    }
    
    // --- Variables ---
    let { map_click_event, osd_viewer } : Props = $props();

    let context_menu : ContextMenu = $state({
        is_hidden : true,
        position : {x : 0, y : 0}
    });

    let canvas_element : HTMLElement | null = $state(null);

    // --- Methods ---
    $effect(() => {
        if (!map_click_event || !osd_viewer) { return }

        const event_type : string = map_click_event.type
        switch(event_type) {
            case "click":
                const position = pageToWorld(osd_viewer, map_click_event.position);
                console.log(`Click: ${map_click_event.position.x} ${map_click_event.position.y}`)
                console.log(`Draw Circle: ${position.x} ${position.y}`);
                canvas_element?.appendChild(
                    drawCircle(
                        position,
                        50.0,
                        { fill: '#3b82f6', stroke: 'red', 'stroke-width': '10' }
                    )
                )
                break;
            case "double-click":
                context_menu.position = map_click_event.position;
                context_menu.is_hidden = false;
                break;
            default:
                console.error("unknown MapClickEvent type");
        }
    });

    $effect(() => {
        if (!osd_viewer) return;

        const setupOverlay = () => {
            if (!osd_viewer) return;

            const worldItem = osd_viewer.world.getItemAt(0);
            canvas_element = document.getElementById('map-drawing-layer');

            if (canvas_element && worldItem) {
                const image_size = worldItem.getContentSize();
                
                // Set coordinate system to match map pixels
                canvas_element.setAttribute('viewBox', `0 0 ${image_size.x} ${image_size.y}`);

                // Prevent duplicate overlays
                if (!osd_viewer.getOverlayById(canvas_element)) {
                    osd_viewer.addOverlay({
                        element: canvas_element,
                        location: new OpenSeadragon.Rect(0, 0, 1, image_size.y / image_size.x)
                    });
                    console.log("SVG Overlay successfully attached to World space.");
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
</script>

{#snippet contextButton(label : string, action : (arg0: MouseEvent) => void)}
    <button 
        class="w-full bg-stone-700 rounded-lg text-white pl-4 pr-4 hover:bg-stone-600" onclick={(e) => {
            context_menu.is_hidden = true;
            e.stopPropagation();
            action(e);
        }}>
        {label}
    </button>
{/snippet}

<div class="w-full h-full">
    <svg id="map-drawing-layer" class="point-events-none" style="width : 100%; height: 100%"></svg>
    {#if !context_menu.is_hidden}
    <div 
        class="flex flex-col fixed z-50 bg-stone-800 rounded-lg p-1 gap-1 pointer-events-auto" 
        style="left: {context_menu.position.x}px; top: {context_menu.position.y}px;"
    >
        {@render contextButton("Set Mortar Position", (e) => {console.log("Set Mortar")})}
        {@render contextButton("Set Target Position", (e) => {console.log("Set Target")})}
    </div>
    {/if}
</div>