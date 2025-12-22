<script>
  import { createEventDispatcher } from 'svelte';
  export let type = 'button';
  export let ariaLabel = '';
  const dispatch = createEventDispatcher();

  function onClick(e) {
    dispatch('click', e);
  }
</script>

<button {...$$restProps} type={type} aria-label={ariaLabel} on:click={onClick}>
  <slot />
</button>

<style>
  button {
    color: white;
    background: transparent;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
  }

  button:hover {
    background: rgba(255,255,255,0.04);
  }
</style>
