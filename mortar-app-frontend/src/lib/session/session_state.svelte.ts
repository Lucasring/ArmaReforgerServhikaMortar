import { browser } from '$app/environment';
import { getTargets, getUsers, joinSession, leaveSession, getSessionUpdate } from './session_interface';
import type {
    SquadSession, JoinSquadSessionResponse, SquadSessionUpdateResponse,
    Target, User
} from "$lib/session/session_types"
import { getContext, setContext } from 'svelte';

export class SquadSessionContext {

    // Meta
    sync_interval_ms : number = 2000;
    sync_interval_id : number | null = null;

    // Local Session State
    local_session : SquadSession | null = $state(null);
    local_user : User | null = $state(null);
    is_session_joined : boolean = $state(false);

    // Backend Session State
    session_id : number | null = $state(null);
    users : User[] = $state([]);
    targets : Target[] = $state([]);

    async join_session(session_name : string, user_name : string) {
        const response : JoinSquadSessionResponse = await joinSession(
            session_name,
            user_name
        );

        this.local_session = response.session;
        this.local_user = response.user;
        this.is_session_joined = true;

        this.startSyncInterval();
    }

    async leave_session() {
        if (!this.local_session || !this.local_user) return;

        leaveSession(this.local_user.id)
        this.stopSyncInterval()
        this.is_session_joined = false;
    }

    async sync() {

        if (!this.local_session || !this.local_user) {
            console.error("attempt to sync undefined session");
            return;
        }

        getSessionUpdate(this.local_user.id).then((response) => {
            this.targets = response.targets
            this.users = response.users
        }).catch(err => {
            console.error("Sync", err);
        });
    }

    startSyncInterval() {
        if (!browser || this.sync_interval_id) return;
        this.sync();
        this.sync_interval_id = window.setInterval(() => this.sync(), this.sync_interval_ms);
    }

    stopSyncInterval() {
        if (this.sync_interval_id) {
            clearInterval(this.sync_interval_id);
            this.sync_interval_id = null;
        }
    }

}

/** 
 * @brief Global Context KEY for Mortar State 
 */ 
const SQUAD_SESSION_STATE_KEY = Symbol('squad_session_state');

/**
 * @brief Initialize the MortarState for usage within the component
 * @returns MotarState
 */
export function initSquadSesssion() : SquadSessionContext {
    return setContext(SQUAD_SESSION_STATE_KEY, new SquadSessionContext());
}

/** 
 * @brief Get the MortarState from the component context
 * @brief The MortarState
*/
export function getSquadSessionState() : SquadSessionContext {
    return getContext<SquadSessionContext>(SQUAD_SESSION_STATE_KEY);
}