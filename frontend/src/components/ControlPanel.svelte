<script>
  import { run } from 'svelte/legacy';

  import { createEventDispatcher } from "svelte";
  import {
    MAP_SCALE_METERS_PER_PIXEL,
    mortarTypes,
  } from "../config/mortarConfig";

  /**
   * @typedef {Object} Props
   * @property {any} selectedMortarType
   * @property {any} selectedAmmoType
   * @property {any} mortarPosition
   * @property {any} targetPosition
   * @property {number} [selectedRing] - Default to outermost ring (Ring 0)
   */

  /** @type {Props} */
  let {
    selectedMortarType,
    selectedAmmoType,
    mortarPosition,
    targetPosition,
    selectedRing = $bindable(0)
  } = $props();

  const dispatch = createEventDispatcher();

  // Declare variables for calculations
  let distance = $state(null);
  let azimuth = $state(null);
  let elevation = $state(null);
  let autoSelectRing = $state(false);
  let rangeWarning = $state("");

  function findAppropriateRing(range, ballistics) {
    if (!ballistics || !ballistics.rings || ballistics.rings.length === 0) {
      ;
      return null;
    }

    // Find the smallest ring that can accommodate the range
    for (let i = 0; i < ballistics.rings.length; i++) {
      const ringData = ballistics.rings[i];
      if (!ringData || ringData.length < 2) {
        // console.log("Invalid ring data for ring:", i);
        continue;
      }

      const minRange = Math.min(...ringData.map((point) => point.range));
      const maxRange = Math.max(...ringData.map((point) => point.range));

      // Check if range is within this ring's limits
      if (range >= minRange && range <= maxRange) {
        // Check if range is comfortably within limits (not too close to edges)
        const rangeBuffer = (maxRange - minRange) * 0.1; // 10% buffer
        if (
          range >= minRange + rangeBuffer &&
          range <= maxRange - rangeBuffer
        ) {
          rangeWarning = "";
          ;
          return i;
        } else {
          rangeWarning = `Warning: Range is close to the limits of Ring ${i}`;
          ;
          return i;
        }
      }
    }

    // If no ring can accommodate the range, use the highest ring
    const highestRing = ballistics.rings.length - 1;
    if (
      highestRing >= 0 &&
      ballistics.rings[highestRing] &&
      ballistics.rings[highestRing].length >= 2
    ) {
      rangeWarning = "Warning: Target is out of range for all available rings";
      ;
      return highestRing;
    }

    ;
    return null;
  }

  function handleMortarTypeChange(event) {
    const newMortarType = mortarTypes.find(
      (m) => m.name === event.target.value,
    );
    if (newMortarType) {
      dispatch("mortarTypeChange", newMortarType);
    }
  }

  function handleAmmoTypeChange(event) {
    if (selectedMortarType && selectedMortarType.ammo) {
      const newAmmoType = selectedMortarType.ammo.find(
        (a) => a.name === event.target.value,
      );
      if (newAmmoType) {
        dispatch("ammoTypeChange", newAmmoType);
      }
    }
  }

  function handleRingChange(event) {
    const newRing = parseInt(event.target.value);
    if (!isNaN(newRing)) {
      selectedRing = newRing;
      // console.log("Ring manually changed to:", selectedRing);
      dispatch("ringChange", selectedRing);
    }
  }

  function handleAutoSelectChange(event) {
    autoSelectRing = event.target.checked;
    if (
      autoSelectRing &&
      distance !== null &&
      selectedAmmoType &&
      selectedAmmoType.ballistics
    ) {
      const appropriateRing = findAppropriateRing(
        distance,
        selectedAmmoType.ballistics,
      );
      if (appropriateRing !== null) {
        selectedRing = appropriateRing;
        //console.log("Auto-select enabled, selected ring:", appropriateRing);
        dispatch("ringChange", appropriateRing);
      }
    }
  }

  function calculateDistance(mortarPos, targetPos) {
    if (!mortarPos || !targetPos) return null;

    const dx = targetPos.x - mortarPos.x;
    const dy = targetPos.y - mortarPos.y;
    const distancePixels = Math.sqrt(dx * dx + dy * dy);
    const distanceInPixels = distancePixels * 163.03;
    const distance = distanceInPixels * MAP_SCALE_METERS_PER_PIXEL;

    return Math.round(distance * 71);
  }

  function calculateAzimuth(mortarPos, targetPos) {
    if (!mortarPos || !targetPos) return null;

    const dx = parseFloat(targetPos.x - mortarPos.x);
    const dy = parseFloat(targetPos.y - mortarPos.y);
    let azimuth = (360.0 + (Math.atan2(dx, -dy) * 180.0) / Math.PI) % 360.0;
    return Number(azimuth.toFixed(1));
  }

  function interpolateElevation(range, ballistics) {
    if (!ballistics || !ballistics.rings || ballistics.rings.length === 0) {
      ;
      return null;
    }

    const ringData = ballistics.rings[selectedRing];
    if (!ringData || ringData.length < 2) {
      // console.log("No valid ring data for ring:", selectedRing);
      return null;
    }

    const sortedData = [...ringData].sort((a, b) => a.range - b.range);
    let nearestPoints = sortedData
      .map((point) => ({
        ...point,
        distance: Math.abs(point.range - range),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    nearestPoints.sort((a, b) => a.range - b.range);

    const lower = nearestPoints[0];
    const upper = nearestPoints[1];

    // console.log("Found nearest points:", { lower, upper, range });

    // If range is outside the ring's limits, use the closest point
    if (range < lower.range) {
      return {
        elevationMils: Math.round(lower.elevationMils),
        elevationDeg: Math.round(lower.elevationMils / 17.7778),
        timeToImpact: lower.timeToImpactSeconds,
        ring: selectedRing,
      };
    }
    if (range > upper.range) {
      return {
        elevationMils: Math.round(upper.elevationMils),
        elevationDeg: Math.round(upper.elevationMils / 17.7778),
        timeToImpact: upper.timeToImpactSeconds,
        ring: selectedRing,
      };
    }

    const ratio = (range - lower.range) / (upper.range - lower.range);
    const elevationMils =
      lower.elevationMils + ratio * (upper.elevationMils - lower.elevationMils);
    const elevationDeg = elevationMils / 17.7778;

    var timeToImpactCalc = 0.0;
    if (upper.timeToImpactSeconds > lower.timeToImpactSeconds)
    {
      timeToImpactCalc = upper.timeToImpactSeconds - ratio * (upper.timeToImpactSeconds - lower.timeToImpactSeconds);
    }
    else
    {
      timeToImpactCalc = lower.timeToImpactSeconds - ratio * (lower.timeToImpactSeconds - upper.timeToImpactSeconds);
    }

    // console.log("TTI:", timeToImpactCalc, ratio, lower.timeToImpactSeconds, upper.timeToImpactSeconds);

    return {
      elevationMils: Math.round(elevationMils),
      elevationDeg: Math.round(elevationDeg),
      timeToImpact: timeToImpactCalc,
      ring: selectedRing,
    };
  }

  // Make calculations reactive to all inputs
  run(() => {
    if (mortarPosition && targetPosition) {
      const newDistance = calculateDistance(mortarPosition, targetPosition);
      const newAzimuth = calculateAzimuth(mortarPosition, targetPosition);

      // Only update if values have changed
      if (newDistance !== distance) {
        distance = newDistance;

        // Auto-select ring if enabled
        if (autoSelectRing && selectedAmmoType && selectedAmmoType.ballistics) {
          const appropriateRing = findAppropriateRing(
            distance,
            selectedAmmoType.ballistics,
          );
          if (appropriateRing !== null) {
            selectedRing = appropriateRing;
            dispatch("ringChange", appropriateRing);
          }
        }
      }

      if (newAzimuth !== azimuth) {
        azimuth = newAzimuth;
      }
    } else {
      distance = null;
      azimuth = null;
      rangeWarning = "";
    }
  });

  // Separate reactive statement for elevation calculation
  run(() => {
    if (distance !== null && selectedAmmoType && selectedAmmoType.ballistics) {
      const ringData = selectedAmmoType.ballistics.rings[selectedRing];
      if (ringData && ringData.length >= 2) {
        elevation = interpolateElevation(distance, selectedAmmoType.ballistics);
      } else {
        // Don't set elevation to null, keep the last valid elevation
      }
    }
  });

  // Debug logging
  run(() => {
    
  });
</script>

<div class="control-panel">
  <h2>Mortar Helper</h2>

  <div class="selectors">
    <div class="selector">
      <label for="mortar-type">Mortar Type:</label>
      <select id="mortar-type" onchange={handleMortarTypeChange}>
        {#each mortarTypes as mortar}
          <option value={mortar.name}>{mortar.name}</option>
        {/each}
      </select>
    </div>

    <div class="selector">
      <label for="ammo-type">Ammo Type:</label>
      <select id="ammo-type" onchange={handleAmmoTypeChange}>
        {#if selectedMortarType && selectedMortarType.ammo}
          {#each selectedMortarType.ammo as ammo}
            <option value={ammo.name}>{ammo.name}</option>
          {/each}
        {/if}
      </select>
    </div>

    <div class="selector">
      <label for="ring-select">Ring:</label>
      <select
        id="ring-select"
        bind:value={selectedRing}
        onchange={handleRingChange}
      >
        {#if selectedAmmoType && selectedAmmoType.ballistics && selectedAmmoType.ballistics.rings}
          {#each selectedAmmoType.ballistics.rings as _, i}
            <option value={i}>Ring {i}</option>
          {/each}
        {/if}
      </select>
    </div>

    <div class="selector checkbox">
      <label>
        <input
          type="checkbox"
          bind:checked={autoSelectRing}
          onchange={handleAutoSelectChange}
        />
        Auto-select Ring
      </label>
    </div>
  </div>

  <div class="calculations">
    <h3>Calculations</h3>
    <div class="calculation">
      <span class="label">Distance:</span>
      <span class="value">{distance !== null ? `${distance} m` : "-"}</span>
    </div>
    <div class="calculation">
      <span class="label">Azimuth:</span>
      <span class="value">
        {azimuth !== null
          ? `${azimuth % 1 === 0 ? azimuth.toFixed(1) : azimuth.toFixed(1)}°`
          : "-"}
      </span>
    </div>
    {#if elevation}
      <div class="calculation">
        <span class="label">Elevation:</span>
        <span class="value"
          >{elevation.elevationMils} mils ({elevation.elevationDeg}°)</span
        >
      </div>
      <div class="calculation">
        <span class="label">Ring:</span>
        <span class="value">{elevation.ring}</span>
      </div>
      <div class="calculation">
        <span class="label">Time To Impact:</span>
        <span class="value">{elevation.timeToImpact.toFixed(2)}</span>
      </div>
    {/if}
    {#if rangeWarning}
      <div class="warning">
        {rangeWarning}
      </div>
    {/if}
  </div>

  <div class="instructions">
    <h3>Instructions</h3>
    <ul>
      <li>Click and drag to pan the map</li>
      <li>Double-click to open targeting menu</li>
      <li>Select mortar or target position from menu</li>
      <li>Select mortar type, ammo type, and ring from dropdowns</li>
      <li>
        Enable auto-select ring to automatically choose the best ring for the
        current range
      </li>
      <li>Calculations update automatically</li>
    </ul>
  </div>
</div>

<style>
  .control-panel {
    width: 300px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    height: 100%;
    overflow-y: auto;
  }

  h2 {
    margin: 0 0 20px 0;
    text-align: center;
  }

  .selectors {
    margin-bottom: 20px;
  }

  .selector {
    margin-bottom: 10px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  select {
    width: 100%;
    padding: 5px;
    background: #333;
    color: white;
    border: 1px solid #666;
  }

  .calculations {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 1.1em;
  }

  .calculation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .label {
    color: #ccc;
  }

  .value {
    font-weight: bold;
  }

  .instructions {
    font-size: 0.9em;
  }

  .instructions ul {
    margin: 0;
    padding-left: 20px;
  }

  .instructions li {
    margin-bottom: 5px;
  }

  .checkbox {
    margin-top: 10px;
  }

  .checkbox label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .checkbox input[type="checkbox"] {
    width: auto;
    margin: 0;
  }

  .warning {
    margin-top: 10px;
    padding: 8px;
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid rgba(255, 0, 0, 0.4);
    border-radius: 4px;
    color: #ff6b6b;
    font-size: 0.9em;
  }
</style>
