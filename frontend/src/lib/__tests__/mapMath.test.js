import { describe, it, expect } from 'vitest';
import { calculateDistanceMeters, calculateAzimuthDeg } from '../mapMath.js';

describe('mapMath helpers', () => {
  it('calculates distance in meters consistently', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 3, y: 4 }; // 5 pixels distance
    const meters = calculateDistanceMeters(a, b);
    // meters should be numeric and > 0
    expect(typeof meters).toBe('number');
    expect(meters).toBeGreaterThan(0);
  });

  it('calculates azimuth degrees', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 0, y: -1 }; // straight up in screen coords -> specific azimuth
    const az = calculateAzimuthDeg(a, b);
    expect(typeof az).toBe('number');
  });
});
