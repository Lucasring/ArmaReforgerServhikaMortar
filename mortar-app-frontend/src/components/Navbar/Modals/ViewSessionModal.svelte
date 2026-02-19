<script lang="ts">

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

    function userLeaveSession() {
        squad_session.leave_session();
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

        <!-- Users List -->
        <div class="flex flex-col w-full bg-stone-500 rounded-md border border-black p-1">
            <div class="flex font-bold justify-center border-b border-black/20">Session Users</div>
            {#each squad_session.users as user, idx}
                <div class="flex py-1 w-full justify-between border-b border-black/20 last:border-b-0">
                    <div class="font-mono">{idx}:</div>
                    <div class="font-mono">{user.username}</div>
                </div>
            {/each}
        </div>
        <!-- Buttons -->
        <div class="flex justify-center gap-2 w-full">
            <!-- Leave Session Button -->
            <button class="flex items-center bg-red-800 hover:bg-red-700 w-full
                rounded-md w-12 justify-center border border-black font-bold my-0.5 mr-1"
                onclick={userLeaveSession}
            >
                Leave Session
            </button>
        </div>

    </div>
 </Modal>