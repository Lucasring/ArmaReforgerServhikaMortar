<script lang="ts">

    import {joinSession} from "$lib/session_interface"
    import type {SquadSession} from "$lib/session_interface"
    
    let session_name : string = $state('')
    let squad_session : SquadSession | null = $state(null)

    function userJoinSession() {

    }

    function userLeaveSession() {

    }

</script>

<div class="flex h-[2.5rem] w-full bg-stone-700 items-center justify-left p-1">

    <!-- Mortar App Title -->
    <div class="h-full relative">
        <div class="text-stone-300 font-bold px-2 h-full flex items-center">
            Mortar App V3.0.1
        </div>
    </div>

    <!-- Session Interface -->
     <div class="flex flex-row h-full bg-stone-600 rounded-md gap-1">

        <!-- Session Label -->
        <div class="text-stone-300 font-bold px-2 h-full flex items-center">
            Session:
        </div>

        <!-- User Session Name Input -->
        <input id="session-name" type="text" placeholder="enter session name" bind:value={session_name}
            class="m-1 rounded-md bg-stone-800 border-stone-500 text-white"
        >

        <!-- Join Session Button -->
        <button class="flex items-center bg-green-800 hover:bg-green-700 
            rounded-md w-12 justify-center border border-black font-bold my-0.5"
            onclick={userJoinSession}
        >
            Join
        </button>

        <!-- Leave Session Button -->
        <button class="flex items-center bg-red-800 hover:bg-red-700 
            rounded-md w-12 justify-center border border-black font-bold my-0.5 mr-1"
            onclick={userLeaveSession}
        >
            Leave
        </button>

     </div>
</div>