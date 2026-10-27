export function calculateLineScore(lineCount) {
  const lines = Math.max(0, Math.floor(Number(lineCount) || 0));
  if (lines === 0) return 0;

  const multiplier = lines === 1 ? 1 : lines === 2 ? 1.5 : lines === 3 ? 2 : 3;
  return 10 * lines * multiplier;
}

export function clearCompletedLines(board) {
  const boardSize = board.length;
  const fullRows = board
    .map((row, index) => (row.every(Boolean) ? index : -1))
    .filter((index) => index !== -1);
  const fullColumns = Array.from({ length: boardSize }, (_, col) => col)
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
