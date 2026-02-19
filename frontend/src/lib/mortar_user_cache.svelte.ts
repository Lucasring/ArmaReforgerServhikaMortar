import {setContext, getContext} from 'svelte';
import type { Point } from './types';

export interface CachedPosition {
    position : Point;
    label : string;
}

export class MortarUserCache {

    target_position_list: CachedPosition[] = $state([]);
    mortar_position_list: CachedPosition[] = $state([]);

    // --- ADD METHODS ---

    addMortarPosition(position: Point, label: string) {
        // Check if a mortar already exists at this exact coordinate
        const exists = this.mortar_position_list.some(
            p => p.position.x === position.x && p.position.y === position.y
        );
        
        if (!exists) {
            this.mortar_position_list.push({ position, label });
        }
    }

    addTargetPosition(position: Point, label: string) {
        const exists = this.target_position_list.some(
            p => p.position.x === position.x && p.position.y === position.y
        );

        if (!exists) {
            this.target_position_list.push({ position, label });
        }
    }

    // --- REMOVE BY INDEX (Fastest for UI lists) ---

    removeMortarPosition(index: number) {
        if (index >= 0 && index < this.mortar_position_list.length) {
            this.mortar_position_list.splice(index, 1);
        }
    }

    removeTargetPosition(index: number) {
        if (index >= 0 && index < this.target_position_list.length) {
            this.target_position_list.splice(index, 1);
        }
    }

    // --- REMOVE BY LABEL (Best for named markers) ---

    removeMortarByLabel(label: string) {
        this.mortar_position_list = this.mortar_position_list.filter(
            p => p.label !== label
        );
    }

    removeTargetByLabel(label: string) {
        this.target_position_list = this.target_position_list.filter(
            p => p.label !== label
        );
    }

}


/** 
 * @brief Global Context KEY for Mortar State 
 */ 
const MORTAR_STATE_KEY = Symbol('mortar_user_cache');

/**
 * @brief Initialize the MortarUserCache for usage within the component
 * @returns MortarUserCache
 */
export function initMortarUserCache() : MortarUserCache {
    return setContext(MORTAR_STATE_KEY, new MortarUserCache());
}

/** 
 * @brief Get the MortarUserCache from the component context
 * @brief The MortarUserCache
*/
export function getMortarUserCache() : MortarUserCache {
    return getContext<MortarUserCache>(MORTAR_STATE_KEY);
}