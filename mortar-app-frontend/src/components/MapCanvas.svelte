<script lang="ts">
    
    import type OpenSeadragon from 'openseadragon';
    // import type {drawCircle, drawLine, drawRing, drawText} from "$lib/osd_map_primatives"

    // --- Custom Types ---
    interface Props {
        map_click_event : MapClickEvent | null;
        osd_viewer : OpenSeadragon.Viewer | null;
    }

    interface ContextMenu {
        is_hidden : boolean;
        position : Point;
    }

    // --- Imports ---
    import type { Point, MapClickEvent } from '$lib/types';
    
    // --- Variables ---
    let { map_click_event, osd_viewer } : Props = $props();

    let context_menu : ContextMenu = $state({
        is_hidden : true,
        position : {x : 0, y : 0}
    })

    // --- Methods ---
    $effect(() => {
        if (!map_click_event) { return }

        const event_type : string = map_click_event.type
        switch(event_type) {
            case "click":
                break;
            case "double-click":
                context_menu.position = map_click_event.position;
                context_menu.is_hidden = false;
                break;
            default:
                console.error("unknown MapClickEvent type");
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

<div class="">
    <!-- <svg id="map-drawing-layer" class="point-events-none" style="width : 100%; height: 100%"></svg> -->
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