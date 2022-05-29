<script lang="ts">
  import { goto } from '$app/navigation';
  import { documentStore } from '$lib/documentStore';

  let files = [];

  async function onFileChange() {
    if (!files.length) {
      return;
    }

    await documentStore.load(files[0]);
    await goto('/edit');
  }
</script>

<p>Load a file</p>

<form>
  <input
      accept="application/json"
      bind:files
      type="file"
      on:change={onFileChange}
  /></form>
