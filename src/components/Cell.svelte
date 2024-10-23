<script lang="ts">
	import type { Piece } from '../lib/core';
	import PresentationPiece from './PresentationPiece.svelte';
	export let cell: Piece | null;
	export let handleClick: () => unknown;
	export let isMovable: boolean;
	export let isCandidate: boolean;
</script>

<button onclick={handleClick}>
	<PresentationPiece piece={cell} {isMovable} {isCandidate} />
</button>
