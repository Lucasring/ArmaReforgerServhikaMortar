import type { Point } from "../types";
import { drawCircle, drawRing, drawText } from "./map_primatives";

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
    target_path : SVGElement | null;
}

export function sceneAddMortar(
    position : Point,
    range : number
) : SceneMortar {
    const range_text_position = {
        x : position.x,
        y : position.y - (range + 5)
    }
    return {
        center : drawCircle(position, 5, { 
            fill: 'blue', stroke: 'blue', 'stroke-width': '5' 
        }),
        range : drawRing(position, range, {
            fill: 'none', stroke: 'blue', 'stroke-width': '5'
        }),
        range_text : drawText(`${range}`, range_text_position, { 
            fill: 'blue', 'font-size': '50px', 'font-weight': 'bold', 'text-anchor': 'middle'
        })
    }
}

export function sceneAddTarget(
    position : Point,
    dispersion : number,
) : SceneTarget {
    const dispersion_text_position = {
        x : position.x,
        y : position.y - (dispersion + 5)
    }
    return {
        center : drawCircle(position, 5, {
            fill: 'red', stroke: 'red', 'stroke-width': '5' 
        }),
        dispersion : drawRing(position, dispersion, {
            fill: 'none', stroke: 'red', 'stroke-width': '5'
        }),
        dispersion_text : drawText(`${dispersion}`, dispersion_text_position, { 
            fill: 'red', 'font-size': '50px', 'font-weight': 'bold', 'text-anchor': 'middle'
        })
    }
}