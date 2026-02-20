<script lang="ts">

    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";
	import { getSquadSessionState, type SquadSessionContext } from "$lib/session/session_state.svelte";
	import type { Target } from "$lib/session/session_types";

    const mortar_state : MortarState = getMortarState();
    const session_state : SquadSessionContext = getSquadSessionState();

    // Local State
    let targets : Target[] = $derived(session_state.targets)

    // Local Consts
    const ring_size : number = 50;
    const dot_size : number = 5;

</script>

<g class="session-target-layer">
    {#each targets as target }
        {#if session_state.local_user && session_state.local_user.id != target.user_id }
            <circle 
                cx={target.x} cy={target.y} 
                r={dot_size}
                fill="RGBA(0, 0, 0, 1)"
            />
            <circle 
                cx={target.x} cy={target.y} 
                r={ring_size} 
                fill="RGBA(0, 0, 0, 0.1)"
                stroke="black" stroke-width=5 stroke-dasharray="25, 12.5"
            />
            <text 
                x={target.x} y={target.y - ring_size - 10} 
                fill="black" 
                font-size="50px" font-weight="bold" 
                text-anchor="middle"
            >
            {session_state.users.find(user => user.id == target.user_id)?.username}
        </text>
        {/if}
    {/each}
</g>