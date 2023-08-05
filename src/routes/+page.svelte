<script>
  import { metrics } from '../constants/metrics'
	import Map from '../components/Map.svelte';

	export let data;

	$: year = '2021';
	$: years = [];
	$: fileName = 'gdp';

  function updateMetric(e) {
    const newMetric = e.target.value;
    fileName = newMetric;
  }
</script>

<label>
	<select bind:value={year} on:change={updateMetric}>
		{#each years as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
</label>

<label>
  <select bind:value={fileName} on:change={updateMetric}>
    {#each metrics as metric}
      <option value={metric.value}>{metric.name}</option>
    {/each}
  </select>
</label>
{fileName}
<section class="wrapper">
	<Map data={data.output} {year} />
</section>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: auto;
		height: calc(100vh - 50px);
		width: calc(100vw - 50px);
	}
</style>
