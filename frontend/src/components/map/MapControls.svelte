<script>
  import { onMount, onDestroy } from 'svelte';
  import Button from "../ui/Button.svelte";
  import { setMortarPositionFromPixel, setTargetPositionFromPixel } from '../../stores/mapStore.js';

  let showContextMenu = false;
  let contextMenuPosition = { x: 0, y: 0 };

  // Exposed method for parent to open the menu at a pixel coordinate
  export function openMenu(pixel) {
    contextMenuPosition = { x: pixel.x, y: pixel.y };
    showContextMenu = true;
  }

  function handleMenuClick(type) {
    const pixel = { x: contextMenuPosition.x, y: contextMenuPosition.y };
    if (type === 'mortar') {
      setMortarPositionFromPixel(pixel);
    } else if (type === 'target') {
      setTargetPositionFromPixel(pixel);
    }
    showContextMenu = false;
  }

  function handleOutsideClick(event) {
    if (showContextMenu && !event.target.closest('.context-menu')) {
      showContextMenu = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleOutsideClick);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleOutsideClick);
  });
</script>

{#if showContextMenu}
  <div
    class="context-menu"
    style="left: {contextMenuPosition.x}px; top: {contextMenuPosition.y}px; transform: translateX(-50%);"
    role="menu"
  >
    <Button class="menu-item" on:click={() => handleMenuClick('mortar')} role="menuitem">
      Set Mortar Position
    </Button>
    <Button class="menu-item" on:click={() => handleMenuClick('target')} role="menuitem">
      Set Target Position
    </Button>
  </div>
{/if}

<style>
  .context-menu {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #666;
    border-radius: 4px;
    padding: 5px 0;
    min-width: 150px;
    z-index: 1000;
  }

  :global(.menu-item) {
    display: block;
    width: 100%;
    padding: 8px 12px;
    color: white;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
  }
</style>
