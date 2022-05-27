<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  const keyUpdated = createEventDispatcher().bind(null, 'keyUpdated');
  const valueUpdated = createEventDispatcher().bind(null, 'valueUpdated');
  const deleteRequested = createEventDispatcher().bind(null, 'deleteRequested');

  export let key: string;
  export let value: string;

  let editKey = '';
  let editValue = '';
  let keyInputElement: HTMLInputElement;

  $: {
    editKey = key;
    editValue = value;
  }

  $: keyChanged = editKey != key;
  $: valueChanged = editValue != value;

  function onKeyInput() {
    editKey = editKey.replace(/\s+|(\.\s)/, '.');
  }

  function updateKeySubmit() {
    editKey = editKey.replace(/\.$/, '');
    keyUpdated({
      oldKey: key,
      newKey: editKey,
    });
  }

  function resetKey() {
    editKey = key;
  }

  function onValueChanged() {
    valueUpdated({
      key,
      oldValue: value,
      newValue: editValue,
    });
  }

  function onDelete() {
    deleteRequested({key});
  }

  onMount(() => {
    if (!key) {
      keyInputElement.focus();
    }
  });
</script>

<article class="relative grid grid-cols-[2fr_3fr] gap-4 group">
  <form on:submit|preventDefault={updateKeySubmit} class="flex items-start gap-2 w-full">
    <input type="text" bind:this={keyInputElement} bind:value={editKey} class="w-full transition-all"
           on:input={onKeyInput}>
    {#if keyChanged}
      <input type="submit" value="✓">
      <input type="button" value="╳" on:click={resetKey}>
    {/if}
  </form>

  <div class="w-full">
    <textarea class="w-full" bind:value={editValue} on:change={onValueChanged}></textarea>
  </div>

  <button class="absolute top-0 right-0 border rounded border-amber-700 px-2 py-1 text-xs invisible group-hover:visible"
          on:click={onDelete}>Delete
  </button>
</article>
