<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        is_open: boolean;
        children: Snippet;
    }

    let { 
        is_open: isOpen, 
        children 
    } : Props = $props();

    let dialogElement: HTMLDialogElement;

    $effect(() => {
        if (isOpen) {
            dialogElement.showModal();
        } else {
            dialogElement.close();
        }
    });

</script>

<dialog 
    bind:this={dialogElement}
    class="fixed inset-0 m-auto border-none bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
>
    {@render children()}
</dialog>