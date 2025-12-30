<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import {initMortarState} from '$lib/mortar_state.svelte'

	// Initialize MortarState for all page contexts
	initMortarState();

	// Initialize Props
	let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
