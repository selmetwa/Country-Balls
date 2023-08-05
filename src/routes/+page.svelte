<script>
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import { rangeMap } from '../constants/rangeMap';
	import Map from '../components/Map.svelte';
	export let data;

	$: data = [];
	$: year = '2021';
	$: years = [];
	$: dataForMap = [];
	$: fileName = 'millitary_percent_of_gdp';

	async function fetchData() {
		const res = await d3.csv(`src/data/${fileName}.csv`);
		years = Object.keys(res[0]).filter(
			(key) => key !== 'Country Name' && key !== 'Country Code' && key !== 'Indicator Name'
		);
		data = res;
	}

	/**
	 * return array of objects where each data contains the countries code
	 * the countries full name, the countries raw metric value, and
	 * the countries value as a percentage of the total value
	 */
	function transformData() {
		const output = [];
		for (const obj of data) {
			const country = obj['Country Code'];
			const name = obj['Country Name'];
			const rawValue = obj[year];
			const group = { country, name, rawValue };
			output.push(group);
		}

		const rawValues = output.map((obj) => obj.rawValue) || [];
		const maxValue = Number(d3.max(rawValues));
		const minValue = Number(d3.min(rawValues));

		const circleSizeScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.rangeRound(rangeMap[fileName][year]);

		for (const obj of output) {
			if (obj?.rawValue > 0) {
				const width = circleSizeScale(obj.rawValue);
				console.log(obj.country, { width });
				obj.width = width;
			} else {
				obj.width = 1;
			}
		}

		dataForMap = output;
	}

	onMount(async () => {
		fetchData();
	});

	$: if (data || year) {
		if (data) {
			transformData();
		}
	}
</script>

<label>
	<select bind:value={year} on:change={(e) => (year = e.target.value)}>
		{#each years as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
</label>

{fileName}
<section class="wrapper">
	<Map data={dataForMap} {year} />
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
