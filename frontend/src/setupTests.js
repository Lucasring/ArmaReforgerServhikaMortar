import { expect as vitestExpect } from 'vitest';
// Ensure `expect` is available as a global before importing jest-dom
globalThis.expect = vitestExpect;

// Ensure a DOM exists for testing; Vitest's jsdom environment should
// normally provide this, but add a fallback so tests run reliably.
if (typeof document === 'undefined' || typeof window === 'undefined') {
	try {
		const { JSDOM } = await import('jsdom');
		const dom = new JSDOM('<!doctype html><html><body></body></html>');
		globalThis.window = dom.window;
		globalThis.document = dom.window.document;
		globalThis.navigator = { userAgent: 'node.js' };
		globalThis.HTMLElement = dom.window.HTMLElement;
		globalThis.Node = dom.window.Node;
	} catch (e) {
		// If jsdom import fails, tests will likely fail; rethrow to surface issue
		console.warn('Could not create JSDOM fallback:', e);
	}
}

import '@testing-library/jest-dom';
