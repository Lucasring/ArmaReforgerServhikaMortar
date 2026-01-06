
export interface Point {
    x : number;
    y : number;
}

export interface RingData {
    range : number;
    elevation_mils : number;
    time_to_impact : number;
}

export interface BallisticData {
    dispersions? : number[];
    rings : RingData[][];
}

export interface MortarAmmo {
    name : string;
    min_range : number;
    max_range : number;
    ballistics : BallisticData;
}

export interface Mortar {
    mortar_name : string;
    ammo_types : MortarAmmo[];
} 

export type MortarConfig = Record<string, Mortar>;