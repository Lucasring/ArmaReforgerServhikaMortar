<script>
  import MapViewer from './components/MapViewer.svelte';
  import ControlPanel from './components/ControlPanel.svelte';
  import { mortarTypes } from './config/mortarConfig';
  
  let selectedMortarType = $state(mortarTypes[0]);
  let selectedAmmoType = $state(mortarTypes[0].ammo[0]);
  let mortarPosition = $state(null);
  let targetPosition = $state(null);
  let selectedRing = $state(0);
  
  function handleMortarTypeChange(event) {
    selectedMortarType = event.detail;
    selectedAmmoType = selectedMortarType.ammo[0];
    selectedRing = 0;
  }
  
  function handleAmmoTypeChange(event) {
    selectedAmmoType = event.detail;
    selectedRing = 0;
  }

  function handleRingChange(event) {
    selectedRing = event.detail;
  }
</script>

<main>
  <div class="container">
    <div class="map-section">
      <MapViewer 
        {selectedMortarType}
        {selectedAmmoType}
        bind:mortarPosition
        bind:targetPosition
        bind:selectedRing
      />
    </div>
    <ControlPanel
      {selectedMortarType}
      {selectedAmmoType}
      {mortarPosition}
      {targetPosition}
      bind:selectedRing
      on:mortarTypeChange={handleMortarTypeChange}
      on:ammoTypeChange={handleAmmoTypeChange}
      on:ringChange={handleRingChange}
    />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  main {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  
  .map-section {
    flex: 1;
    height: 100%;
    position: relative;
  }
</style> 