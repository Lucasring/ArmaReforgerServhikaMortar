import {setContext, getContext} from 'svelte';
import { calculateDistanceMeters, calculateAzimuthDegrees } from './map/map_math';
import type {Point} from '$lib/types';
import { mortarTypes } from './mortar_config';
import type { Mortar, MortarAmmo, RingData } from './mortar_config_types';

/**
 * @brief Mortar State container for Global State access
 */
export class MortarState {
    
    // Mortar Details
    mouse_position : Point | null = $state(null);
    mortar_position : Point | null = $state(null);
    mortar_type : '2B-14 Mortar' | '82mm Mortar' | null = $state('2B-14 Mortar');
    shell_type : string | null = $state('HE Shell');
    ring : number = $state(0);

    // Mortar Derived Details
    mortar_max_range : number | null = $derived.by(() => {
        return this.currentRingData?.at(-1)?.range ?? null;
    });

    mortar_min_range: number | null = $derived.by(() => {
        return this.currentRingData?.at(0)?.range ?? null;
    });

    mortar_elevation: number | null = $derived.by(() => {
        const data = this.currentRingData;
        const dist = this.target_distance;
        if (!data || !dist) return null;

        for (let i = 1; i < data.length; i++) {
            if (data[i].range >= dist) {
                const lower = data[i - 1];
                const upper = data[i];
                const progress = (dist - lower.range) / (upper.range - lower.range);
                return lower.elevation_mils + (upper.elevation_mils - lower.elevation_mils) * progress;
            }
        }
        return data.at(-1)?.elevation_mils ?? null;
    });

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
        return this.selectedAmmoConfig?.ballistics.dispersions?.[this.ring] ?? null;
    })
    
    target_time_to_impact: number | null = $derived.by(() => {
        const data = this.currentRingData;
        const dist = this.target_distance;
        if (!data || !dist) return null;

        for (let i = 1; i < data.length; i++) {
            if (data[i].range >= dist) {
                const lower = data[i - 1];
                const upper = data[i];
                const progress = (dist - lower.range) / (upper.range - lower.range);
                return lower.time_to_impact + (upper.time_to_impact - lower.time_to_impact) * progress;
            }
        }
        return data.at(-1)?.time_to_impact ?? null;
    });

    /**
     * @brief Helper: Gets the configuration for the currently selected mortar
     */
    get selectedMortarConfig(): Mortar | null {
        if (!this.mortar_type) return null;
        return mortarTypes[this.mortar_type] ?? null;
    }

    /**
     * @brief Helper: Gets the configuration for the currently selected ammo shell
     */
    get selectedAmmoConfig(): MortarAmmo | null {
        const mortar = this.selectedMortarConfig;
        if (!mortar || !this.shell_type) return null;
        return mortar.ammo_types.find(a => a.name === this.shell_type) ?? null;
    }

    /**
     * @brief Helper: Gets the ballistic data array for the current ring/charge
     */
    get currentRingData(): RingData[] | null {
        const ammo = this.selectedAmmoConfig;
        if (!ammo || this.ring === null) return null;
        return ammo.ballistics.rings[this.ring] ?? null;
    }

    /**
     * @brief Automatically adjusts the mortar ring/charge based on current target distance
     */
    autoAdjustRing() {
        if (!this.target_distance || !this.selectedAmmoConfig) return;

        const rings = this.selectedAmmoConfig.ballistics.rings;
        let changed = false;

        // 1. If we are too far, increase charge until we fit or hit the limit
        while (this.ring < rings.length - 1 && (rings[this.ring].at(-1)?.range ?? 0) < this.target_distance) {
            this.ring++;
            changed = true;
        }

        // 2. If we are too close, decrease charge only if the lower charge can actually reach
        while (this.ring > 0 && (rings[this.ring - 1].at(-1)?.range ?? 0) >= this.target_distance) {
            this.ring--;
            changed = true;
        }

        return changed;
    }

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