import {setContext, getContext} from 'svelte';
import type {Point} from '$lib/types';

/**
 * @brief Mortar State container for Global State access
 */
export class MortarState {

    position : Point = $state({x: 0, y: 0});
    type : string = $state('heavy');
    ring : number = 0;

    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
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