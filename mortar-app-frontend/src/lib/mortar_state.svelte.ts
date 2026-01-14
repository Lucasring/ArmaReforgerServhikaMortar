import {setContext, getContext} from 'svelte';
import { calculateDistanceMeters, calculateAzimuthDegrees } from './map/map_math';
import type {Point} from '$lib/types';
import { mortarTypes } from './mortar_config';

/**
 * @brief Mortar State container for Global State access
 */
export class MortarState {
    
    // Mortar Details
    mortar_position : Point | null = $state(null);
    mortar_type : '2B-14 Mortar' | '82mm Mortar' | null = $state('2B-14 Mortar');
    shell_type : string | null = $state('HE Shell');
    ring : number | null = $state(0);

    // Mortar Derived Details
    mortar_max_range : number | null = $derived.by(() => {
        if (this.mortar_type === null || this.shell_type === null || this.ring === null) return null;   

        return mortarTypes[this.mortar_type].ammo_types.find(
            (e) => e.name === this.shell_type
        )?.ballistics.rings[this.ring]?.at(-1)?.range ?? null;
    })

    mortar_min_range : number | null = $derived.by(() => {
        if (this.mortar_type === null || this.shell_type === null || this.ring === null) return null;   

        return mortarTypes[this.mortar_type].ammo_types.find(
            (e) => e.name === this.shell_type
        )?.ballistics.rings[this.ring]?.at(0)?.range ?? null;
    })

    mortar_elevation : number | null = $derived.by(() => {
        if (this.mortar_type === null || this.shell_type === null || this.ring === null) return null;

        const ring_data = mortarTypes[this.mortar_type].ammo_types.find(
            (e) => e.name === this.shell_type
        )?.ballistics.rings[this.ring] ?? null;

        if (!ring_data || !this.target_distance) {
            return null;
        }
        
        for (let i = 1; i < ring_data?.length; i++) {
            if (ring_data[i].range >= this.target_distance) {
                const lower = ring_data[i - 1];
                const upper = ring_data[i];
                const range_delta = upper.range - lower.range;
                const elevation_delta = upper.elevation_mils - lower.elevation_mils
                const progress = (this.target_distance - lower.range) / range_delta
                return lower.elevation_mils + (elevation_delta * progress); 
            }
        }
 
        return ring_data.at(-1)?.elevation_mils ?? null;
    })

    // Target Details
    target_position : Point | null = $state(null);

    // Target Derived Details
    target_distance : number | null = $derived.by(() => {
        if (this.mortar_position && this.target_position) {
            return calculateDistanceMeters(this.mortar_position, this.target_position);
        }
        return null;
    });

    target_azimuth : number | null = $derived.by(() => {
        if (this.mortar_position && this.target_position) {
            return calculateAzimuthDegrees(this.mortar_position, this.target_position);
        }
        return null;
    });

    target_dispersion : number | null = $derived.by(() => {
        if (this.mortar_type === null || this.shell_type === null || this.ring === null) return null;   

        return mortarTypes[this.mortar_type].ammo_types.find(
            (e) => e.name === this.shell_type
        )?.ballistics.dispersions?.[this.ring] ?? null;
    })
    
    target_time_to_impact : number | null = $derived.by(() => {
        if (this.mortar_type === null || this.shell_type === null || this.ring === null) return null;   
        
        const ring_data = mortarTypes[this.mortar_type].ammo_types.find(
            (e) => e.name === this.shell_type
        )?.ballistics.rings[this.ring] ?? null;
    
        if (!ring_data || !this.target_distance) {
            return null;
        }

        for (let i = 1; i < ring_data?.length; i++) {
            if (ring_data[i].range >= this.target_distance) {
                const lower = ring_data[i - 1];
                const upper = ring_data[i];
                const range_delta = upper.range - lower.range;
                const time_to_impact_delta = upper.time_to_impact - lower.time_to_impact
                const progress = (this.target_distance - lower.range) / range_delta
                return lower.time_to_impact + (time_to_impact_delta * progress); 
            }
        }
 
        return ring_data.at(-1)?.time_to_impact ?? null;
    })

}

/** 
 * @brief Global Context KEY for Mortar State 
 */ 
const MORTAR_STATE_KEY = Symbol('mortar_state');

/**
 * @brief Initialize the MortarState for usage within the component
 * @returns MotarState
 */
export function initMortarState() : MortarState {
    return setContext(MORTAR_STATE_KEY, new MortarState());
}

/** 
 * @brief Get the MortarState from the component context
 * @brief The MortarState
*/
export function getMortarState() : MortarState {
    return getContext<MortarState>(MORTAR_STATE_KEY);
}