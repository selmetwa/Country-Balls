<!-- Map.svelte -->
<script>
	import { onMount, afterUpdate, tick } from 'svelte';
	import {
		select,
		geoPath,
		geoMercator,
		geoCentroid,
		forceSimulation,
		forceCollide,
		forceX,
		forceY,
	} from 'd3';
	import { countryISOMapping } from '../data/countryISOMapping';

	export let data;
	export let isUpdating;
	export let fileName;
	export let geoData;

	let currentTick = 0;
	$: isUpdating = false;

	onMount(() => {
		drawMap();
	});

	afterUpdate(() => {
		select('.map-container').selectAll('svg').remove();
		setTimeout(() => {
			currentTick = 0;
			drawMap();
		}, 100);
	});

	function getFlag(country) {
		const code = countryISOMapping[country.id];
		if (!code) {
			return null;
		}

		return `https://hatscripts.github.io/circle-flags/flags/${countryISOMapping[country.id]?.toLowerCase()}.svg`;
	}

	function drawMap() {
		const wrapper = document.querySelector('.map-container');
		const svg = select('.map-container');

		console.log(fileName, { data });

		if (geoData && geoData.features && data && wrapper) {
			const width = wrapper.clientWidth;
			const height = wrapper.clientHeight;
			const projection = geoMercator().fitSize([width, height], geoData);
			const path = geoPath().projection(projection);

			function getWidth(country) {
				const targetCountry = data.find((obj) => obj.country === country.id);
				return targetCountry?.width || 5;
			}

			const simulation = forceSimulation(geoData.features)
				.force('x', forceX((country) => projection(geoCentroid(country))[0]).strength(0.25))
				.force('y', forceY((country) => projection(geoCentroid(country))[1]).strength(0.25))
				.force(
					'collide',
					forceCollide().radius((country) => getWidth(country) / 2 + 2)
				);

			const countryGroups = svg
				.selectAll('path')
				.data(geoData.features)
				.join('path')
				.attr('d', path);

			countryGroups.attr('fill', '#F4F5F6').attr('stroke', '#E9EBED').attr('stroke-width', 1);

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
					.attr('width', (country) => getWidth(country))
					.attr('x', (country) => country.x - getWidth(country) / 2)
					.attr('y', (country) => country.y - getWidth(country) / 2);

				currentTick++;

				if (currentTick >= 50) {
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
