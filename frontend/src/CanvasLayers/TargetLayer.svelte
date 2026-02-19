<script lang="ts">

    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";

    const mortar_state : MortarState = getMortarState();

    // Local State
    let mortar_position = $derived(mortar_state.mortar_position)
    let target_position = $derived(mortar_state.target_position)
    let dispersion = $derived(mortar_state.target_dispersion)
    let distance = $derived(mortar_state.target_distance)
    
    const text_position = $derived.by(() => {
        if (target_position && dispersion) {
            return { 
                x : target_position.x, 
                y : target_position.y - (dispersion + 5)
            }
        }
    })

</script>

<g class="target-layer">
    {#if mortar_position && target_position && dispersion && text_position}
        <circle 
            cx={target_position.x} cy={target_position.y} 
            r=2.5 
            fill="red" 
        />
        <circle 
            cx={target_position.x} cy={target_position.y} 
            r={dispersion} 
            fill="rgba(255, 0, 0, 0.2)" 
            stroke="red" 
            stroke-width=2.5
        />
        <line 
            x1={mortar_position.x} y1={mortar_position.y} 
            x2={target_position.x} y2={target_position.y} 
            stroke="black" 
            stroke-width=2.5
            stroke-dasharray="10, 5"
        />
        <text 
            x={text_position.x} y={text_position.y} 
            fill="red" 
            font-size="50px" font-weight="bold" 
            text-anchor="middle"
        >
            {dispersion}
        </text>
    {/if}
</g>