/**if (x > 1) {
      if (rowWidth === 5 && y > 7) {
        y += 0.1;
        position = Math.ceil(y / x);
      } else {
        position = Math.floor(y / x);
      }
    } else {
      position = -1;
    }
*/

function getTileCoordinateNumbers(tile: string) {
  const tileX = parseInt(tile.split('-')[0].split('x')[1]);
  const tileY = parseInt(tile.split('-')[1].split('y')[1]);
  return { tileX, tileY };
}

function getTileCoordinateString(x: number, y: number) {
  return 'x' + x + '-y' + y;
}

function getTileVerticalPosition(
  x: number,
  y: number,
  gridRows: number[],
  gridDetails: { maxHeight: number; maxWidth: number; steps: number }
): number {
  let position: number = -1;

  const inSteps =
    y < gridDetails.steps || y >= gridDetails.maxHeight - gridDetails.steps;
  if (inSteps) {
    if (y >= gridDetails.maxHeight - gridDetails.steps) {
      position =
        y - (gridDetails.maxHeight - gridDetails.maxWidth) + x + gridRows[x];
    } else {
      position =
        gridDetails.maxHeight -
        (1 + y) -
        (gridDetails.maxHeight - gridDetails.maxWidth) +
        x +
        gridRows[x];
    }
  } else if (!inSteps) {
    for (let i = 0; i < gridDetails.maxWidth; i++) {
      if (i === x) {
        position = 2 * i + (y % 2);
      }
    }
  }
  return position;
}

function getTilePositiveSkew(
  x: number,
  y: number,
  gridRows: number[],
  gridDetails: { maxHeight: number; maxWidth: number; steps: number }
): number {
  let position = -1;

  let flag = false;
  for (let i = 0; i < gridDetails.maxWidth + 2 * gridDetails.steps; i++) {
    for (let j = 0; j <= i; j++) {
      let comp = 2 * (i - j) + 5;
      if (x === j && y < comp) {
        return i;
      }
    }
  }

  return position;
}

/**
 * [0,1],2 -> 1 = 1
 * [1,2],3 -> 1 = 1
 * [2,3],4 -> 1 = 1.5
 * [3,4],5 -> 1 = 1.333
 * [3,5],4 -> 1 = 1.667
 * [4,6],5 -> 1 = 1.5
 *
 * [0,2],3 -> 2 = 2
 * [1,3],4 -> 2 = 2
 * [2,4],5 -> 2 = 2
 * [2,5],4 -> 2 = 2.5
 * [3,6],5 -> 2 = 2
 * [3,7],4 -> 2 = 2.333
 * [4,8],5 -> 2 = 2
 *
 * [0,3],4 -> 3 = 3
 * [1,4],5 -> 3 = 3
 * [1,5],4 -> 3 = 4 X
 * [2,6],5 -> 3 = 3
 * [2,7],4 -> 3 = 3.5
 * [3,8],5 -> 3 = 2.66667 X
 * [3,9],4 -> 3 = 3
 * [4,10],5-> 3 = 2.5 X
 *
 * [0,4],5 -> 4 = 4
 * [0,5]
 * [1,6]
 * [1,7]
 * [2,8],5 -> 4 = 4
 * [2,9],4 -> 4 = 4
 * [3,10],5 -> 4 = 4
 * [3,11],4 -> 4 = 3.667 X
 * [4,12],5 -> 4 = 3 X
 */

function getTileNegativeSkew(x: number, y: number, rowWidth: number): number {
  let position = -1;
  console.log(x, y, rowWidth);

  if (x === y) {
    position = 0;
  } else if (
    (x === 0 && y === 1) ||
    (x === 1 && y === 2) ||
    (x === 2 && y === 3) ||
    (x === 3 && y === 4) ||
    (x === 3 && y === 5) ||
    (x === 4 && y === 6)
  ) {
    position = 1;
  } else if (
    (x === 0 && y === 2) ||
    (x === 1 && y === 3) ||
    (x === 2 && y === 4) ||
    (x === 2 && y === 5) ||
    (x === 3 && y === 6) ||
    (x === 3 && y === 7) ||
    (x === 4 && y === 8)
  ) {
    position = 2;
  } else if (
    (x === 0 && y === 3) ||
    (x === 1 && y === 4) ||
    (x === 1 && y === 5) ||
    (x === 2 && y === 6) ||
    (x === 2 && y === 7) ||
    (x === 3 && y === 8) ||
    (x === 3 && y === 9) ||
    (x === 4 && y === 10)
  ) {
    position = 3;
  } else if (
    (x === 0 && y === 4) ||
    (x === 0 && y === 5) ||
    (x === 1 && y === 6) ||
    (x === 1 && y === 7) ||
    (x === 2 && y === 8) ||
    (x === 2 && y === 9) ||
    (x === 3 && y === 10) ||
    (x === 3 && y === 11) ||
    (x === 4 && y === 12)
  ) {
    position = 4;
  } else if (
    (x === 0 && y === 6) ||
    (x === 0 && y === 7) ||
    (x === 1 && y === 8) ||
    (x === 1 && y === 9) ||
    (x === 2 && y === 10) ||
    (x === 2 && y === 11) ||
    (x === 3 && y === 12) ||
    (x === 3 && y === 13) ||
    (x === 4 && y === 14)
  ) {
    position = 5;
  } else if (
    (x === 0 && y === 8) ||
    (x === 0 && y === 9) ||
    (x === 1 && y === 10) ||
    (x === 1 && y === 11) ||
    (x === 2 && y === 12) ||
    (x === 2 && y === 13) ||
    (x === 3 && y === 14) ||
    (x === 3 && y === 15) ||
    (x === 4 && y === 16)
  ) {
    position = 6;
  } else if (
    (x === 0 && y === 10) ||
    (x === 0 && y === 11) ||
    (x === 1 && y === 12) ||
    (x === 1 && y === 13) ||
    (x === 2 && y === 14) ||
    (x === 2 && y === 15) ||
    (x === 3 && y === 16) ||
    (x === 3 && y === 17)
  ) {
    position = 7;
  } else if (
    (x === 0 && y === 12) ||
    (x === 0 && y === 13) ||
    (x === 1 && y === 14) ||
    (x === 1 && y === 15) ||
    (x === 2 && y === 16) ||
    (x === 2 && y === 17) ||
    (x === 2 && y === 18)
  ) {
    position = 8;
  } else if (
    (x === 0 && y === 14) ||
    (x === 0 && y === 15) ||
    (x === 1 && y === 16) ||
    (x === 1 && y === 17) ||
    (x === 1 && y === 18) ||
    (x === 1 && y === 19)
  ) {
    position = 9;
  } else if (
    (x === 0 && y === 16) ||
    (x === 0 && y === 17) ||
    (x === 0 && y === 18) ||
    (x === 0 && y === 19) ||
    (x === 0 && y === 20)
  ) {
    position = 10;
  }

  return position;
}

function getTilesAboveAndBelow(
  gridRows: number[],
  gridDetails: { maxHeight: number; maxWidth: number; steps: number },
  x: number,
  y: number,
  range: { min: number; max: number } = { min: 2, max: 3 }
) {
  let tilesAbove: string[] = [];
  let tileVerticalPosition = getTileVerticalPosition(
    x,
    y,
    gridRows,
    gridDetails
  );
  for (let i = y - 2 * range.max; i <= y + 2 * range.max; i++) {
    for (let j = x - range.max; j < x + range.max; j++) {
      if (
        tileVerticalPosition ===
        getTileVerticalPosition(j, i, gridRows, gridDetails)
      ) {
        if (Math.abs(i - y) <= range.min) {
          continue;
        }
        tilesAbove.push(getTileCoordinateString(j, i));
      }
    }
  }
  return tilesAbove;
}

function getTilesPositive(
  gridRows: number[],
  gridDetails: { maxHeight: number; maxWidth: number; steps: number },
  x: number,
  y: number,
  range: { min: number; max: number } = { min: 2, max: 3 }
) {
  let tilesAbove: string[] = [];
  let tileVerticalPosition = getTilePositiveSkew(x, y, gridRows, gridDetails);
  for (let i = y - range.max; i <= y + range.max; i++) {
    for (let j = x - range.max; j < x + range.max; j++) {
      if (
        tileVerticalPosition ===
        getTilePositiveSkew(j, i, gridRows, gridDetails)
      ) {
        if (Math.abs(i - y) < range.min) {
          continue;
        }

        tilesAbove.push(getTileCoordinateString(j, i));
      }
    }
  }
  return tilesAbove;
}

function getTilesNegative(
  gridRows: number[],
  gridDetails: { maxHeight: number; maxWidth: number; steps: number },
  x: number,
  y: number,
  range: { min: number; max: number } = { min: 2, max: 3 }
) {
  let tilesAbove: string[] = [];
  let tileVerticalPosition = getTileNegativeSkew(x, y, gridRows[y + 1]);
  console.log('line: ', tileVerticalPosition);
  for (let i = y - range.max; i <= y + range.max; i++) {
    for (let j = x - range.max; j < x + range.max; j++) {
      if (tileVerticalPosition === getTileNegativeSkew(j, i, gridRows[i + 1])) {
        if (Math.abs(i - y) < range.min) {
          continue;
        }

        tilesAbove.push(getTileCoordinateString(j, i));
      }
    }
  }
  return tilesAbove;
}

export function getTilesInLineOfSight(
  gridDetails: { maxHeight: number; maxWidth: number; steps: number },
  gridRows: number[],
  tile: string
) {
  let tilesInLineOfSight: string[] = [];
  const { tileX, tileY } = getTileCoordinateNumbers(tile);
  tilesInLineOfSight.push(getTileCoordinateString(tileX, tileY));
  tilesInLineOfSight.push(
    ...getTilesAboveAndBelow(gridRows, gridDetails, tileX, tileY)
  );
  tilesInLineOfSight.push(
    ...getTilesPositive(gridRows, gridDetails, tileX, tileY)
  );
  tilesInLineOfSight.push(
    ...getTilesNegative(gridRows, gridDetails, tileX, tileY)
  );

  return tilesInLineOfSight;
}
