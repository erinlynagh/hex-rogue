import { gridDetails } from '../constants/constants';

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
  for (
    let i: number = 0;
    i < gridDetails.maxWidth + 2 * gridDetails.steps;
    i++
  ) {
    let max = i > gridDetails.maxWidth ? gridDetails.maxWidth : i;
    for (let j: number = 0; j <= max; j++) {
      let comp = 2 * (i - j) + 5;
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

function getTileNegativeSkew(x: number, y: number, rowWidth: number): number {
  let position = -1;

  // logic for when x is 0.
  // if y is less than the max width (usually 5), then the position is equal to y
  // else if y is in the range of (maxHeight-maxWidth <= y < maxHeight), the position is equal to (maxHeight-maxWidth - ((1+x) + (y-maxWidth+1)/2)
  // elseif y is greater than the maxWidth
  // subtract 1 from any odd y value
  // position is the y - 1, then y -2, then y -3, then y -4, then y -5
  // position = y - (1 + (y-(maxWidth+1))/2)

  // logic for when x is 1
  // if y === 2, then position = 1
  // else if y is in the range of (maxHeight-maxWidth <= y < maxHeight), the position is equal to (maxHeight-maxWidth - ((1+x) + (y-maxWidth+1)/2)
  // else if y is odd round down, position = y - ((1+x) + (y-maxWidth+1)/2

  // logic for when x is 2
  // if y is greater than maxHeight - maxWidth, then equal to (maxHeight-maxWidth - ((1+x) + (y-maxWidth+1)/2)
  // if y is odd, substract one and then divide by x, equal to (y - ((1+x) + (y-maxWidth+1)/2)

  // logic for when x is 3
  // if y is odd, subtract one
  // position = y - 3, then y -4, then y-5, then y -6, then y-7, then y -8, then y -9
  // position = y - ((1+x) + (y-maxWidth+1)/2

  // logic for when x is 4
  // if y is odd, subtract one
  // position = y - ((1+x) + (y-maxWidth+1)/2

  if (x === 0 && y < gridDetails.maxWidth) {
    return y;
  } else if (x === 1 && y === 2) {
    return 1;
  } else if (x === y) {
    return 0;
  } else {
    if (gridDetails.maxHeight - gridDetails.maxWidth <= y) {
      console.log('reducing');
      y = gridDetails.maxHeight - gridDetails.maxWidth;
    }
    if (y % 2 === 1) {
      console.log('odd y detected');
      y -= 1;
    }

    position = y - (1 + x + (y - gridDetails.maxWidth - 1) / 2);
  }

  // REAL ONE

  // if (x === y) {
  //   position = 0;
  // } else if (
  //   (x === 0 && y === 1) || // yes
  //   (x === 1 && y === 2) || // no
  //   (x === 2 && y === 3) || // yes
  //   (x === 3 && y === 4) || // yes
  //   (x === 3 && y === 5) || // yes
  //   (x === 4 && y === 6) //yes
  // ) {
  //   position = 1;
  // } else if (
  //   (x === 0 && y === 2) || // yes
  //   (x === 1 && y === 3) || // no
  //   (x === 2 && y === 4) || // yes
  //   (x === 2 && y === 5) || // yes
  //   (x === 3 && y === 6) || // yes
  //   (x === 3 && y === 7) || // yes
  //   (x === 4 && y === 8) //yes
  // ) {
  //   position = 2;
  // } else if (
  //   (x === 0 && y === 3) || // yes
  //   (x === 1 && y === 4) || // no
  //   (x === 1 && y === 5) || // no
  //   (x === 2 && y === 6) || // yes
  //   (x === 2 && y === 7) || // yes
  //   (x === 3 && y === 8) || // yes
  //   (x === 3 && y === 9) || // yes
  //   (x === 4 && y === 10) //no
  // ) {
  //   position = 3;
  // } else if (
  //   (x === 0 && y === 4) || // yes
  //   (x === 0 && y === 5) || // no
  //   (x === 1 && y === 6) || // no
  //   (x === 1 && y === 7) || // no
  //   (x === 2 && y === 8) || // yes
  //   (x === 2 && y === 9) || // yes
  //   (x === 3 && y === 10) || // no
  //   (x === 3 && y === 11) || // no
  //   (x === 4 && y === 12) //no
  // ) {
  //   position = 4;
  // } else if (
  //   (x === 0 && y === 6) || // no
  //   (x === 0 && y === 7) || // no
  //   (x === 1 && y === 8) || // no
  //   (x === 1 && y === 9) || // no
  //   (x === 2 && y === 10) || // yes
  //   (x === 2 && y === 11) || // yes
  //   (x === 3 && y === 12) || // no
  //   (x === 3 && y === 13) || // no
  //   (x === 4 && y === 14) //no
  // ) {
  //   position = 5;
  // } else if (
  //   (x === 0 && y === 8) || // no
  //   (x === 0 && y === 9) || // no
  //   (x === 1 && y === 10) || // no
  //   (x === 1 && y === 11) || // no
  //   (x === 2 && y === 12) || // yes
  //   (x === 2 && y === 13) || // yes
  //   (x === 3 && y === 14) || // no
  //   (x === 3 && y === 15) || // no
  //   (x === 4 && y === 16) //no
  // ) {
  //   position = 6;
  // } else if (
  //   (x === 0 && y === 10) || // no
  //   (x === 0 && y === 11) || // no
  //   (x === 1 && y === 12) || // no
  //   (x === 1 && y === 13) || // no
  //   (x === 2 && y === 14) || // yes
  //   (x === 2 && y === 15) || // yes
  //   (x === 3 && y === 16) || // no
  //   (x === 3 && y === 17) // no
  // ) {
  //   position = 7;
  // } else if (
  //   (x === 0 && y === 12) || // no
  //   (x === 0 && y === 13) || // no
  //   (x === 1 && y === 14) || // no
  //   (x === 1 && y === 15) || // no
  //   (x === 2 && y === 16) || // yes
  //   (x === 2 && y === 17) || // yes
  //   (x === 2 && y === 18) // no
  // ) {
  //   position = 8;
  // } else if (
  //   (x === 0 && y === 14) || // no
  //   (x === 0 && y === 15) || // no
  //   (x === 1 && y === 16) || // no
  //   (x === 1 && y === 17) || // no
  //   (x === 1 && y === 18) || // no
  //   (x === 1 && y === 19) // no
  // ) {
  //   position = 9;
  // } else if (
  //   (x === 0 && y === 16) || // no
  //   (x === 0 && y === 17) || // no
  //   (x === 0 && y === 18) || // no
  //   (x === 0 && y === 19) || // no
  //   (x === 0 && y === 20) // no
  // ) {
  //   position = 10;
  // }

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
  console.log('postive skew: ', tileVerticalPosition);
  for (let i = y - range.max; i <= y + range.max; i++) {
    for (let j = x - range.max; j <= x + range.max; j++) {
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
  console.log('negative skew: ', tileVerticalPosition);
  // for (let i = y - range.max; i <= y + range.max; i++) {
  //   for (let j = x - range.max; j <= x + range.max; j++) {
  //     if (tileVerticalPosition === getTileNegativeSkew(j, i, gridRows[i + 1])) {
  //       if (Math.abs(i - y) < range.min) {
  //         continue;
  //       }

  //       tilesAbove.push(getTileCoordinateString(j, i));
  //     }
  //   }
  // }
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
  // tilesInLineOfSight.push(
  //   ...getTilesAboveAndBelow(gridRows, gridDetails, tileX, tileY)
  // );
  // tilesInLineOfSight.push(
  //   ...getTilesPositive(gridRows, gridDetails, tileX, tileY)
  // );
  tilesInLineOfSight.push(
    ...getTilesNegative(gridRows, gridDetails, tileX, tileY)
  );

  return tilesInLineOfSight;
}
