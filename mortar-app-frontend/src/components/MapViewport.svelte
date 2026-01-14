<script lang='ts'>
    
    export const ssr = false;
    import type { Point } from '$lib/types';
    import { onMount } from 'svelte';
	import type { CanvasDoubleClickEvent } from 'openseadragon';
	import { getMortarState, MortarState } from '$lib/mortar_state.svelte';
	import { pageToWorldMeters } from '$lib/map/map_primatives';
    import MapCanvas from './MapCanvas.svelte';

    interface ContextMenu {
        is_hidden : boolean;
        position : Point;
    }

    interface ClickState {
        single_click_position : Point | null;
        double_click_position : Point | null;
    }

    // OpenseaDragon Viewer Instance
    let mortar_state : MortarState = getMortarState()
    let viewer : OpenSeadragon.Viewer | null = $state(null);

    let context_menu : ContextMenu = $state({
        is_hidden : true,
        position : {x : 0, y : 0}
    });

    let page_click_state : ClickState = {
        single_click_position : null, 
        double_click_position : null
    };

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
                maxZoomLevel: 50,
                springStiffness: 150,
                clickTimeThreshold: 350,  // Default is 300, 350 is more forgiving
                clickDistThreshold: 10,   // Default is 5, 10 allows for slight finger/mouse shake
            });

        // --- Register Event Handlers ---
        viewer.addHandler('canvas-click', (e) => {
            const event : MouseEvent = e.originalEvent as MouseEvent
            page_click_state.single_click_position = {
                x : event.clientX,
                y : event.clientY
            }
        });

        viewer.addHandler('canvas-double-click', (e : CanvasDoubleClickEvent) => {
            const event : MouseEvent = e.originalEvent as MouseEvent
            page_click_state.double_click_position = {
                x : event.clientX,
                y : event.clientY
            }
            context_menu.position = page_click_state.double_click_position;
            context_menu.is_hidden = false;
        });
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

<div class='w-screen h-screen'>
    <!-- Openseadragon Map -->
    <div 
        role="presentation"
        id='openseadragon-instance'  
        class="w-full h-full bg-black" 
        oncontextmenu={(e) => {e.preventDefault()}}>
    </div>
    <div class="absolute inset-0 pointer-events-none z-10">
        {#if !context_menu.is_hidden}
            <div 
                class="flex flex-col fixed z-50 bg-stone-800 rounded-lg p-1 gap-1 pointer-events-auto" 
                style="left: {context_menu.position.x}px; top: {context_menu.position.y}px;"
            >
                {@render contextButton("Set Mortar Position", (e : MouseEvent) => {
                    if (!document || !viewer || !page_click_state.double_click_position) return;
                    mortar_state.mortar_position = pageToWorldMeters(viewer, page_click_state.double_click_position)
                })}
                {@render contextButton("Set Target Position", (e : MouseEvent) => {
                if (!document || !viewer || !page_click_state.double_click_position) return;
                    mortar_state.target_position = pageToWorldMeters(viewer, page_click_state.double_click_position)
                })}
            </div>
        {/if}
            <MapCanvas osd_viewer={viewer}></MapCanvas>
    </div>
</div>