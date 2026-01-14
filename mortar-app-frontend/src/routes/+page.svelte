<script lang='ts'>
	import { getMortarState } from "$lib/mortar_state.svelte";
	import { onMount } from "svelte";
    import ControlPanel from "../components/ControlPanel.svelte";

    let mortar_state = getMortarState(); 
    let MapViewport : any | null = $state<any>(null);

    onMount(async () => {
        MapViewport = (await import("../components/MapViewport.svelte")).default;
    });

</script>

<div class='flex h-screen w-full'>
    {#if MapViewport}
        <MapViewport></MapViewport> 
    {:else}
        <div class="h-full w-full bg-black flex items-center justify-center">
            <b class="text-stone-300 text-[5rem]">Loading...</b>
        </div>
    {/if}
    <div class='justify-end items-stretch h-screen'>
        <ControlPanel></ControlPanel>
    </div>
</div>