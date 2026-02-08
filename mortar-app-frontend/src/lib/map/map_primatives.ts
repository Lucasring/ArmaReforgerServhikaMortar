import type { Point } from "../types";
import OpenSeadragon from "openseadragon";
import { MAP_SCALE_METERS_PER_PIXEL } from "../mortar_config";

export type CoordSpace = 'page' | 'viewport' | 'world';

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