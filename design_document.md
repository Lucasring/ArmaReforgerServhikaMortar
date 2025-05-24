# Arma Reforger Mortar Helper

**System Requirements & Design Document**

## 1. Purpose

Develop a single-page, desktop-focused Svelte web application to assist Arma Reforger players in aiming mortars. The app will allow a user to select their position and a target on a provided ortho map, then calculate and display required mortar firing solutions (azimuth and elevation).

---

## 2. Functional Requirements

### 2.1 Map Display

* Display a **provided ortho, top-down map image** as the background.
* Allow **smooth pan and zoom**, suitable for large high-res images (implement using a tile-based viewer like OpenSeadragon or Leaflet for static images).
* Only **one map** is supported at a time; the image path and real-world scale (meters/pixel) will be set in the configuration code.

### 2.2 Positioning

* **Left-click** on the map to set the **mortar location** (blue marker).
* **Right-click** on the map to set the **target location** (red marker).
* Markers must be visually distinct.
* Allow repositioning by clicking again.
* Only one mortar and one target are active at any time.

### 2.3 Calculation and Overlay

* **Calculate the real-world distance** between mortar and target (using meters/pixel scale, set in code/config).
* **Calculate azimuth (degrees)**: The bearing from the mortar to the target, relative to map north (0 = up).
* **Calculate elevation**: The firing angle required to hit the target. Display in both **degrees and mils** (1 degree = 17.777... mils).
* **Rings**: Calculate a “rings” value via a separate function (mock for now; design interface for real data later).
* **Display output**: Show all calculations in a side panel or overlay:

  * Distance (meters)
  * Azimuth (degrees, 0-360)
  * Elevation (degrees & mils)
  * Rings (unitless, as computed)
* **Overlay graphics**:

  * Draw a line from mortar to target.
  * Draw min/max range rings (in meters) for the selected mortar/ammo, centered on the mortar.
  * Markers for positions.

### 2.4 Ammo & Mortar Type Selection

* Allow the user to select from **multiple ammo types** and **multiple mortar types** via dropdown menus.
* Changing selection updates calculation logic.
* Ammo/mortar data loaded from mock config (expandable later).

### 2.5 Usability

* Desktop layout only; mobile/responsive not required.
* Clear UI for setting/clearing positions and selecting options.
* No authentication or user accounts.
* No map switching, export, or screenshot features.

---

## 3. Non-Functional Requirements

* Runs entirely client-side in browser (no backend/server).
* Works in all major modern desktop browsers.
* Efficiently handles large map images via tiling/deep-zoom.
* Easily extensible to support new maps, mortars, or ammo types by editing JSON/config.

---

## 4. Technical Design

### 4.1 Tech Stack

* **Frontend:** Svelte
* **Map Viewer:** [OpenSeadragon](https://openseadragon.github.io/) (recommended for static, high-res image tiles)
* **Overlay:** Svelte SVG layer for markers, lines, and rings

### 4.2 Data Structures

#### Mortar/Ammo Config (example, to be mocked)

```js
const mortarTypes = [
  {
    name: "82mm Mortar",
    ammo: [
      {
        name: "HE Shell",
        minRange: 100,
        maxRange: 2000,
        // Table or formula for range-to-elevation/rings:
        ballistics: [
          { range: 500, elevationDeg: 85, rings: 10 },
          { range: 1000, elevationDeg: 70, rings: 5 },
          // etc...
        ]
      },
      // More ammo types
    ]
  },
  // More mortar types
];
```

* **Map config:**

  ```js
  const MAP_SCALE_METERS_PER_PIXEL = 0.5; // Example; set per map
  ```

### 4.3 Calculations

* **Distance:**
  Use Euclidean distance between two points, scaled by `meters_per_pixel`.
* **Azimuth (degrees):**

  ```
  azimuth = (360 + atan2(deltaX, -deltaY) * 180/π) % 360
  // (Assumes Y-down coordinate system; adjust as needed)
  ```
* **Elevation (deg/mils):**

  * Look up or interpolate in ballistics table for current mortar/ammo and range.
  * Display both degrees and mils: `mils = degrees * 17.7778`
* **Rings:**
  Use a mock function `rings = f(range, ammo, mortar)`; replace later with real game data.

### 4.4 UI Layout

* **Main Area:** Map viewer with overlays.
* **Side Panel:** Selection dropdowns (mortar type, ammo type), calculation output, clear/reset buttons.
* **Overlays:** SVG markers, lines, and rings.

---

## 5. Example User Flow

1. **Load site**: See map, controls for mortar/ammo type.
2. **Set positions**: Left-click to set mortar, right-click to set target.
3. **Review data**: Side panel shows range, azimuth, elevation, and rings.
4. **Adjust**: Reposition by clicking again or change ammo/mortar as needed.
5. **Reset**: Button to clear all positions and overlays.

---

## 6. Extensibility

* Add new mortars, ammo types, or maps via config/JSON.
* In future, can support map switching or mobile layout.

---

## 7. Out of Scope

* Mobile support.
* Multiple mortars/targets.
* Map switching.
* State persistence or user accounts.
* Export or screenshot functionality.

---

## 8. Mock Interfaces (for Developer)

* Function to **look up ballistics**:

  ```js
  function getElevationAndRings(range, mortarType, ammoType) {
      // Returns { elevationDeg, rings }
      // For now, mock with linear interpolation or fixed values
  }
  ```
* Configurable **map scale** (meters/pixel) as a constant or settable parameter in code.