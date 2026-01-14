<script lang="ts">
  
  import { MAP_SCALE_METERS_PER_PIXEL, mortarTypes } from "$lib/mortar_config";
  import type { MortarConfig, Mortar, MortarAmmo, RingData, BallisticData} from "$lib/mortar_config_types"
  import { getMortarState, MortarState } from "$lib/mortar_state.svelte";

  // Get the MortarState fro mthe context
  let mortar_state : MortarState = getMortarState();
  let mortar_config : MortarConfig = mortarTypes;

  // Debug Inspects
  // $inspect(mortar_state.mortar_type);
  // $inspect(mortar_state.shell_type);
  // $inspect(mortar_state.ring);
  // $inspect(mortar_state.mortar_range);
  $inspect(mortar_state.target_dispersion);

</script>

<div class="flex flex-col gap-4 w-75 p-5 bg-stone-700 h-screen">
    
  <!-- Header -->
  <h2 class="text-xl text-center font-bold text-white">Mortar Helper V2.1.0</h2>

  <!-- User Input -->
  <div class="bg-stone-600 rounded-lg p-2">

    <!-- Mortar Type Selector  -->
    <div class="text-white">
      <label for="mortar-type" class="font-bold p-1">Mortar Type:</label>
      <select id="mortar-type" class="w-full rounded-lg bg-stone-800" bind:value={mortar_state.mortar_type}>
        {#each Object.values(mortar_config) as mortar}
          <option value={mortar.mortar_name}>{mortar.mortar_name}</option>
        {/each}
      </select>
    </div>

    <!-- Mortar Shell Type Selector -->
    <div class="text-white">
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
    <div class="text-white">
      <label for="ring-select" class="font-bold p-1">Ring:</label>
      <select id="ring-select" class="w-full rounded-lg bg-stone-800" bind:value={mortar_state.ring}>
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
      <label class="text-white font-bold">
        <input type="checkbox" class="rounded-sm"/> Auto-select Ring
      </label>
    </div>
  </div>

  <!-- Calculation Block -->
  <div class="bg-stone-600 p-2 rounded-lg">
    <h3 class="text-center text-white">
      <b class="underline">Calculations</b>
    </h3>
    {#snippet displayCalculatedMember(label : string, units : string, value : number | string | null)}
      <div class="flex text-white">
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

  <!-- Instruction Block -->
  <div class="bg-stone-600 rounded-lg p-4 text-white">
    <h3 class="underline text-center font-bold text-md">Instructions</h3>
    <ul class='flex flex-col gap-2 m-3 pl-1 text-sm text-left list-disc'>
      <li class="">Click and drag to pan the map</li>
      <li class="">Double-click to open targeting menu</li>
      <li class="">Select mortar or target position from menu</li>
      <li class="">Select mortar type, ammo type, and ring from dropdowns</li>
      <li class="">Enable auto-select ring to automatically choose the best ring for the current range</li>
      <li>Calculations update automatically</li>
    </ul>
  </div>

</div>
