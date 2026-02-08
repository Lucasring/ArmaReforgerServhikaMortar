<script lang="ts">

    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";

    const mortar_state : MortarState = getMortarState();

    // Local State
    let position = $derived(mortar_state.mortar_position)
    let min_range = $derived(mortar_state.mortar_min_range)
    let max_range = $derived(mortar_state.mortar_max_range)
    
    const text_position = $derived.by(() => {
        if (position && max_range) {
            return { 
                x : position.x, 
                y : position.y - (max_range + 5)
            }
        }
    })

</script>

<g class="mortar-layer">
    {#if position && min_range && max_range && text_position}
        <circle 
            cx={position.x} cy={position.y} 
            r="5" 
            fill="blue" 
        />
        <circle 
            cx={position.x} cy={position.y} 
            r={max_range} 
            fill="none" stroke="blue" stroke-width='5'
        />
        <circle 
            cx={position.x} cy={position.y} 
            r={min_range} 
            fill="rgba(0,0,255,0.1)" stroke='blue' stroke-width='5
        '/>
        <text 
            x={text_position.x} y={text_position.y} 
            fill="blue" 
            font-size="50px" font-weight="bold" 
            text-anchor="middle"
        >
            {max_range}
        </text>
    {/if}
</g>