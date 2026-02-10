import type {
    JoinSquadSessionResponse, SquadSessionUpdateResponse,
    TargetCreateRequest, TargetRemoveRequest, Target,
    User
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
        console.debug(`[API] ${message}`, data);
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
    debug(`${method} ${endpoint}`, { url: fullUrl });

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

/**
 * Join or create a squad session
 * @param session_name - The name of the squad session to join
 * @param user_name - The name of the user joining the session
 * @returns The session join response containing session details and user info
 */
export async function joinSession(session_name : string, user_name : string) : Promise<JoinSquadSessionResponse> {
    const params = new URLSearchParams({
        session_name,
        user_name
    })

    const endpoint = `/join-session?${params.toString()}`;
    const data = await request<JoinSquadSessionResponse>(endpoint, { method: 'POST' });

    localStorage.setItem('squad_name', data.session.session_name);
    return data;
}

/**
 * Leave the current squad session
 * @param user_id - The ID of the user leaving the session
 * @returns Confirmation response with status
 */
export async function leaveSession(user_id : number) : Promise<{ status : string }> {
    const params = new URLSearchParams({
        user_id: user_id.toString()
    });
    return request<{ status : string }>(`/leave-session?${params.toString()}`);
}

/**
 * Retrieve all targets for the current session
 * @returns Array of target objects
 */
export async function getTargets(): Promise<Target[]> {
    return request<Target[]>('/target');
}

/**
 * Create a new target in the session
 * @param target_request - The target creation request containing target coordinates and details
 * @returns The created target object
 */
export async function addTarget(target_request : TargetCreateRequest): Promise<Target> {
    return request<Target>('/target', {
        method: 'POST',
        body: JSON.stringify(target_request)
    });
}

/**
 * Delete a target from the session
 * @param target_request - The target removal request containing target ID
 * @returns The deleted target object
 */
export async function deleteTarget(target_request : TargetRemoveRequest): Promise<Target> {
    return request<Target>(`/target`, { 
        method: 'DELETE',
        body: JSON.stringify(target_request)
    });
}

/**
 * Get all users in the current session
 * @param user_id - The ID of the requesting user
 * @returns Array of user objects in the session
 */
export async function getUsers(user_id : number): Promise<User[]> {
    const params = new URLSearchParams({
        user_id: user_id.toString()
    });
    return request<User[]>(`/user?${params.toString()}`);
}

/**
 * Get the latest session state and updates
 * @param user_id - The ID of the requesting user
 * @returns The session update response containing current session state
 */
export async function getSessionUpdate(user_id : number) : Promise<SquadSessionUpdateResponse> {
    const params = new URLSearchParams({
        user_id: user_id.toString()
    });
    return request<SquadSessionUpdateResponse>(`/get-session-update?${params.toString()}`);
}