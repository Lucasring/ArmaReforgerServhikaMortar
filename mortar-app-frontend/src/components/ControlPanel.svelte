<script lang="ts">
    import ControlPanelCache from "./ControlPanelComponents/ControlPanelCache.svelte";
    import MortarInputPanel from "./ControlPanelComponents/MortarInputPanel.svelte";
    import CalculationsPanel from "./ControlPanelComponents/CalculationsPanel.svelte";
    import InstructionsPanel from "./ControlPanelComponents/InstructionsPanel.svelte";
</script>

<div class="flex flex-col gap-4 w-75 p-5 bg-stone-700 h-screen">
    
    <!-- Header -->
    <h2 class="text-xl text-center font-bold text-stone-300">Mortar Helper V3.0.1</h2>

    <!-- User Input -->
    <MortarInputPanel />

    <!-- Calculations -->
    <CalculationsPanel />

    <!-- Mortar Cache -->
    <ControlPanelCache />
    
    <!-- Instructions -->
    <InstructionsPanel />

</div>
