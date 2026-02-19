<script lang="ts">
    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";

    let mortar_state: MortarState = getMortarState();
</script>

<div class="bg-stone-600 p-2 rounded-lg">
    <h3 class="text-center text-stone-300 border-b font-bold">Calculations</h3>
    {#snippet displayCalculatedMember(label : string, units : string, value : number | string | null)}
    <div class="flex text-stone-300">
        <span class="w-full font-bold">{label} ({units}):</span>
        {#if value}
        <span class="text-right">{value}</span>
        {:else}
        <span class="text-right">-</span>
        {/if}
    </div>
    {/snippet}
    {@render displayCalculatedMember("Distance", "m", mortar_state.target_distance?.toFixed(2) ?? 0)}
    {@render displayCalculatedMember("Azimuth", "deg", mortar_state.target_azimuth?.toFixed(2) ?? 0)}
    {@render displayCalculatedMember("Elevation", "mils", mortar_state.mortar_elevation?.toFixed(0) ?? 0)}
    {@render displayCalculatedMember("Time To Impact", "s", mortar_state.target_time_to_impact?.toFixed(1) ?? 0)}
</div>
