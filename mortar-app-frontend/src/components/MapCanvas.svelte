<script lang="ts">
    
    export const ssr = false;

    // --- Custom Types ---
    interface Props {
        osd_viewer : OpenSeadragon.Viewer | null;
    }

    // --- Imports ---
    import type { Point } from '$lib/types';
	import { drawCircle, drawLine, pageToWorldMeters, pageToWorldPixels } from '$lib/map/map_primatives';
    import OpenSeadragon from 'openseadragon';
	import { MAP_SCALE_METERS_PER_PIXEL } from '$lib/mortar_config';
	import { sceneAddCrosshair, sceneAddMortar, sceneAddTarget, type MapScene, type SceneCrosshair } from '$lib/map/map_scene';
	import { getMortarState, MortarState } from '$lib/mortar_state.svelte';
	import { onDestroy } from 'svelte';
    
    // --- Variables ---
    let { osd_viewer } : Props = $props();
    let mortar_state : MortarState = getMortarState();
    let canvas_element : HTMLElement | null = $state(null);

    let map_crosshair : SceneCrosshair | null = $derived.by(() => {
        if (osd_viewer && mortar_state.mouse_position) {
            const osd_world = osd_viewer.world.getItemAt(0);
            return sceneAddCrosshair(
                mortar_state.mouse_position,
                osd_world?.getContentSize().x,
                osd_world?.getContentSize().y,
            )
        }
        return null;
    });

    let map_scene : MapScene | null = $derived.by(() => {
        const { 
            mouse_position: m_mouse_pos,
            mortar_position: m_pos, 
            mortar_max_range: m_max_range, 
            mortar_min_range: m_min_range,
            target_position: t_pos, 
            target_dispersion: t_disp 
        } = mortar_state;

        let temp_scene : MapScene = {
            mortar : null,
            target : null,
            crosshair : null,
            target_path : null
        };

        const is_mortar_valid = (m_pos && m_max_range && m_min_range !== null);
        const is_target_valid = (t_pos && t_disp !== null)

        if (is_mortar_valid) {
            temp_scene.mortar = sceneAddMortar(m_pos, m_min_range, m_max_range);
        }

        if (is_target_valid) {
            temp_scene.target = sceneAddTarget(t_pos, t_disp)
        }

        if (is_mortar_valid && is_target_valid) {
            console.log("draw line")
            temp_scene.target_path = drawLine(m_pos, t_pos, {
                'stroke' : 'blue', 
                'stroke-width' : 5, 
                'stroke-dasharray': '5,5' 
            });
        }

        if (osd_viewer && m_mouse_pos) {
            const osd_world = osd_viewer.world.getItemAt(0);
            temp_scene.crosshair = sceneAddCrosshair(
                m_mouse_pos,
                osd_world?.getContentSize().x,
                osd_world?.getContentSize().y,
            )
        }

        return temp_scene
    });

    // MapScene Update Draw
    $effect(() => {
        if (canvas_element) {
            canvas_element.innerHTML = '';
        }

        if (canvas_element && map_scene.mortar) {
            canvas_element.appendChild(map_scene.mortar.center);
            canvas_element.appendChild(map_scene.mortar.min_range);
            canvas_element.appendChild(map_scene.mortar.max_range);
            canvas_element.appendChild(map_scene.mortar.range_text);
        }

        if (canvas_element && map_scene.target) {
            canvas_element.appendChild(map_scene.target.center);
            canvas_element.appendChild(map_scene.target.dispersion);
            canvas_element.appendChild(map_scene.target.dispersion_text);
        }

        if (canvas_element && map_scene.target_path) {
            canvas_element.appendChild(map_scene.target_path);
        }

        if (canvas_element && map_crosshair) {
            canvas_element.appendChild(map_crosshair.horizontal_left);
            canvas_element.appendChild(map_crosshair.horizontal_right);
            canvas_element.appendChild(map_crosshair.vertical_bottom);
            canvas_element.appendChild(map_crosshair.vertical_top);
        }
    })

    // MapCanvas load effect
    $effect(() => {
        if (!osd_viewer) return;

        const setupOverlay = () => {
            if (!osd_viewer) return;

            const worldItem = osd_viewer.world.getItemAt(0);
            canvas_element = document.getElementById('map-drawing-layer');

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
    <svg id="map-drawing-layer" class="point-events-none" style="width : 100%; height: 100%; pointer-events: none;"></svg>
</div>