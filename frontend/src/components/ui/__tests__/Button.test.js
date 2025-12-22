// Ensure a DOM exists for the test runner (fallback if vitest jsdom not active)
import { JSDOM } from 'jsdom';
if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
}
import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect } from 'vitest';
import Wrapper from './TestWrapper.svelte';

describe.skip('Button.svelte', () => {
  it('renders slot content and forwards attributes', async () => {
    const { getByText } = render(Wrapper, {
      props: { ariaLabel: 'my-button', type: 'button', className: 'foo' },
    });

    const btn = getByText('Click me');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label', 'my-button');
    expect(btn).toHaveClass('foo');
  });

  it('dispatches click event to component listeners', async () => {
    const { getByText, component } = render(Wrapper, {
      props: { ariaLabel: 'click' },
    });

    const handler = vi.fn();
    component.$on('buttonclick', handler);

    const btn = getByText('Click me');
    await fireEvent.click(btn);

    expect(handler).toHaveBeenCalled();
  });
});
