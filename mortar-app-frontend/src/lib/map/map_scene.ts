import type { Point } from "../types";
import { drawCircle, drawLine, drawRing, drawText } from "./map_primatives";

export type SvgCircle = SVGElement;
export type SvgRing = SVGElement;
export type SvgLine = SVGElement;
export type SvgText = SVGElement;

export interface SceneMortar {
    center : SvgCircle;
    max_range : SvgRing;
    min_range : SvgRing;
    range_text : SvgText;
}

export interface SceneTarget {
    center : SvgCircle;
    dispersion : SvgRing;
    dispersion_text : SvgText;
}

export interface SceneCrosshair {
    horizontal_right : SvgLine;
    horizontal_left : SvgLine;
    vertical_top : SvgLine;
    vertical_bottom : SvgLine;
}

export interface MapScene {
    mortar : SceneMortar | null;
    target : SceneTarget | null;
    crosshair : SceneCrosshair | null;
    target_path : SVGElement | null;
}

export function sceneAddMortar(
    position : Point,
    min_range : number,
    max_range : number
) : SceneMortar {
    const range_text_position = {
        x : position.x,
        y : position.y - (max_range + 5)
    }
    return {
        center : drawCircle(position, 5, { 
            fill: 'blue', stroke: 'blue', 'stroke-width': '5' 
        }),
        max_range : drawRing(position, max_range, {
            fill: 'none', stroke: 'blue', 'stroke-width': '5'
        }),
        min_range : drawRing(position, min_range, {
            fill: 'rgba(0, 0, 255, 0.1)', stroke: 'blue', 'stroke-width': '5'
        }),
        range_text : drawText(`${max_range}`, range_text_position, { 
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

export function sceneAddCrosshair(
    center : Point,
    map_width : number,
    map_height : number
) : SceneCrosshair {
    const padding : number = 100; // The gap from the center
    const style = { 'stroke': 'orange', 'stroke-width': 10 };

    return {
        // Horizontal Line - Left side
        horizontal_left : drawLine(
            { x : 0, y : center.y },             // Start at left edge of map
            { x : center.x - padding, y : center.y }, // End just before the center
            style
        ),
        // Horizontal Line - Right side
        horizontal_right : drawLine(
            { x : map_width, y : center.y },     // Start at right edge of map
            { x : center.x + padding, y : center.y }, // End just after the center
            style
        ),
        // Vertical Line - Top side
        vertical_top : drawLine(
            { x : center.x, y : 0 },              // Start at top edge of map
            { x : center.x, y : center.y - padding }, // End just above center
            style
        ),
        // Vertical Line - Bottom side
        vertical_bottom : drawLine(
            { x : center.x, y : map_height },     // Start at bottom edge of map
            { x : center.x, y : center.y + padding }, // End just below center
            style
        ),
    }
}