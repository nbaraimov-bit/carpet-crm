import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./BlockPuzzle.css";

const BOARD_SIZE = 10;
const PIECE_COLORS = ["#ed4f86", "#aa62d4", "#e77a83", "#d75eaa"];

const SHAPE_LIBRARY = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [1, 1], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 1], [0, 2], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 1], [1, 0], [1, 1], [2, 1]],
];

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );
}

function createPieceRack() {
  return Array.from({ length: 3 }, (_, index) => {
    const shape = SHAPE_LIBRARY[Math.floor(Math.random() * SHAPE_LIBRARY.length)];
    return {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${index}`,
      cells: shape.map(([row, col]) => ({ row, col })),
      color: PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)],
    };
  });
}

function canPlaceShape(board, piece, startRow, startCol) {
  if (!piece || startRow === null || startCol === null) return false;

  return piece.cells.every(({ row, col }) => {
    const targetRow = startRow + row;
    const targetCol = startCol + col;

    return (
      targetRow >= 0 &&
      targetRow < BOARD_SIZE &&
      targetCol >= 0 &&
      targetCol < BOARD_SIZE &&
      !board[targetRow][targetCol]
    );
  });
}

function placeBlock(board, piece, startRow, startCol) {
  const nextBoard = board.map((row) => row.slice());

  piece.cells.forEach(({ row, col }) => {
    nextBoard[startRow + row][startCol + col] = piece.color;
  });

  return nextBoard;
}

function clearCompletedLines(board) {
  const fullRows = board
    .map((row, index) => (row.every(Boolean) ? index : -1))
    .filter((index) => index !== -1);
  const fullColumns = Array.from({ length: BOARD_SIZE }, (_, col) => col)
    .filter((col) => board.every((row) => Boolean(row[col])));

  if (!fullRows.length && !fullColumns.length) {
    return { board, lineCount: 0 };
  }

  const nextBoard = board.map((row) => row.slice());
  nextBoard.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      if (fullRows.includes(rowIndex) || fullColumns.includes(colIndex)) {
        nextBoard[rowIndex][colIndex] = null;
      }
    });
  });

  return {
    board: nextBoard,
    lineCount: fullRows.length + fullColumns.length,
  };
}

function hasAnyMove(board, pieces) {
  return pieces.some((piece) => {
    if (!piece) return false;

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (canPlaceShape(board, piece, row, col)) return true;
      }
    }

    return false;
  });
}

function getBoardCellAtPoint(grid, clientX, clientY) {
  if (!grid) return null;

  const rect = grid.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

  const gridStyle = window.getComputedStyle(grid);
  const gapX = Number.parseFloat(gridStyle.columnGap) || 0;
  const gapY = Number.parseFloat(gridStyle.rowGap) || 0;
  const pitchX = (rect.width + gapX) / BOARD_SIZE;
  const pitchY = (rect.height + gapY) / BOARD_SIZE;
  const col = Math.floor(x / pitchX);
  const row = Math.floor(y / pitchY);

  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    return null;
  }

  return { row, col };
}

function PieceShape({ piece, className = "" }) {
  const rowCount = Math.max(...piece.cells.map((cell) => cell.row)) + 1;
  const colCount = Math.max(...piece.cells.map((cell) => cell.col)) + 1;
  const occupied = new Set(piece.cells.map(({ row, col }) => `${row}:${col}`));

  return (
    <div
      className={`block-puzzle-piece-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${colCount}, var(--piece-cell-size))`,
        "--piece-color": piece.color,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rowCount * colCount }, (_, index) => {
        const row = Math.floor(index / colCount);
        const col = index % colCount;
        const isFilled = occupied.has(`${row}:${col}`);

        return (
          <span
            className={isFilled ? "block-puzzle-piece-cell" : "block-puzzle-piece-empty"}
            data-piece-row={isFilled ? row : undefined}
            data-piece-col={isFilled ? col : undefined}
            key={`${row}-${col}`}
          />
        );
      })}
    </div>
  );
}

export default function BlockPuzzle({ onBack }) {
  const [board, setBoard] = useState(createEmptyBoard);
  const [pieces, setPieces] = useState(createPieceRack);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [drag, setDrag] = useState(null);
  const gridRef = useRef(null);
  const dragRef = useRef(null);
  const gameStateRef = useRef({ board, pieces, score, gameOver });

  useLayoutEffect(() => {
    gameStateRef.current = { board, pieces, score, gameOver };
  }, [board, pieces, score, gameOver]);

  const handlePiecePointerDown = (event, pieceIndex) => {
    const piece = pieces[pieceIndex];
    const targetCell = event.target.closest("[data-piece-row]");

    if (
      !piece ||
      gameOver ||
      !targetCell ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const activeDrag = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      pieceIndex,
      piece,
      grabRow: Number(targetCell.dataset.pieceRow),
      grabCol: Number(targetCell.dataset.pieceCol),
      row: null,
      col: null,
      valid: false,
      clientX: event.clientX,
      clientY: event.clientY,
    };

    dragRef.current = activeDrag;
    setDrag(activeDrag);
  };

  useEffect(() => {
    const updateDragPosition = (event, activeDrag) => {
      const boardCell = getBoardCellAtPoint(
        gridRef.current,
        event.clientX,
        event.clientY
      );

      if (!boardCell) {
        return {
          ...activeDrag,
          row: null,
          col: null,
          valid: false,
          clientX: event.clientX,
          clientY: event.clientY,
        };
      }

      const row = boardCell.row - activeDrag.grabRow;
      const col = boardCell.col - activeDrag.grabCol;
      const currentBoard = gameStateRef.current.board;

      return {
        ...activeDrag,
        row,
        col,
        valid: canPlaceShape(currentBoard, activeDrag.piece, row, col),
        clientX: event.clientX,
        clientY: event.clientY,
      };
    };

    const handlePointerMove = (event) => {
      const activeDrag = dragRef.current;
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

      if (event.cancelable) event.preventDefault();
      const nextDrag = updateDragPosition(event, activeDrag);
      dragRef.current = nextDrag;
      setDrag(nextDrag);
    };

    const finishPointer = (event, shouldPlace) => {
      const activeDrag = dragRef.current;
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

      const finalDrag = updateDragPosition(event, activeDrag);

      if (shouldPlace && finalDrag.valid) {
        const currentState = gameStateRef.current;
        const currentPiece = currentState.pieces[finalDrag.pieceIndex];

        if (
          currentPiece &&
          canPlaceShape(currentState.board, currentPiece, finalDrag.row, finalDrag.col)
        ) {
          const placedBoard = placeBlock(
            currentState.board,
            currentPiece,
            finalDrag.row,
            finalDrag.col
          );
          const cleared = clearCompletedLines(placedBoard);
          let nextPieces = currentState.pieces.map((item, index) =>
            index === finalDrag.pieceIndex ? null : item
          );

          if (nextPieces.every((item) => item === null)) {
            nextPieces = createPieceRack();
          }

          const nextScore =
            currentState.score + currentPiece.cells.length + cleared.lineCount * BOARD_SIZE;
          const nextGameOver = !hasAnyMove(cleared.board, nextPieces);

          setBoard(cleared.board);
          setPieces(nextPieces);
          setScore(nextScore);
          setGameOver(nextGameOver);
        }
      }

      dragRef.current = null;
      setDrag(null);
    };

    const handlePointerUp = (event) => finishPointer(event, true);
    const handlePointerCancel = (event) => finishPointer(event, false);

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

  const restartGame = () => {
    dragRef.current = null;
    setDrag(null);
    setBoard(createEmptyBoard());
    setPieces(createPieceRack());
    setScore(0);
    setGameOver(false);
  };

  const previewCells = new Set();
  if (drag && drag.row !== null && drag.col !== null) {
    drag.piece.cells.forEach(({ row, col }) => {
      const boardRow = drag.row + row;
      const boardCol = drag.col + col;
      if (
        boardRow >= 0 &&
        boardRow < BOARD_SIZE &&
        boardCol >= 0 &&
        boardCol < BOARD_SIZE
      ) {
        previewCells.add(`${boardRow}:${boardCol}`);
      }
    });
  }

  return (
    <main className="block-puzzle-page" aria-labelledby="block-puzzle-title">
      <header className="block-puzzle-header">
        <button
          className="block-puzzle-back"
          type="button"
          onClick={onBack}
          aria-label="Mini o‘yinlarga qaytish"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className="block-puzzle-heading">
          <span className="block-puzzle-eyebrow">MINI O‘YINLAR</span>
          <h1 id="block-puzzle-title">Block Puzzle</h1>
        </div>
        <button className="block-puzzle-restart" type="button" onClick={restartGame}>
          Qayta boshlash
        </button>
      </header>

      <div className="block-puzzle-score-row" aria-live="polite">
        <span>Ball</span>
        <strong>{score}</strong>
      </div>

      <section className="block-puzzle-stage" aria-label="Block Puzzle o‘yini">
        <div
          className="block-puzzle-grid"
          ref={gridRef}
          role="img"
          aria-label="10 ga 10 o‘yin taxtasi"
        >
          {board.flatMap((row, rowIndex) =>
            row.map((color, colIndex) => {
              const isPreview = previewCells.has(`${rowIndex}:${colIndex}`);
              const cellClasses = ["block-puzzle-cell"];

              if (color) cellClasses.push("is-filled");
              if (isPreview) {
                cellClasses.push(drag.valid ? "preview-valid" : "preview-invalid");
              }

              return (
                <div
                  className={cellClasses.join(" ")}
                  key={`${rowIndex}-${colIndex}`}
                  aria-hidden="true"
                  style={color ? { "--placed-block-color": color } : undefined}
                />
              );
            })
          )}
        </div>
      </section>

      <section className="block-puzzle-rack" aria-label="Joylashtirish uchun shakllar">
        <div className="block-puzzle-rack-heading">
          <h2>Shakllar</h2>
          <p>Sichqoncha yoki barmoq bilan taxtaga sudrang</p>
        </div>
        <div className="block-puzzle-pieces">
          {pieces.map((piece, index) => (
            <button
              className={`block-puzzle-piece-slot${piece ? "" : " is-used"}${
                drag?.pieceIndex === index ? " is-dragging" : ""
              }`}
              key={piece?.id ?? `used-${index}`}
              type="button"
              disabled={!piece || gameOver}
              onPointerDown={(event) => handlePiecePointerDown(event, index)}
              aria-label={piece ? `Shakl ${index + 1}, ${piece.cells.length} katak` : `Shakl ${index + 1} ishlatildi`}
            >
              {piece ? (
                <PieceShape piece={piece} />
              ) : (
                <span className="block-puzzle-piece-used">Ishlatildi</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {gameOver && (
        <section
          className="block-puzzle-game-over"
          role="region"
          aria-label="O‘yin tugadi"
        >
          <div>
            <h2>O‘yin tugadi</h2>
            <p>Qolgan shakllardan hech biri taxtaga sig‘madi.</p>
            <strong>Yakuniy ball: {score}</strong>
          </div>
          <button type="button" onClick={restartGame}>
            Qayta boshlash
          </button>
        </section>
      )}

      {drag && (
        <div
          className={`block-puzzle-drag-ghost${drag.valid ? " is-valid" : " is-invalid"}`}
          style={{
            left: drag.clientX,
            top: drag.clientY - (drag.pointerType === "touch" ? 34 : 12),
          }}
          aria-hidden="true"
        >
          <PieceShape piece={drag.piece} />
        </div>
      )}
    </main>
  );
}
