import type {
    JoinSessionParams, JoinSessionResponse,
    LeaveSessionParams, LeaveSessionResponse, 
    AddTargetParams, AddTargetResponse,
    GetSessionDataParams, GetSessionDataResposne,
} from "$lib/session/session_types"

/** Base URL for all API requests */
const BACKEND_BASE_URL : string = '/api';

/** Enable debug logging in development */
const DEBUG = import.meta.env.DEV;

/**
 * Log debug messages in development mode
 * @param message - The log message
 * @param data - Optional data to log alongside the message
 */
function debug(message: string, data?: unknown): void {
    if (DEBUG) {
        console.log(`[API] ${message}`, data);
    }
}

/**
 * Safely parse JSON response with error handling
 * @param response - The fetch response object
 * @returns The parsed JSON object, or a fallback error object
 */
async function parseJSON<T>(response: Response): Promise<T> {
    try {
        return await response.json() as T;
    } catch (parseError) {
        debug('JSON parse error', parseError);
        console.log(parseError)
        throw new Error('Invalid JSON response from server');
    }
}

/**
 * Generic request handler for API calls
 * @template T - The expected response type
 * @param endpoint - The API endpoint path
 * @param options - Optional fetch options (method, body, headers, etc.)
 * @returns The parsed JSON response of type T
 * @throws Error if the response is not ok or JSON parsing fails
 */
async function request<T>(endpoint : string, options? : RequestInit) : Promise<T> {
    const session_name = localStorage.getItem('squad_name') || '';
    const method = options?.method || 'GET';

    const headers = {
        'Content-Type': 'application/json',
        'X-SESSION-KEY': session_name,
        ...options?.headers
    };

    const fullUrl = `${BACKEND_BASE_URL}${endpoint}`;
    debug(`test: ${method} ${endpoint}`, { url: fullUrl });

    const response = await fetch(fullUrl, { ...options, headers });

    if (!response.ok) {
        try {
            const errorData = await parseJSON<{ detail?: string }>(response);
            debug(`Request failed with status ${response.status}`, { endpoint, method, errorData });
            throw new Error(
                `${response.status} ${response.statusText}: ${errorData.detail || 'Unknown error'}`
            );
        } catch (error) {
            if (error instanceof Error && error.message.startsWith('Invalid JSON')) {
                debug(`Request failed with status ${response.status} and unparseable error`, { endpoint, method });
                throw new Error(`${response.status} ${response.statusText}: Server error`);
            }
            throw error;
        }
    }

    return parseJSON<T>(response);
}

export const session_interface = {

    /**
     * Join or create a squad session
     * @param session_name - The name of the squad session to join
     * @param user_name - The name of the user joining the session
     * @returns The session join response containing session details and user info
     */
    async join_session(session_name : string, user_name : string) : Promise<JoinSessionResponse> {
        const request_body : JoinSessionParams = {
            session_name : session_name,
            username : user_name
        }

        const response : Promise<JoinSessionResponse> = request<JoinSessionResponse>(
            '/join-session', 
            {
                method: 'POST',
                body: JSON.stringify(request_body)
            });

        return response;
    },

    /**
     * Leave the current squad session
     * @param user_id - The ID of the user leaving the session
     * @returns Confirmation response with status
     */
    async leave_session(user_id : number) : Promise<LeaveSessionResponse> {
        const request_body : LeaveSessionParams = {
            user_id : user_id
        }

        const response : Promise<LeaveSessionResponse> = request<LeaveSessionResponse>(
            '/leave-session', 
            {
                method: 'POST',
                body: JSON.stringify(request_body)
            });

        return response;
    },

    /**
     * Create a new target in the session
     * @param session_id
     * @param user_id
     * @param x
     * @param y
     * @returns The created target object
     */
    async add_target(session_id : number, user_id : number, x : number, y : number): Promise<AddTargetResponse> {
        const request_body : AddTargetParams = {
            session_id : session_id,
            user_id : user_id,
            x : x,
            y : y
        }

        const response : Promise<AddTargetResponse> = request<AddTargetResponse>(
            '/leave-session', 
            {
                method: 'POST',
                body: JSON.stringify(request_body)
            });

        return response;
    },

    /**
     * Get the latest session state and updates
     * @param user_id - The ID of the requesting user
     * @returns The session update response containing current session state
     */
    async get_session_data(session_id : number) : Promise<GetSessionDataResposne> {
        const request_body : GetSessionDataParams = {
            session_id : session_id,
        }

        const response : Promise<GetSessionDataResposne> = request<GetSessionDataResposne>(
            '/leave-session', 
            {
                method: 'POST',
                body: JSON.stringify(request_body)
            });

        return response;
    },

};