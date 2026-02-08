<script lang="ts">

    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";

    // Props
    const { map_width  = 10000, map_height = 10000 } = $props()    

    // External State
    const mortar_state : MortarState = getMortarState();

    // Local State
    let position = $derived(mortar_state.mouse_position)
    
    const padding : number = 100;
    const grid_position = $derived.by(() => {
        if (position) {
            return { 
                x : position.x / 100,
                y : (10000 - position.y) / 100 
            }
        }
    })

    const color = 'black'
    const line_style = { 'stroke': color, 'stroke-width': 10 };

</script>

<g class="target-layer">
    {#if position && grid_position}
        <line 
            x1={0} y1={position.y} 
            x2={position.x - padding} y2={position.y} 
            {...line_style}
        />
        <line 
            x1={map_width} y1={position.y} 
            x2={position.x + padding} y2={position.y} 
            {...line_style}
        />
        <line 
            x1={position.x} y1={0} 
            x2={position.x} y2={position.y - padding} 
            {...line_style}
        />
        <line 
            x1={position.x} y1={map_height} 
            x2={position.x} y2={position.y + padding} 
            {...line_style}
        />
        <text
            x={position.x + padding} y={position.y - padding}
            fill={color} 
            font-size='100px' font-weight='bold' 
            text-anchor='left' dominant-baseline='central'
        >
            {grid_position.x.toFixed(0).padStart(3, '0')} {grid_position.y.toFixed(0).padStart(3, '0')}
        </text>
    {/if}
</g>