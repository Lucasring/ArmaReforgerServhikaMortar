import { MAP_SCALE_METERS_PER_PIXEL } from "$lib/mortar_config";

import type {Point} from "$lib/types";

export function calculateDistanceMeters(pointA : Point, pointB : Point) {
  if (!pointA || !pointB) return null;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const distanceMeters = Math.sqrt(dx * dx + dy * dy);
  return distanceMeters;
}

export function calculateAzimuthDegrees(pointA : Point, pointB : Point) {
  if (!pointA || !pointB) return null;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const azimuth = (360.0 + (Math.atan2(dx, -dy) * 180.0) / Math.PI) % 360.0;
  return Number(azimuth.toFixed(1));
}

export default {
  calculateDistanceMeters,
  calculateAzimuthDegrees,
};
