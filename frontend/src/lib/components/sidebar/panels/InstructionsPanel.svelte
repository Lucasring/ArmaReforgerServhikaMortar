<script lang="ts">
    let is_expanded = $state(true);
</script>

<div class="bg-stone-600 rounded-lg px-2 pt-2 text-stone-300">

    <div class="flex flex-row relative justify-center items-center mb-2">
        <h3 class="font-bold text-md">Instructions</h3>
        <button 
            class="border border-stone-400 px-2 py-0.5 rounded hover:bg-stone-500 transition-colors text-xs absolute right-0"
            onclick={() => {is_expanded = !is_expanded}}
        >
            <span class="inline-block transition-transform duration-300 {is_expanded ? 'rotate-180' : ''}">
                ▼
            </span>
        </button>
    </div>

    <div class="
        grid transition-[grid-template-rows] duration-1000 ease-in-out  overflow-hidden \
        {is_expanded ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr]'}
    "> 
        <div class="min-h-0">
            <ul class='flex flex-col gap-2 m-4 pl-2 text-sm text-left list-disc min-h-0'>
                <li>Click and drag to pan the map</li>
                <li>Double-click to open targeting menu</li>
                <li>Select mortar or target position from menu</li>
                <li>Select mortar type, ammo type, and ring from dropdowns</li>
                <li>Enable auto-select ring to automatically choose the best ring for the current range</li>
                <li>Calculations update automatically</li>
            </ul>
        </div>
    </div>
</div>