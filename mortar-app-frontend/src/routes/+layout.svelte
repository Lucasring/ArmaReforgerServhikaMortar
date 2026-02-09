<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initMortarState } from '$lib/mortar_state.svelte'
	import { initMortarUserCache } from '$lib/mortar_user_cache.svelte';
	import { initSquadSesssion } from '$lib/session/session_state.svelte';
	import { registerTargetSync } from '$lib/session/session_client.svelte';

	// Initialize MortarState for all page contexts
	const mortar_state = initMortarState();
	const mortar_user_cache = initMortarUserCache();
	const squad_session = initSquadSesssion();

	registerTargetSync(mortar_state, squad_session);

	// Initialize Props
	let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
