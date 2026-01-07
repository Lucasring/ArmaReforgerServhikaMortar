<script>
	import { getMortarState } from "$lib/mortar_state.svelte";
    import ControlPanel from "../components/ControlPanel.svelte";
    import MapViewport from "../components/MapViewport.svelte";

    let mortar_state = getMortarState(); 

</script>

<div class='flex h-screen w-full'>
    <MapViewport></MapViewport>
    <div class='justify-end items-stretch h-screen'>
        <ControlPanel></ControlPanel>
    </div>
</div>