export interface SquadSession {
    id : number;
    name : string;
    targets : Target[]
}

export interface Target {
    id : number;
    label : string;
    x : number;
    y : number;
    timestamp : number;
}

export interface TargetCreate {
    label : string;
    x : number;
    y : number;
    timestamp : number;
}

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

export async function joinSession(session_name : string) : Promise<SquadSession> {
        const endpoint = `/sessions?session_name=${encodeURIComponent(session_name)}`;
        const data = await request<SquadSession>(endpoint, { method: 'POST' });
        localStorage.setItem('squad_name', data.name);
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
