<script>
	import { metrics } from '../constants/metrics';

	export let updateYear;
	export let updateMetric;
	export let years;
	export let handleSubmit;
	export let handleTimelapse;
	export let pauseTimelapse;
	export let currentTimelapseYear;
	export let unpauseTimelapse;
	export let stopTimelapse;
	export let metric;

	$: isPaused = false;

	function pause() {
		isPaused = true;
		pauseTimelapse();
	}

	function unpause() {
		isPaused = false;
		unpauseTimelapse();
	}

	function stop() {
		isPaused = false;
		stopTimelapse();
	}
</script>

<form on:submit={handleSubmit}>
	{#if !currentTimelapseYear}
		<label>
			<select on:change={updateYear}>
				{#each years as y}
					<option value={y}>{y}</option>
				{/each}
			</select>
		</label>
		<label>
			<select on:change={updateMetric} value={metric}>
				{#each metrics as metric}
					<option value={metric.value}>{metric.name}</option>
				{/each}
			</select>
		</label> 
		<button type="submit">Update Chart</button>
		<button on:click={handleTimelapse} type="button">Trigger Timelapse</button>
	{:else}
		<div class="buttons">
			{#if isPaused}
				<button type="button" on:click={unpause}>Unpause Timelapse</button>
			{:else}
				<button type="button" on:click={pause}>Pause Timelapse</button>
			{/if}
			<button class="stop-button" type="button" on:click={stop}>Stop Timelapse</button>
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

	.buttons {
		display: flex;
		gap: 4px;
	}

	button {
		padding: 8px 12px;
		width: 100%;
	}

	.stop-button {
		background-color: orangered;
		color: white;
		font-weight: bold;
		border: 2px solid orangered;
	}
</style>
