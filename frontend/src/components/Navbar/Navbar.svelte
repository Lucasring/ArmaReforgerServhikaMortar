<script lang="ts">

    import { getSquadSessionState } from "$lib/session/session_state.svelte";
    import JoinSessionModal from "./Modals/JoinSessionModal.svelte";
    import ViewSessionModal from "./Modals/ViewSessionModal.svelte";
    
    // Modal States
    let is_join_session_modal_open : boolean = false;
    let is_view_session_modal_open : boolean = false;

    // Squad Session Context
    let squad_session = getSquadSessionState();

</script>

<!-- Base Navbar -->
<div class="flex h-[2.5rem] w-full bg-stone-700 text-stone-400 items-center justify-left">

    <!-- Mortar App Title -->
    <div class="h-full relative border-r">
        <div class="font-bold px-4 h-full flex items-center">
            Mortar App V5.0.0
        </div>
    </div>

    {#if !squad_session.is_session_joined }
        <!-- Session Interface Modal Open Button -->
        <button 
            onclick={() => {is_join_session_modal_open = true}}
            class="h-full px-4 font-bold border-r hover:bg-stone-600"
        >
            Join Session
        </button>
    {/if}

    {#if squad_session.is_session_joined }
        <button 
            onclick={() => {is_view_session_modal_open = true}}
            class="h-full relative border-r hover:bg-stone-600"
        >
            <div class="font-bold px-4 h-full flex items-center">
                Joined Session: "{squad_session.local_session?.session_name}" as "{squad_session.local_user?.username}"
            </div>
        </button>
    {/if}

</div>

<!-- Join Session Modal -->
<JoinSessionModal bind:is_modal_open={is_join_session_modal_open}/>

<!-- View Session Modal -->
<ViewSessionModal bind:is_modal_open={is_view_session_modal_open}/>