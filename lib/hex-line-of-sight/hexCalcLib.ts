import { gridDetails } from '../constants/constants';

export function getTileCoordinateNumbers(tile: string) {
  const tileX = parseInt(tile.split('-')[0].split('x')[1]);
  const tileY = parseInt(tile.split('-')[1].split('y')[1]);
  return { tileX, tileY };
}

export function getTileCoordinateString(x: number, y: number) {
  return 'x' + x + '-y' + y;
}

export function getTileVerticalColumn(
  x: number,
  y: number,
  gridRows: number[]
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

// not generic
export function getTilePositiveSkew(x: number, y: number): number {
  let position = -1;
  for (
    let i: number = 0;
    i < gridDetails.maxWidth + 2 * gridDetails.steps;
    i++
  ) {
    let max = i > gridDetails.maxWidth ? gridDetails.maxWidth : i;
    for (let j: number = 0; j <= max; j++) {
      let comp = 2 * (i - j) + gridDetails.maxWidth;
      let triggerNumber = gridDetails.maxHeight - 2;
      if (comp >= triggerNumber) {
        comp -= 1 + (comp - triggerNumber) / 2;
      }
      if (x === j && y < comp) {
        return i;
      }
    }
  }

  return position;
}

export function getTileNegativeSkew(x: number, y: number): number {
  let position = -1;
  if (x === 0 && y < gridDetails.maxWidth) {
    return y;
  } else if (x === y) {
    return 0;
  }
  if (y <= gridDetails.steps) {
    return y - x;
  } else {
    if (gridDetails.maxHeight - gridDetails.maxWidth <= y) {
      y = gridDetails.maxHeight - gridDetails.maxWidth;
    }
    if (y % 2 === 1) {
      y -= 1;
    }

    position = y - (1 + x + (y - gridDetails.maxWidth - 1) / 2);
  }

  return position;
}

function getTilesAboveAndBelow(
  gridRows: number[],
  x: number,
  y: number,
  range: { min: number; max: number }
) {
  let tilesAbove: string[] = [];
  let tileVerticalPosition = getTileVerticalColumn(x, y, gridRows);
  for (let i = y - 2 * range.max; i <= y + 2 * range.max; i++) {
    for (let j = x - range.max; j < x + range.max; j++) {
      if (tileVerticalPosition === getTileVerticalColumn(j, i, gridRows)) {
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
  x: number,
  y: number,
  range: { min: number; max: number }
) {
  let tilesAbove: string[] = [];
  let tileVerticalPosition = getTilePositiveSkew(x, y);
  // console.log('postive skew: ', tileVerticalPosition);
  for (let i = y - range.max; i <= y + range.max; i++) {
    for (let j = x - range.max; j <= x + range.max; j++) {
      if (tileVerticalPosition === getTilePositiveSkew(j, i)) {
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
  x: number,
  y: number,
  range: { min: number; max: number }
) {
  let tilesAbove: string[] = [];
  let tileVerticalPosition = getTileNegativeSkew(x, y);
  console.log('negative skew: ', tileVerticalPosition);
  for (let i = y - range.max; i <= y + range.max; i++) {
    for (let j = x - range.max; j <= x + range.max; j++) {
      if (tileVerticalPosition === getTileNegativeSkew(j, i)) {
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
  tile: string,
  range: { min: number; max: number } = { min: 0, max: 10 }
) {
  let tilesInLineOfSight: string[] = [];
  const { tileX, tileY } = getTileCoordinateNumbers(tile);
  tilesInLineOfSight.push(getTileCoordinateString(tileX, tileY));
  tilesInLineOfSight.push(
    ...getTilesAboveAndBelow(gridRows, tileX, tileY, range)
  );
  tilesInLineOfSight.push(...getTilesPositive(tileX, tileY, range));
  tilesInLineOfSight.push(...getTilesNegative(tileX, tileY, range));

  return tilesInLineOfSight;
}
