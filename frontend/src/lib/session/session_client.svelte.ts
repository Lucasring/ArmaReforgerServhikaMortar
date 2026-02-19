import type { Point } from "$lib/types";
import type { MortarState } from "$lib/mortar_state.svelte";
import type { SquadSessionContext } from "./session_state.svelte";
import { session_interface } from "./session_interface";

/**
 * Registers TargetSync event which sends user target data to the backend server
 * @param mortar_state The users mortar_state object
 * @param session_state The users session_state object
 */
export function registerTargetSync(
    mortar_state : MortarState, 
    session_state : SquadSessionContext
) {
    $effect(() => {
        if (!session_state.local_user || !session_state.local_session) return;
        
        const user_target : Point | null = mortar_state.target_position;
        if (user_target) {
            session_interface.add_target(
                session_state.local_session.id,
                session_state.local_user.id,
                user_target.x,
                user_target.y
            )
        }
    })
}
