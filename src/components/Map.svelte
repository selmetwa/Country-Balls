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
	} from 'd3';
	import { countryISOMapping } from '../constants/countryISOMapping';
  import { metrics } from '../constants/metrics';
	export let data;
	export let isUpdating;
	export let geoData;
  export let currentTimelapseYear;
  export let metric;

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

      if (width < 1040) {
        const form = document.querySelector('form')
        form.style.display = 'none'
        svg
          .append("text")
          .attr("x", 10)
          .attr("y", 100)
          .attr("font-size", "20px")
          .attr("fill", "blue")
          .attr("font-family", "Arial")
          .attr("text-anchor", "start")
          .text("Screen too small for visualizations");

        return
      }
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
  {#if currentTimelapseYear}
    <div class="timelapse-data">
      <h1 class="timelapse-year">{currentTimelapseYear}</h1>
      <h2 class="timelapse-metric">{metrics.filter(m => m.value === metric)[0].name}</h2>
    </div>
  {/if}
	<svg class="map-container" />
{:else}
	<p>Loading map data...</p>
{/if}

<style>
  .timelapse-data {
    position: absolute;
    left: 0; 
    right: 0; 
    font-family: sans-serif;
    top: 0;
    margin-left: auto; 
    margin-right: auto; 
    width: 250px;
    margin-top: 15px;
    border: 1px solid red;
    padding: 8px 4px;
    background-color: #F4F5F6;
    border: 2px solid #E9EBED;
    text-align: center;
  }

  .timelapse-year {
    margin: 0;
    font-size: 20px;
  }

  .timelapse-metric {
    margin: 4px 0 0 0;
    font-size: 16px;
    font-weight: 400;
  }

	.map-container {
		height: calc(100vh - 50px);
		width: calc(100vw - 50px);
	}
</style>
