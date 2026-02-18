import { browser } from '$app/environment';
import { session_interface } from './session_interface';
import type { 
    JoinSessionResponse,
    Target, User, Session 
} from "$lib/session/session_types"
import { getContext, setContext } from 'svelte';

export class SquadSessionContext {

    /** The syncronization interval period */
    sync_interval_ms : number = 2000;

    /** The browsers syncronization handle ID callback */
    sync_interval_id : number | null = null;

    /** The local session the user has changed or a null for no session */
    local_session : Session | null = $state(null);

    /** The local user object the user has joined as or a null for no session/user */
    local_user : User | null = $state(null);

    /** Boolean indicator for if a session is currently joined */
    is_session_joined : boolean = $state(false);

    /** The ID of the session in the backend */
    session_id : number | null = $state(null);

    /** The Users recieved from the Session */
    users : User[] = $state([]);

    /** The Targets recieved from the Session */
    targets : Target[] = $state([]);

    /**
     * Join a session with the given parameters
     * @param session_name The name of the session to join
     * @param user_name The username to join the session as
     */
    async join_session(session_name : string, user_name : string) {
        const response : JoinSessionResponse = await session_interface.join_session(
            session_name,
            user_name
        );

        this.local_session = response.session;
        this.local_user = response.user;
        this.is_session_joined = true;
        this.startSyncInterval();
    }

    /**
     * Leave the current session by stopping the sync interval and sending disconnect request to server
     * @returns void
     */
    async leave_session() {
        if (!this.local_session || !this.local_user) return;

        session_interface.leave_session(this.local_user.id)
        this.is_session_joined = false;
        this.stopSyncInterval()
    }

    /**
     * Session Sync Logic
     * @returns void
     */
    async sync() {

        if (!this.local_session || !this.local_user) {
            console.error("attempt to sync undefined session");
            return;
        }

        session_interface.get_session_data(this.local_session.id).then((response) => {
            this.targets = response.targets
            this.users = response.users
        }).catch(err => {
            console.error("Sync", err);
        });
    }

    /**
     * Starts the Session Sync/Update
     * @returns void
     */
    startSyncInterval() {
        if (!browser || this.sync_interval_id) return;
        this.sync();
        this.sync_interval_id = window.setInterval(() => this.sync(), this.sync_interval_ms);
    }

    /**
     * Stops the Session Sync/Update interval
     */
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