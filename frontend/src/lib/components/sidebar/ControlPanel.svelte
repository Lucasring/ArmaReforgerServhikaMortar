<script lang="ts">
    import ControlPanelCache from "@components/sidebar/panels/ControlPanelCache.svelte";
    import MortarInputPanel from "@components/sidebar/panels/MortarInputPanel.svelte";
    import CalculationsPanel from "@components/sidebar/panels/CalculationsPanel.svelte";
    import InstructionsPanel from "@components/sidebar/panels/InstructionsPanel.svelte";
</script>

<div class="flex flex-col gap-4 w-75 p-5 bg-stone-700 h-screen overflow-y-auto">
    
    <!-- Header -->
    <h2 class="text-xl text-center font-bold text-stone-300">Mortar Helper</h2>

    <!-- User Input -->
    <MortarInputPanel />

    <!-- Calculations -->
    <CalculationsPanel />

    <!-- Mortar Cache -->
    <ControlPanelCache />
    
    <!-- Instructions -->
    <InstructionsPanel />

</div>
