export interface JoinSessionParams {
    session_name : string;
    username : string;
}

export interface JoinSessionResponse {
    user: User;
    session: Session;
}

export interface LeaveSessionParams {
    user_id : number;
}

export interface LeaveSessionResponse {
    user : User;
}

export interface AddTargetParams {
    session_id : number;
    user_id : number;
    x : number;
    y : number;
}

export interface AddTargetResponse {
    target : Target;
}

export interface GetSessionDataParams {
    session_id : number;
}

export interface GetSessionDataResposne {
    targets : Target[];
    users : User[];
}

export interface Target {
    id : number;
    session_id : number;
    user_id : number;
    x : number;
    y : number;
}

export interface User {
    id : number;
    username : string;
    session_id : number;
    is_active : boolean;
    last_activity_time : number;
}

export interface Session {
    id : number;
    session_name : string;
}