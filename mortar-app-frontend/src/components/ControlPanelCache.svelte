<script lang="ts">
  
    import { getMortarState, MortarState } from "$lib/mortar_state.svelte";
	import { getMortarUserCache, type MortarUserCache } from "$lib/mortar_user_cache.svelte";

    // Get the MortarState fro mthe context
    let mortar_state : MortarState = getMortarState();
    let mortar_user_cache : MortarUserCache = getMortarUserCache();

    // Cache Lines
    let cache_label : string = $state("");
    let cache_line_selected : string | null = $state(null);

    function selectCacheLine(label : string) {
        cache_line_selected = label;
        const cached_target = mortar_user_cache.target_position_list.find((m) => m.label === label)
        if (cached_target) {
            mortar_state.target_position = cached_target.position;
        }
    }

    function addTargetToCache() {
        if (!mortar_state.target_position || cache_label === "") 
            return;

        // If label already exists prevent addition
        if (mortar_user_cache.target_position_list.find((m) => m.label === cache_label))
            return;

        mortar_user_cache.addTargetPosition(
            mortar_state.target_position,
            cache_label
        );
    }

    function removeSelectedTarget() {
        if (!cache_line_selected) return;

        mortar_user_cache.removeTargetByLabel(cache_line_selected);
        cache_line_selected = null;
        cache_label = "";
    }

    $effect(() => {
        // If current mortar target doesn't match the selected cache item, deselect it
        const selected = mortar_user_cache.target_position_list.find(m => m.label === cache_line_selected);
        if (selected && (selected.position.x !== mortar_state.target_position?.x)) {
            cache_line_selected = null;
        }
    });

</script>

<div class="flex flex-col w-full h-full rounded-lg bg-stone-600 p-2 text-stone-300 items-center justify-between gap-1">
    
    <h1 class="text-center font-bold">Target Cache</h1>

    <!-- Cache List box -->
    <div class="flex flex-col w-full h-full p-1 border border-stone-300 rounded-lg gap-1">
        {#if mortar_user_cache.target_position_list.length > 0}
            {#each mortar_user_cache.target_position_list as target}
                <button 
                    class="flex w-full rounded-md hover:bg-stone-400 px-2 py-1 items-start
                    {cache_line_selected === target.label ? "bg-stone-400" : "bg-stone-500"}"
                    onclick={() => {selectCacheLine(target.label)}}
                >
                    <div class="font-bold w-full h-6 truncate pr-1 text-md text-left">{target.label}</div>
                    <div class="font-mono w-24 whitespace-nowrap text-right">
                        X{target.position.x.toFixed(0).padStart(4, '0')} Y{target.position.y.toFixed(0).padStart(4, '0')}
                    </div>
                </button>
            {/each}
        {:else}
            <div class="flex font-bold font-mono w-full h-full items-center justify-center">
                No Targets Added
            </div>
        {/if}
    </div>

    <!-- Save Current Target box -->
    <div class="w-full flex flex-col border rounded-lg p-2 bg-stone-600 gap-1">
        
        <div class="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Save Current Target
        </div>

        <div class="h-px w-full bg-stone-500"></div>
        
        <div class="flex items-end gap-1">
            <button class="h-10 w-10 grid place-content-center border border-black rounded-lg bg-green-800 
                hover:bg-green-700 text-white font-bold text-[2rem] leading-none" 
                onclick={addTargetToCache}>
                <span class="mt-[-6px]">+</span>
            </button>
            <div class="flex flex-col flex-grow gap-1">
                <input id="target-label" type="text" placeholder="e.x. Industrial" bind:value={cache_label}
                    class="rounded-lg w-full h-10 px-3 bg-stone-800 text-white border border-stone-500 focus:outline-none focus:border-blue-500"
                >
            </div>
        </div>
    
        <button 
            class="rounded-lg border border-black font-mono {cache_line_selected ? "bg-red-800 hover:bg-red-700" : "bg-stone-700 opacity-50"}"
            onclick={removeSelectedTarget}
        >
            Remove Selected Target
        </button>
    
    </div>

</div>
