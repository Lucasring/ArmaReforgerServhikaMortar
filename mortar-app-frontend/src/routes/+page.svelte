<script>
	import { getMortarState } from "$lib/mortar_state.svelte";

    let mortar_state = getMortarState(); 

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<p>Current Position: {mortar_state.position.x}X - {mortar_state.position.y}</p>