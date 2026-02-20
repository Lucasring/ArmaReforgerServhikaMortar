<script lang='ts'>
	import { onMount } from "svelte";
    import ControlPanel from '@components/sidebar/ControlPanel.svelte'
    import NavBar from "@components/navbar/Navbar.svelte";

    let MapViewport : any | null = $state<any>(null);

    onMount(async () => {
        MapViewport = (await import("@components/map/MapViewport.svelte")).default;
    });

</script>

<div class='flex h-screen w-full'>
    <div class="flex flex-col h-screen w-full">
        <NavBar></NavBar>
        {#if MapViewport}
            <MapViewport></MapViewport> 
        {:else}
            <div class="h-full w-full bg-black flex items-center justify-center">
                <b class="text-stone-300 text-[5rem]">Loading...</b>
            </div>
        {/if}
    </div>
    <div class='justify-end items-stretch h-screen'>
        <ControlPanel></ControlPanel>
    </div>
</div>