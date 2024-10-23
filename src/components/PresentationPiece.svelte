<script lang="ts">
	import type { Piece } from '../lib/core';
	export let piece: Piece | null;
	export let isMovable: boolean = false;
	export let isCandidate: boolean = false;
</script>

<div
	class="bg-green-200 border-gray-600 border-2 size-16 grid place-content-center font-bold relative"
>
	{#if piece !== null}
		{#if piece.type === 'lion'}
			<div class={piece.player === 'me' ? 'text-blue-500' : 'text-red-500'}>らいおん</div>
		{:else if piece.type === 'giraffe'}
			<div class={piece.player === 'me' ? 'text-blue-500' : 'text-red-500'}>きりん</div>
		{:else if piece.type === 'elephant'}
			<div class={piece.player === 'me' ? 'text-blue-500' : 'text-red-500'}>ぞう</div>
		{:else if piece.type === 'chick'}
			<div class={piece.player === 'me' ? 'text-blue-500' : 'text-red-500'}>ひよこ</div>
		{:else if piece.type === 'chicken'}
			<div class={piece.player === 'me' ? 'text-blue-500' : 'text-red-500'}>にわとり</div>
		{/if}
	{/if}
	{#if isMovable}
		<div class="absolute inset-2 border-2 border-orange-500"></div>
	{/if}
	{#if isCandidate}
		<div class="absolute inset-2 border-2 border-yellow-500"></div>
	{/if}
</div>
