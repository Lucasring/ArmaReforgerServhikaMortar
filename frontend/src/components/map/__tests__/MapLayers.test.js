import { render } from '@testing-library/svelte';
import { vi, describe, it, expect } from 'vitest';

// Provide a mock mapStore with writable stores
vi.mock('../../../stores/mapStore.js', () => {
  const { writable } = require('svelte/store');
  const overlayEl = document.createElement('div');
  const viewer = {
    viewport: {
      pixelFromPoint: (p) => ({ x: p.x * 2, y: p.y * 2 }),
      getContainerSize: () => ({ x: 100, y: 100 }),
    },
    world: {
      getItemAt: () => ({ getContentSize: () => ({ x: 1000, y: 1000 }) }),
    },
    canvas: { appendChild: () => {} },
  };
  return {
    viewerStore: writable(viewer),
    overlayStore: writable(overlayEl),
    mortarPosition: writable({ x: 10, y: 20 }),
    targetPosition: writable({ x: 30, y: 40 }),
  };
});

import MapLayers from '../MapLayers.svelte';
import * as mapStore from '../../../stores/mapStore.js';

describe('MapLayers', () => {
  it('renders svg into overlay when positions present', async () => {
    const { container } = render(MapLayers, { props: { selectedRing: 0 } });
    const overlayModule = await import('../../../stores/mapStore.js');
    const overlay = overlayModule.overlayStore;
    let val;
    overlay.subscribe((v) => (val = v))();
    expect(val.innerHTML).toContain('<svg');
  });
});
