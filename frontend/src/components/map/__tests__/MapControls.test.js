import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect } from 'vitest';

// mock mapStore functions before importing component
vi.mock('../../../stores/mapStore.js', () => ({
  setMortarPositionFromPixel: vi.fn(),
  setTargetPositionFromPixel: vi.fn(),
}));

import MapControls from '../MapControls.svelte';
import * as mapStore from '../../../stores/mapStore.js';

describe('MapControls', () => {
  it('calls setMortarPositionFromPixel when Set Mortar Position clicked', async () => {
    const { component, getByText } = render(MapControls);
    // open menu at 10,20
    if (component.openMenu) component.openMenu({ x: 10, y: 20 });

    const btn = getByText('Set Mortar Position');
    await fireEvent.click(btn);

    expect(mapStore.setMortarPositionFromPixel).toHaveBeenCalledWith({ x: 10, y: 20 });
  });

  it('calls setTargetPositionFromPixel when Set Target Position clicked', async () => {
    const { component, getByText } = render(MapControls);
    if (component.openMenu) component.openMenu({ x: 15, y: 25 });

    const btn = getByText('Set Target Position');
    await fireEvent.click(btn);

    expect(mapStore.setTargetPositionFromPixel).toHaveBeenCalledWith({ x: 15, y: 25 });
  });
});
