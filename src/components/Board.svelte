<script lang="ts">
	import { Game, type GameState, type PlayerType, type Position } from '../lib/core';
	import CapturedPieces from './CapturedPieces.svelte';
	import Cell from './Cell.svelte';
	const game = new Game();

	let board = game.getBoard();
	let myCapturedPieces = game.getCapturedPieces('me');
	let opponentCapturedPieces = game.getCapturedPieces('opponent');
	let availableMoves: Position[] = [];
	let movingCandidate:
		| { type: 'move'; pos: Position }
		| { type: 'place'; player: PlayerType; index: number }
		| null = null;
	let gameState: GameState = 'in-game';

	const cellClickHandlerGenerator = (x: number, y: number) => () => {
		if (availableMoves.some(([ax, ay]) => ax === x && ay === y)) {
			if (movingCandidate === null) return;
			if (movingCandidate.type === 'move') {
				game.move(movingCandidate.pos, [x, y]);
				board = game.getBoard();
				myCapturedPieces = game.getCapturedPieces('me');
				opponentCapturedPieces = game.getCapturedPieces('opponent');
				gameState = game.getGameState();
				movingCandidate = null;
				availableMoves = [];
			}
		} else {
			availableMoves = game.getAvailableMoves([x, y]);
			if (availableMoves.length === 0) return;
			movingCandidate = { type: 'move', pos: [x, y] };
		}
	};

	const capturedPieceClickHandlerGenerator = (i: number) => () => {
		const piece = myCapturedPieces[i];
		availableMoves = game.getAvailableMovesWhenPlacing(piece);
		movingCandidate = { type: 'place', player: 'me', index: i };
	};
</script>

<div class="relative">
	<CapturedPieces
		pieces={opponentCapturedPieces}
		player="opponent"
		handleClick={capturedPieceClickHandlerGenerator}
	/>
	<div class="flex flex-col">
		{#each board as row, y (y)}
			<div class="flex">
				{#each row as cell, x (x)}
					<Cell
						{cell}
						handleClick={cellClickHandlerGenerator(x, y)}
						isMovable={availableMoves.some(([ax, ay]) => ax === x && ay === y)}
						isCandidate={(movingCandidate &&
							movingCandidate.type === 'move' &&
							movingCandidate.pos[0] === x &&
							movingCandidate.pos[1] === y) ??
							false}
					/>
				{/each}
			</div>
		{/each}
	</div>
	<CapturedPieces
		pieces={myCapturedPieces}
		player="me"
		handleClick={capturedPieceClickHandlerGenerator}
	/>
	{#if gameState !== 'in-game'}
		<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="bg-white p-4 rounded-lg">
				{#if gameState === 'win'}
					<div class="text-2xl">あなたの勝ち</div>
				{:else if gameState === 'lose'}
					<div class="text-2xl">あなたの負け</div>
				{:else}
					<div class="text-2xl">引き分け</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
