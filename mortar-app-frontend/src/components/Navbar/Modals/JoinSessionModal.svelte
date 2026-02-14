<script lang="ts">

    import { joinSession } from "$lib/session/session_interface"
    import { getSquadSessionState } from "$lib/session/session_state.svelte";
    import Modal from "./Modal.svelte"
    
    let {
        is_modal_open = $bindable()
    } = $props()

    // Join Session Modal
    let entered_session_name : string = $state('');
    let entered_username : string = $state('');

    // Squad Session Context
    let squad_session = getSquadSessionState();

    async function userJoinSession() {
        if (!entered_session_name || !entered_username) return;

        squad_session.join_session(entered_session_name, entered_username);
        is_modal_open = false;
    }

</script>

<Modal is_open={is_modal_open}>
    <div class="flex flex-col gap-1 h-auto w-auto bg-stone-600 border border-black p-4 text-stone-400 rounded-[1rem]">
        
        <!-- Title Row -->
        <div class="flex flex-row gap-2 items-center justify-center border-b border-stone-700">
            <h1 class="w-full font-bold text-lg items-center">Session Interface</h1>
            <button 
                class="flex items-center px-2 mb-1 rounded-lg bg-red-800 hover:bg-red-700 border border-black font-bold"
                onclick={() => { is_modal_open = false }}
            >
                X
            </button>
        </div>

        <!-- User Session Input -->
        <div class="flex gap-1 items-center justify-between">
            <div class="font-bold">Session Name: </div>
            <input 
                id="session-name" 
                type="text" 
                placeholder="enter session name" bind:value={entered_session_name}
                class="my-1 h-[2rem] rounded-md bg-stone-800 border-stone-500 text-white"
            >
        </div>

        <!-- User Name Input -->
        <div class="flex gap-1 items-center justify-between">
            <div class="font-bold">Username: </div>
            <input 
                id="username-name" 
                type="text" 
                placeholder="enter user name" bind:value={entered_username}
                class="my-1 h-[2rem] rounded-md bg-stone-800 border-stone-500 text-white"
            >
        </div>

        <!-- Join Session Button -->
        <div class="flex justify-center gap-2 w-full">
            <button class="flex items-center bg-green-800 hover:bg-green-700 w-full
                rounded-md w-12 justify-center border border-black font-bold my-0.5"
                onclick={userJoinSession}
            >
                Join
            </button>
        </div>

    </div>
</Modal>