<script lang="ts">

    import { joinSession } from "$lib/session/session_interface"
    import { getSquadSessionState } from "$lib/session/session_state.svelte";
    import Modal from "./Modal.svelte"
    
    let entered_session_name : string = $state('')
    let entered_username : string = $state('')
    let is_session_modal_open : boolean = $state(false)

    let squad_session = getSquadSessionState();

    async function userJoinSession() {
        if (!entered_session_name || !entered_username) return;

        squad_session.join_session(entered_session_name, entered_username);
        is_session_modal_open = false;
    }

    function userLeaveSession() {
        squad_session.leave_session();
        is_session_modal_open = false;
    }

    $inspect(squad_session.local_session)

</script>

<div class="flex h-[2.5rem] w-full bg-stone-700 text-stone-400 items-center justify-left">

    <!-- Mortar App Title -->
    <div class="h-full relative border-r">
        <div class="font-bold px-4 h-full flex items-center">
            Mortar App V3.0.1
        </div>
    </div>

    <!-- Session Interface Modal Open Button -->
    <button 
        onclick={() => {is_session_modal_open = true}}
        class="h-full px-4 font-bold border-r hover:bg-stone-600"
    >
        Session Interface
    </button>

</div>

<!-- Session Interface -->
<Modal is_open={is_session_modal_open}>
    <div class="flex flex-col gap-1 h-auto w-auto bg-stone-600 border border-black p-4 text-stone-400 rounded-[1rem]">
        
        <!-- Title Row -->
        <div class="flex flex-row gap-2 items-center justify-center border-b border-stone-700">
            <h1 class="w-full font-bold text-lg items-center">Session Interface</h1>
            <button 
                class="flex items-center px-2 mb-1 rounded-lg bg-red-800 hover:bg-red-700 border border-black font-bold"
                onclick={() => { is_session_modal_open = !is_session_modal_open }}
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

        <!--  -->
        <div class="flex justify-center gap-2 w-full">
            <button class="flex items-center bg-green-800 hover:bg-green-700 w-full
                rounded-md w-12 justify-center border border-black font-bold my-0.5"
                onclick={userJoinSession}
            >
                Join
            </button>

            <!-- Leave Session Button -->
            <button class="flex items-center bg-red-800 hover:bg-red-700 w-full
                rounded-md w-12 justify-center border border-black font-bold my-0.5 mr-1"
                onclick={userLeaveSession}
            >
                Leave
            </button>
        </div>

    </div>
</Modal>
