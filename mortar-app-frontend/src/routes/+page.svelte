<script>
	import { getMortarState } from "$lib/mortar_state.svelte";
    import ControlPanel from "../components/ControlPanel.svelte";

    let mortar_state = getMortarState(); 

</script>

<div class='flex h-screen w-full'>
    <div class='w-full bg-black'></div>
    <div class='justify-end items-stretch h-screen'>
        <ControlPanel></ControlPanel>
    </div>
</div>