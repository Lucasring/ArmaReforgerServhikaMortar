import {setContext, getContext} from 'svelte';
import { calculateDistanceMeters, calculateAzimuthDegrees } from './map_math';

import type {Point} from '$lib/types';
/**
 * @brief Mortar State container for Global State access
 */
export class MortarState {
    
    // Mortar Details
    mortar_position : Point | null = $state(null);
    mortar_type : string | null = $state(null);
    shell_type : string | null = $state(null);
    ring : number | null = $state(0);

    // Target Details
    target_position : Point | null = $state(null);

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