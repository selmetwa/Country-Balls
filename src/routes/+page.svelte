<script>
	import { onMount } from 'svelte';

	import { rangeMap } from '../constants/rangeMap';
	import Map from '../components/Map.svelte';
	import UpdateForm from '../components/UpdateForm.svelte';
  import Footer from '../components/Footer.svelte';
	export let data;

	$: year = '';
	$: years = [];
	$: metric = '';
	$: mapData = [];
	$: geoData = [];
	$: isUpdating = false;

  // timelapse variables
  $: timelapseIndex = 0;
  $: timelapseInterval = null;
  $: currentTimelapseYear = '';

	const updateMetric = async (e) => {
		metric = e.target.value;
    timelapseIndex = 0
		const newYears = Object.keys(rangeMap[e.target.value]).reverse();
		years = newYears;
		year = newYears.includes(year) ? year : newYears[0];
	};

	const updateYear = async (e) => {
    timelapseIndex = 0
		year = e.target.value;
	};

	onMount(async () => {
		const response = await fetch('src/data/countries.json');
		geoData = await response.json();
		year = data.year;
		years = data.years;
		metric = data.metric;
		mapData = data.mapData;
	});

	async function handleSubmit() {
		mapData = [];
		const res = await fetch(`${window.location.origin}/api/update`, {
			method: 'POST',
			headers: { accept: 'application/json' },
			body: JSON.stringify({ year: year, metric: metric })
		});

		const data = await res.json();
		mapData = data.mapData;
	}

  async function updateMapTimelapse(y) {
    const res = await fetch(`${window.location.origin}/api/update`, {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: JSON.stringify({ year: y, metric: metric })
    });
    const data = await res.json();
    mapData = data.mapData;

    timelapseInterval = setTimeout(() => {
      nextIteration();
    }, 3000);
  }

  function nextIteration() {
    const curr = years[years.length - (1 + timelapseIndex)]
    currentTimelapseYear = curr

    if (timelapseIndex !== years.length) {
      updateMapTimelapse(curr);
      timelapseIndex++;
    } else {
      timelapseIndex = 0;
      currentTimelapseYear = ''
    }
  }

  function handleTimelapse() {
    currentTimelapseYear = years[years.length - 1]
    nextIteration()
  }

  function pauseTimelapse() {
    clearTimeout(timelapseInterval)
  }

  function unpauseTimelapse() {
    nextIteration()
  }

  function stopTimelapse() {
    clearTimeout(timelapseInterval)
    timelapseIndex = 0
    currentTimelapseYear = ''
  }
</script>

<section>
	<div class="wrapper">
		<UpdateForm 
      {updateYear} 
      {updateMetric} 
      {years} 
      {handleSubmit} 
      {handleTimelapse} 
      {pauseTimelapse} 
      {currentTimelapseYear}
      {unpauseTimelapse}
      {stopTimelapse}
      {metric}
    />
		<Map data={mapData} {year} {isUpdating} {metric} {geoData} {currentTimelapseYear} />
	</div>
</section>
<Footer />

<style>
	section {
		position: relative;
    overflow: hidden;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: auto;
		height: calc(100vh - 50px);
		width: calc(100vw - 50px);
	}
</style>
