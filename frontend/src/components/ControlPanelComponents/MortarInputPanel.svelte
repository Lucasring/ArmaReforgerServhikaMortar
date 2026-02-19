<script lang="ts">
    import { mortarTypes } from "$lib/mortar_config";
    import type { MortarConfig } from "$lib/mortar_config_types"
    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";

    let mortar_state: MortarState = getMortarState();
    let mortar_config: MortarConfig = mortarTypes;
    let mortar_auto_ring_enabled: boolean = $state(true);

    // Auto Adjust Ring Effect
    $effect(() => {
        const { target_distance, mortar_type, shell_type } = mortar_state;

        if (mortar_auto_ring_enabled && target_distance !== null) {
            mortar_state.autoAdjustRing();
        }
    });
</script>

<div class="bg-stone-600 rounded-lg p-2">

    <!-- Mortar Type Selector  -->
    <div class="text-stone-300">
        <label for="mortar-type" class="font-bold p-1">Mortar Type:</label>
        <select id="mortar-type" class="w-full rounded-lg bg-stone-800" bind:value={mortar_state.mortar_type}>
            {#each Object.values(mortar_config) as mortar}
                <option value={mortar.mortar_name}>{mortar.mortar_name}</option>
            {/each}
        </select>
    </div>

    <!-- Mortar Shell Type Selector -->
    <div class="text-stone-300">
        <label for="ammo-type" class="font-bold p-1">Ammo Type:</label>
        <select id="ammo-type" class="w-full rounded-lg bg-stone-800" bind:value={mortar_state.shell_type}>
            {#if mortar_state.mortar_type }
                {#each mortar_config[mortar_state.mortar_type].ammo_types as ammo}
                    <option value={ammo.name}>{ammo.name}</option>
                {/each}
            {/if}
        </select>
    </div>

    <!-- Mortar Ring Count Selector -->
    <div class="text-stone-300">
        <label for="ring-select" class="font-bold p-1">Ring:</label>
        <select 
            id="ring-select" 
            class="w-full rounded-lg bg-stone-800 disabled:bg-stone-700" 
            bind:value={mortar_state.ring} disabled={mortar_auto_ring_enabled}
        >
            {#if mortar_state.mortar_type && mortar_state.shell_type}
            {@const selectedMortar = mortar_config[mortar_state.mortar_type]}
            {@const selectedShell = selectedMortar?.ammo_types.find(m => m.name === mortar_state.shell_type)}
            {#if selectedShell}
                {#each selectedShell.ballistics.rings as _, i}
                <option value={i}>Ring {i}</option>
                {/each}
            {/if}
            {/if}
        </select>
    </div>

    <!-- Auto Ring Enable -->
    <div class="flex w-full items-center justify-center py-2">
        <label class="text-stone-300 font-bold">
            <input type="checkbox" class="rounded-sm" bind:checked={mortar_auto_ring_enabled}/> Auto-select Ring
        </label>
    </div>

</div>
