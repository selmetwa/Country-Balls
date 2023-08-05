<!-- Map.svelte -->
<script>
	import { onMount, afterUpdate } from 'svelte';
	import {
		select,
		geoPath,
		geoMercator,
		geoCentroid,
		forceSimulation,
		forceCollide,
		forceX,
		forceY,
		scaleLinear,
		min,
		max
	} from 'd3';
	import { countryISOMapping } from '../data/all';

	export let data;
	let currentTick = 0;
	$: geoData = null;

	onMount(async () => {
		const response = await fetch('src/data/countries.json');
		geoData = await response.json();
		drawMap();
	});

	afterUpdate(() => {
		drawMap();
	});

	function getFlag(country) {
		return `https://hatscripts.github.io/circle-flags/flags/${countryISOMapping[
			country.id
		]?.toLowerCase()}.svg`;
	}

	function drawMap() {
		const wrapper = document.querySelector('.map-container');
		const svg = select('.map-container');

		if (geoData && geoData.features && data && wrapper) {
			const width = wrapper.clientWidth;
			const height = wrapper.clientHeight;
			const projection = geoMercator().fitSize([width, height], geoData);
			const path = geoPath().projection(projection);
			const rawValues = data.map((obj) => obj.rawValue) || [];
			const maxValue = Number(max(rawValues));
			const minValue = Number(min(rawValues));

			const circleSizeScale = scaleLinear().domain([minValue, maxValue]).rangeRound([1, 250]);

			function getWidth(country) {
				const targetCountry = data.find((obj) => obj.country === country.id);
				return targetCountry?.width || 5;
			}

			function getFakeWidth(country) {
				const targetCountry = data.find((obj) => obj.country === country.id);
				return targetCountry?.width || 5;
			}
			// function getFakeW(country) {
			// 	const targetCountry = data.find((obj) => obj.country === country.id);
			//   return targetCountry?.width || 5
			// }
			const simulation = forceSimulation(geoData.features)
				.force('x', forceX((country) => projection(geoCentroid(country))[0]).strength(0.1))
				.force('y', forceY((country) => projection(geoCentroid(country))[1]).strength(0.1))
				.force(
					'collide',
					forceCollide().radius((country) => getWidth(country) / 2 + 2)
				);

			const countryGroups = svg
				.selectAll('path')
				.data(geoData.features)
				.join('path')
				.attr('d', path);

			countryGroups.attr('fill', 'lightblue').attr('stroke', 'white').attr('stroke-width', 1);

			svg
				.selectAll('image')
				.data(geoData.features)
				.join('image')
				.attr('href', (country) => getFlag(country))
				.attr('width', (country) => getWidth(country))
				.attr('x', (country) => {
					const [x] = projection(geoCentroid(country));
					return x - getWidth(country) / 2;
				})
				.attr('y', (country) => {
					const [y] = projection(geoCentroid(country));
					return y - getWidth(country) / 2;
				});

			simulation.on('tick', () => {
				svg
					.selectAll('image')
					.data(geoData.features)
					.join('image')
					.attr('href', (country) => getFlag(country))
					.attr('r', (country) => getWidth(country))
					.attr('x', (country) => country.x - getWidth(country) / 2)
					.attr('y', (country) => country.y - getWidth(country) / 2);

				currentTick++;

				if (currentTick >= 150) {
					simulation.stop();
				}
			});
		}
	}
</script>

{#if geoData}
	<svg class="map-container" />
{:else}
	<p>Loading map data...</p>
{/if}

<style>
	.map-container {
		height: calc(100vh - 50px);
		width: calc(100vw - 50px);
	}
</style>
