import OpenSeadragon from 'openseadragon';
import { writable } from 'svelte/store';
import { pointFromPixel as mathPointFromPixel, pixelFromPoint as mathPixelFromPoint } from '../lib/mapMath.js';

export const viewerStore = writable(null);
export const overlayStore = writable(null);

// Positions are now stored centrally so other components can read/write them
export const mortarPosition = writable(null);
export const targetPosition = writable(null);

let updateListeners = new Set();
let viewerInstance = null;
let viewerElementRef = null;

function notifyUpdates() {
  for (const fn of updateListeners) {
    try {
      fn();
    } catch (e) {
      console.error('mapStore update listener error', e);
    }
  }
}

export function init(viewerElement) {
  if (!viewerElement) return;
  viewerElementRef = viewerElement;
  try {
    const viewer = OpenSeadragon({
      id: viewerElement.id || 'map-viewer',
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.1.0/images/',
      tileSources: {
        type: 'image',
        url: '/map.jpg',
      },
      showNavigationControl: true,
      showRotationControl: true,
      gestureSettingsMouse: {
        clickToZoom: false,
      },
      debugMode: true,
      maxZoomLevel: 10,
      springStiffness: 150,
    });

    viewerInstance = viewer;
    viewerStore.set(viewer);

    let overlay;
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '10';
      try {
        if (viewer && viewer.canvas && viewer.canvas.appendChild) {
          viewer.canvas.appendChild(overlay);
        } else if (viewerElement && viewerElement.appendChild) {
          viewerElement.appendChild(overlay);
        }
      } catch (e) {
        // ignore append errors in non-browser environments
      }
    } else {
      overlay = {
        innerHTML: '',
        appendChild: () => {},
        style: {},
      };
    }
    overlayStore.set(overlay);

    viewer.addHandler('open', () => {
      notifyUpdates();
    });

    viewer.addHandler('animation', notifyUpdates);
    viewer.addHandler('pan', notifyUpdates);
    viewer.addHandler('zoom', notifyUpdates);

    viewer.addHandler('tile-loaded-failed', (event) => {
      console.error('Tile load failed:', event);
    });

    viewer.addHandler('ready', () => {});
  } catch (error) {
    console.error('Error initializing OpenSeadragon in mapStore:', error);
  }
}

// Accept an existing OpenSeadragon viewer instance (useful when another
// component creates the viewer). This will wire the store to the viewer and
// create/attach an overlay if needed.
export function setViewer(viewer, viewerElement) {
  if (!viewer) return;
  viewerInstance = viewer;
  viewerStore.set(viewer);
  viewerElementRef = viewerElement || viewerElementRef;

  let overlay;
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '10';
    try {
      if (viewer && viewer.canvas && viewer.canvas.appendChild) {
        viewer.canvas.appendChild(overlay);
      } else if (viewerElementRef && viewerElementRef.appendChild) {
        viewerElementRef.appendChild(overlay);
      }
    } catch (e) {
      // ignore
    }
  } else {
    overlay = { innerHTML: '', appendChild: () => {}, style: {} };
  }
  overlayStore.set(overlay);

  // wire handlers
  try {
    viewer.addHandler && viewer.addHandler('open', notifyUpdates);
    viewer.addHandler && viewer.addHandler('animation', notifyUpdates);
    viewer.addHandler && viewer.addHandler('pan', notifyUpdates);
    viewer.addHandler && viewer.addHandler('zoom', notifyUpdates);
  } catch (e) {
    console.error('setViewer handler attach error', e);
  }
}

export function getViewer() {
  return viewerInstance;
}

export function pointFromPixel(pixel) {
  // wrapper around mapMath.pointFromPixel to keep store thin
  if (!viewerInstance) return null;
  try {
    return mathPointFromPixel(viewerInstance, pixel);
  } catch (e) {
    console.error('pointFromPixel error', e);
    return null;
  }
}

export function pixelFromPoint(point) {
  if (!viewerInstance) return null;
  try {
    return mathPixelFromPoint(viewerInstance, point);
  } catch (e) {
    console.error('pixelFromPoint error', e);
    return null;
  }
}

export function setMortarPosition(point) {
  mortarPosition.set(point);
  notifyUpdates();
}

export function setTargetPosition(point) {
  targetPosition.set(point);
  notifyUpdates();
}

export function setMortarPositionFromPixel(pixel) {
  const vp = pointFromPixel(pixel);
  if (!vp) return;
  setMortarPosition({ x: vp.x, y: vp.y });
}

export function setTargetPositionFromPixel(pixel) {
  const vp = pointFromPixel(pixel);
  if (!vp) return;
  setTargetPosition({ x: vp.x, y: vp.y });
}

export function onUpdate(fn) {
  updateListeners.add(fn);
  return () => updateListeners.delete(fn);
}

export default {
  init,
  onUpdate,
  viewerStore,
  overlayStore,
  mortarPosition,
  targetPosition,
  getViewer,
  pointFromPixel,
  pixelFromPoint,
  setMortarPosition,
  setTargetPosition,
  setMortarPositionFromPixel,
  setTargetPositionFromPixel,
};
