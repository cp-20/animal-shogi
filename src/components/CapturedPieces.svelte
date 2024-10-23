<script lang="ts">
	import type { Piece, PlayerType } from '$lib/core';
	import PresentationPiece from './PresentationPiece.svelte';

	export let pieces: Piece[] = [];
	export let player: PlayerType;
	export let handleClick: (i: number) => unknown;
</script>

<div class="flex">
	{#each pieces as piece, i (i)}
		<button onclick={() => handleClick(i)}>
			<PresentationPiece piece={{ ...piece, player }} />
		</button>
	{/each}
</div>
