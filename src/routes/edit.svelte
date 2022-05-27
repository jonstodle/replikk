<script lang="ts">
  import Field from '$lib/components/Field.svelte';
  import { documentStore } from '$lib/documentStore';

  $: fields = Object.entries($documentStore.records).sort((a, b) => a[0].localeCompare(b[0]));

  async function onAddField() {
    documentStore.set('', 'Some value');
  }

  function onSave() {
    documentStore.save();
  }

  function onKeyUpdated({detail: {oldKey, newKey}}) {
    documentStore.rename(oldKey, newKey);
  }

  function onValueUpdated({detail: {key, newValue}}) {
    documentStore.set(key, newValue);
  }

  function onDeleteRequested({detail: {key}}) {
    documentStore.remove(key);
  }
</script>

<div class="flex gap-2">
  <button on:click={onAddField}>Add field</button>
  <button on:click={onSave}>Save</button>
</div>

{#each fields as [key, value] (key)}
  <Field {key} {value}
         on:keyUpdated={onKeyUpdated}
         on:valueUpdated={onValueUpdated}
         on:deleteRequested={onDeleteRequested}/>
{/each}
