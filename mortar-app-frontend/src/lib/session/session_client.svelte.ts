import type { Point } from "$lib/types";
import type { MortarState } from "$lib/mortar_state.svelte";
import type { SquadSessionContext } from "./session_state.svelte";
import { addTarget } from "./session_interface";


export function registerTargetSync(
    mortar_state : MortarState, 
    session_state : SquadSessionContext
) {
    $effect(() => {
        if (!session_state.local_user || !session_state.local_session) return;
        
        const user_target : Point | null = mortar_state.target_position;
        if (user_target) {
            addTarget({
                user_id : session_state.local_user.id,
                x : user_target.x,
                y : user_target.y
            })
        }

        console.log("Sent Target")
    })
}
