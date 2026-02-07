import type {
    SquadSession, JoinSquadSessionResponse, 
    Target, TargetCreate,
    User
} from "$lib/session/session_types"

const BACKEND_BASE_URL : string = 'http://localhost:8000/squad';

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


export async function getTargets(): Promise<Target[]> {
    return request<Target[]>('/targets');
}

export async function addTarget(target: TargetCreate): Promise<Target> {
    return request<Target>('/targets', {
        method: 'POST',
        body: JSON.stringify(target)
    });
}

export async function deleteTarget(id: number): Promise<Target> {
    return request<Target>(`/targets/${id}`, { method: 'DELETE' });
}


export async function getUsers(): Promise<User[]> {
    return request<User[]>('/users');
}
