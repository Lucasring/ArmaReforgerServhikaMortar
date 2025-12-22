<script>
  import Button from '../Button.svelte';
  export let ariaLabel = '';
  export let type = 'button';
  export let className = '';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleClick(e) {
    dispatch('buttonclick', e);
  }
</script>

<Button ariaLabel={ariaLabel} type={type} class={className} on:click={handleClick}>
  Click me
</Button>
