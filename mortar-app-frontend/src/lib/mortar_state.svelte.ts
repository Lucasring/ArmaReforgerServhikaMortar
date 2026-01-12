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
    mortar_type : '2B-14 Mortar' | '82mm Mortar' | null = $state(null);
    shell_type : string | null = $state(null);
    ring : number | null = $state(0);

    // Mortar Derived Details
    mortar_range : number | null = $derived.by(() => {
        if (this.mortar_type === null || this.shell_type === null || this.ring === null) return null;   

        return mortarTypes[this.mortar_type].ammo_types.find(
            (e) => e.name === this.shell_type
        )?.ballistics.rings[this.ring]?.at(-1)?.range ?? null;
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