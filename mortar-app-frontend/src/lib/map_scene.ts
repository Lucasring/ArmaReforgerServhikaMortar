import OpenSeadragon, { Viewer } from "openseadragon";
import { Point } from "./types";
import { drawCircle, drawRing, drawText } from "./osd_map_primatives";
import { getMortarState, MortarState } from "./mortar_state.svelte";

export type SvgCircle = SVGElement;
export type SvgRing = SVGElement;
export type SvgLine = SVGElement;
export type SvgText = SVGElement;

export interface SceneMortar {
    center : SvgCircle;
    range : SvgRing;
    range_text : SvgText;
}

export interface SceneTarget {
    center : SvgCircle;
    dispersion : SvgRing;
    dispersion_text : SvgText;
}

export interface MapScene {
    mortar : SceneMortar | null;
    target : SceneTarget | null;
    target_path : SvgLine | null;
}

export function sceneAddMortar(
    position : Point,
    range : number
) : SceneMortar {
    return {
        center : drawCircle(position, 5, { 
            fill: 'blue', stroke: 'blue', 'stroke-width': '1' 
        }),
        range : drawRing(position, range, {
            fill: 'none', stroke: 'blue', 'stroke-width': '1'
        }),
        range_text : drawText(`${range}`, position, { 
            fill: 'blue', 'font-size': '14px', 'font-weight': 'bold', 'text-anchor': 'middle'
        })
    }
}

export function sceneAddTarget(
    position : Point,
    dispersion : number,
) : SceneTarget {
    return {
        center : drawCircle(position, 5, {
            fill: 'red', stroke: 'red', 'stroke-width': '1' 
        }),
        dispersion : drawRing(position, dispersion, {
            fill: 'none', stroke: 'red', 'stroke-width': '1'
        }),
        dispersion_text : drawText(`${dispersion}`, position, { 
            fill: 'red', 'font-size': '14px', 'font-weight': 'bold', 'text-anchor': 'middle'
        })
    }
}