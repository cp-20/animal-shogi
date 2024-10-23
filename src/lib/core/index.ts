export type PieceType = "lion" | "elephant" | "giraffe" | "chick" | "chicken";
export type PlayerType = "me" | "opponent";
export type Piece = {
  type: PieceType;
  player: PlayerType;
};

export type Position = [number, number];
export type GameState = "in-game" | "win" | "lose";

export class Game {
  private board: (Piece | null)[][] = [
    [
      { type: "giraffe", player: "opponent" },
      { type: "lion", player: "opponent" },
      { type: "elephant", player: "opponent" },
    ],
    [
      null,
      { type: "chick", player: "opponent" },
      null,
    ],
    [
      null,
      { type: "chick", player: "me" },
      null,
    ],
    [
      { type: "giraffe", player: "me" },
      { type: "lion", player: "me" },
      { type: "elephant", player: "me" },
    ],
  ];
  private turn: PlayerType = "me";
  private capturedPieces: Record<PlayerType, Piece[]> = {
    me: [],
    opponent: [],
  };
  private gameState: GameState = "in-game";

  getBoard() {
    return this.board;
  }
  getCapturedPieces(player: PlayerType) {
    return this.capturedPieces[player];
  }

  getAvailableMoves([x, y]: Position): Position[] {
    const piece = this.board[y][x];
    if (piece === null || piece.player !== this.turn) return [];

    let moves = this.getAvailableMovesByType(piece.type);
    if (piece.player === "opponent") {
      moves = moves.map(([dx, dy]) => [-dx, -dy]);
    }
    const availableMoves = moves
      .map(([dx, dy]) => [x + dx, y + dy] satisfies Position)
      .filter(([x, y]) => x >= 0 && x < 3 && y >= 0 && y < 4).filter(
        ([x, y]) => {
          const piece = this.board[y][x];
          return piece === null || piece.player !== this.turn;
        },
      );

    return availableMoves;
  }

  getAvailableMovesWhenPlacing(piece: Piece): Position[] {
    if (this.turn !== piece.player) return [];

    const availableMoves = this.board
      .flatMap((row, y) =>
        row
          .map((_, x) => [x, y] as Position)
          .filter(([x, y]) => this.board[y][x] === null)
      )
      .filter(([x, y]) => {
        this.board[y][x] = piece;
        const availableMoves = this.getAvailableMoves([x, y]);
        this.board[y][x] = null;
        return availableMoves.length > 0;
      });

    return availableMoves;
  }

  private getAvailableMovesByType(type: PieceType): Position[] {
    switch (type) {
      case "lion":
        return [
          [-1, 1],
          [-1, 0],
          [-1, -1],
          [0, 1],
          [0, -1],
          [1, 1],
          [1, 0],
          [1, -1],
        ];
      case "elephant":
        return [[1, -1], [-1, -1], [1, 1], [-1, 1]];
      case "giraffe":
        return [[0, -1], [0, 1], [1, 0], [-1, 0]];
      case "chick":
        return [[0, -1]];
      case "chicken":
        return [[-1, 0], [-1, -1], [0, 1], [0, -1], [1, 0], [1, -1]];
    }
  }

  move([px, py]: Position, [x, y]: Position) {
    let piece = this.board[py][px];
    const moves = this.getAvailableMoves([px, py]);
    if (!moves.some(([mx, my]) => mx === x && my === y)) {
      throw new Error("Invalid move");
    }

    this.board[py][px] = null;
    const destPiece = this.board[y][x];
    if (destPiece !== null) {
      this.capturedPieces[this.turn].push({
        type: destPiece.type,
        player: destPiece.player,
      });
    }
    if (
      piece?.type === "chick" &&
      (y === 3 && piece?.player === "opponent" ||
        y === 0 && piece?.player === "me")
    ) {
      piece = { type: "chicken", player: piece.player };
    }
    this.board[y][x] = piece;
    this.turn = this.turn === "me" ? "opponent" : "me";
  }

  getGameState() {
    if (
      this.gameState === "in-game" &&
      (this.capturedPieces.me.some((piece) => piece.type === "lion") ||
        this.board[0].some((piece) =>
          piece?.type === "lion" && piece.player === "me"
        ))
    ) {
      this.gameState = "win";
    }
    if (
      this.gameState === "in-game" &&
      (this.capturedPieces.opponent.some((piece) => piece.type === "lion") ||
        this.board[3].some((piece) =>
          piece?.type === "lion" && piece.player === "opponent"
        ))
    ) {
      this.gameState = "lose";
    }
    return this.gameState;
  }

  place(x: number, y: number, piece: Piece) {
    const moves = this.getAvailableMovesWhenPlacing(piece);
    if (!moves.some(([mx, my]) => mx === x && my === y)) {
      throw new Error("Invalid move");
    }
    this.board[y][x] = piece;
  }
}
