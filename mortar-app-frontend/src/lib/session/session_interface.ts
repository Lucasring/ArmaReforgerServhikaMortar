import type {
    JoinSquadSessionResponse, 
    TargetCreateRequest, TargetRemoveRequest, Target,
    User
} from "$lib/session/session_types"

const BACKEND_BASE_URL : string = '/api/squad';

async function request<T>(endpoint : string, options? : RequestInit) : Promise<T> {
    const session_name = localStorage.getItem('squad_name') || '';

    const headers = {
        'Content-Type': 'application/json',
        'X-SESSION-KEY': session_name,
        ...options?.headers
    };

    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'API Error');
    }

    return response.json();
}

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

export async function leaveSession(user_id : number) : Promise<{ status : string }> {
    return request<{ status : string }>(`/leave-session?user_id=${encodeURIComponent(user_id)}`);
}


export async function getTargets(): Promise<Target[]> {
    return request<Target[]>('/targets');
}

export async function addTarget(target_request : TargetCreateRequest): Promise<Target> {
    return request<Target>('/targets', {
        method: 'POST',
        body: JSON.stringify(target_request)
    });
}

export async function deleteTarget(target_request : TargetRemoveRequest): Promise<Target> {
    return request<Target>(`/targets`, { 
        method: 'DELETE',
        body: JSON.stringify(target_request)
    });
}


export async function getUsers(user_id : number): Promise<User[]> {
    return request<User[]>(`/users?user_id=${encodeURIComponent(user_id)}`);
}
