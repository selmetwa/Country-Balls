<script>
	import { metrics } from '../constants/metrics';

  export let updateYear
  export let updateMetric
  export let years
  export let handleSubmit
</script>

<div>
  <label>
    <select on:change={updateYear}>
      {#each years as y}
        <option value={y}>{y}</option>
      {/each}
    </select>
  </label>
  <label>
    <select on:change={updateMetric}>
      {#each metrics as metric}
        <option value={metric.value}>{metric.name}</option>
      {/each}
    </select>
  </label>
  <button on:click={handleSubmit}>Update Chart</button>
</div>


<style>
  div {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 5px;
    gap: 4px;
    border: 1px solid gray;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 10px;
    margin-left: 10px;
    background-color: bisque;
  }
  select {
    width: 100%;
    padding: 8px 12px;
  }

  button {
    padding: 8px 12px;
    width: 100%;
  }
</style>