<script>
	import { metrics } from '../constants/metrics';

  export let updateYear
  export let updateMetric
  export let years
  export let handleSubmit
  export let handleTimelapse
  export let isTimelapsing
  export let timelapseIndex
  export let pauseTimelapse
</script>

<form on:submit={handleSubmit}>
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
  <h1>{years[timelapseIndex]}</h1>
  {#if isTimelapsing === false}
    <button type="submit">Update Chart</button>
    <button on:click={handleTimelapse} type="button">Trigger Timelapse</button>
  {:else}
    <button type="button" on:click={pauseTimelapse}>Stop Timelapse</button>
    <div>
      <h1>{years[timelapseIndex]}</h1>
      <meter min={years[0]} max={years[years.length - 1]} value={years[timelapseIndex]}></meter>
    </div>
  {/if}
</form>

<style>
  form {
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