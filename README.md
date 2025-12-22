# Arma Reforger Mortar Helper

A desktop web application to assist Arma Reforger players in aiming mortars. The app allows users to select their position and a target on a provided ortho map, then calculates and displays required mortar firing solutions (azimuth and elevation).

## Features

- Interactive map with pan and zoom capabilities
- Left-click to set mortar position (blue marker)
- Right-click to set target position (red marker)
- Automatic calculation of:
  - Distance between mortar and target
  - Azimuth (degrees)
  - Elevation (degrees and mils)
  - Rings value
- Support for multiple mortar types and ammo types
- Range rings display for selected mortar/ammo combination

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Place your map image in the `public` directory as `map.jpg`

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

## Usage

1. Use the mouse wheel to zoom in/out on the map
2. Click and drag to pan the map
3. Left-click to set the mortar position (blue marker)
4. Right-click to set the target position (red marker)
5. Select mortar type and ammo type from the dropdown menus
6. View the calculated firing solution in the control panel

## Configuration

The application can be configured by modifying the following files:

- `src/config/mortarConfig.js`: Add or modify mortar types, ammo types, and their ballistics data
- `src/config/mortarConfig.js`: Adjust the `MAP_SCALE_METERS_PER_PIXEL` constant to match your map's scale

## Development

This project is built with:
- Svelte for the UI framework
- OpenSeadragon for map viewing
- Vite for development and building

## License

MIT 