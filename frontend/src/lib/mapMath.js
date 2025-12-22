import { MAP_SCALE_METERS_PER_PIXEL } from "../config/mortarConfig";
import OpenSeadragon from 'openseadragon';

// Pure helpers for map math and conversions.
// Keep these small and testable.

export function calculateDistanceMeters(pointA, pointB) {
  if (!pointA || !pointB) return null;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const distancePixels = Math.sqrt(dx * dx + dy * dy);
  // Convert pixels to meters using configured scale
  const distanceMeters = distancePixels * MAP_SCALE_METERS_PER_PIXEL;
  return distanceMeters;
}

export function calculateAzimuthDeg(pointA, pointB) {
  if (!pointA || !pointB) return null;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  // atan2 expects (y, x) usually, but original app uses atan2(dx, -dy)
  // replicate that behavior to keep azimuth consistent with previous UI
  const azimuth = (360.0 + (Math.atan2(dx, -dy) * 180.0) / Math.PI) % 360.0;
  return Number(azimuth.toFixed(1));
}

// OpenSeadragon-aware conversions: these wrap viewer calls so tests can mock viewer
export function pointFromPixel(viewer, pixel) {
  if (!viewer || !viewer.viewport || !pixel) return null;
  try {
    const p = typeof pixel.x === 'number' && typeof pixel.y === 'number'
      ? (OpenSeadragon && OpenSeadragon.Point ? new OpenSeadragon.Point(pixel.x, pixel.y) : { x: pixel.x, y: pixel.y })
      : pixel;
    // prefer viewport.pointFromPixel if available
    if (viewer.viewport && typeof viewer.viewport.pointFromPixel === 'function') {
      return viewer.viewport.pointFromPixel(p);
    }
    return null;
  } catch (e) {
    console.error('mapMath.pointFromPixel error', e);
    return null;
  }
}

export function pixelFromPoint(viewer, point) {
  if (!viewer || !viewer.viewport || !point) return null;
  try {
    const p = typeof point.x === 'number' && typeof point.y === 'number'
      ? (OpenSeadragon && OpenSeadragon.Point ? new OpenSeadragon.Point(point.x, point.y) : { x: point.x, y: point.y })
      : point;
    if (viewer.viewport && typeof viewer.viewport.pixelFromPoint === 'function') {
      return viewer.viewport.pixelFromPoint(p);
    }
    return null;
  } catch (e) {
    console.error('mapMath.pixelFromPoint error', e);
    return null;
  }
}

export default {
  calculateDistanceMeters,
  calculateAzimuthDeg,
  pointFromPixel,
  pixelFromPoint,
};
