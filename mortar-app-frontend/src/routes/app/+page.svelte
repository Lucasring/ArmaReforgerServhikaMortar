<script>
	import { getMortarState } from "$lib/mortar_state.svelte";

    let mortar_state = getMortarState(); 

</script>

<div>
    <input type='range' bind:value={mortar_state.position.x} min='0' max='100'>
    <p>Current Position is Still: {mortar_state.position.x}X - {mortar_state.position.y}Y</p>
</div>