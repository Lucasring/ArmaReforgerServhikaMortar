export interface SquadSession {
    id : number;
    session_name : string;
}

export interface JoinSquadSessionResponse {
    user: User;
    session: SquadSession;
}

export interface Target {
    id : number;
    label : string;
    x : number;
    y : number;
    timestamp : number;
}

export interface TargetCreateRequest {
    user_id : number;
    x : number;
    y : number;
}

export interface TargetRemoveRequest {
    user_id : number;
}

export interface User {
    id : number;
    name : string;
    is_active : boolean;
    session_id : number;
}