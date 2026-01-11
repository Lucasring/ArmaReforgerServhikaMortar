import type { Point } from "./types";
import OpenSeadragon from "openseadragon";
import { MAP_SCALE_METERS_PER_PIXEL } from "./mortar_config";

export type CoordSpace = 'page' | 'viewport' | 'world';

function createElementSVG(tag : string) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function applyAttributes(el: SVGElement, attr: Record<string, string>) {
    Object.entries(attr).forEach(
        ([key, val]) => el.setAttribute(key, String(val))
    );
}

export function pageToViewport(
    viewer : OpenSeadragon.Viewer, point : Point
) : OpenSeadragon.Point {
    const viewport_rect = viewer.container.getBoundingClientRect();
    const viewer_pixel = new OpenSeadragon.Point(
        point.x - viewport_rect.left - window.scrollX,
        point.y - viewport_rect.top - window.scrollY
    );
    return viewer.viewport.pointFromPixel(viewer_pixel);
}

export function worldToViewport(
    viewer : OpenSeadragon.Viewer, point : Point
) : OpenSeadragon.Point {
    return viewer.viewport.imageToViewportCoordinates(
        new OpenSeadragon.Point(point.x, point.y)
    );
}

export function pageToWorldPixels(
    viewer : OpenSeadragon.Viewer, point : Point
) : Point {
    return viewer.viewport.viewportToImageCoordinates(
        pageToViewport(viewer, point)
    );
}

export function pageToWorldMeters(
    viewer : OpenSeadragon.Viewer, point : Point
) : Point {
    const pixel_point = pageToWorldPixels(viewer, point);
    return {
        x : pixel_point.x * MAP_SCALE_METERS_PER_PIXEL,
        y : pixel_point.y * MAP_SCALE_METERS_PER_PIXEL,
    }
}

export function drawCircle(
    center : Point, radius : number, attributes : Record<string, string>
) : SVGElement {
    const element = createElementSVG('circle');
    element.setAttribute('cx', String(center.x));
    element.setAttribute('cy', String(center.y));
    element.setAttribute('r',  String(radius));
    applyAttributes(element, attributes);
    return element
}

export function drawLine(
    p1 : OpenSeadragon.Point, p2 : OpenSeadragon.Point, attributes : Record<string, string>
) {
    const element = createElementSVG('line');
    element.setAttribute('x1', String(p1.x));
    element.setAttribute('y1', String(p1.y));
    element.setAttribute('x2', String(p2.x));
    element.setAttribute('y2', String(p2.y));
    applyAttributes(element, attributes);
    return element;
}

export function drawRing(
    center: OpenSeadragon.Point, radiusInMeters: number, attr: Record<string, string>
) {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const point : Point = {
        x : center.x + Math.cos(angle) * radiusInMeters, 
        y : center.y + Math.sin(angle) * radiusInMeters
      }
      points.push(point)
    }
    
    const element = createElementSVG('path');
    element.setAttribute('d', `M ${points.join(' L ')} Z`);
    applyAttributes(element, attr);
    return element;
}

export function drawText(
    text: string, position: OpenSeadragon.Point, attr: Record<string, string>
) {
    const element = createElementSVG('text');
    element.setAttribute('x', String(position.x));
    element.setAttribute('y', String(position.y));
    element.textContent = text;
    applyAttributes(element, attr);
    return element;
}