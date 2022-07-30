import {
  getTileCoordinateNumbers,
  getTileCoordinateString,
  getTileNegativeSkew,
  getTilePositiveSkew,
  getTileVerticalColumn
} from '@/lib/hex-line-of-sight/hexCalcLib';

export function findPathBetween(
  start: string,
  end: string,
  gridRows: number[]
) {
  let tilesToActivate: string[] = [start, end];
  let { tileX: startX, tileY: startY } = getTileCoordinateNumbers(start);
  const startPosSkew = getTilePositiveSkew(startX, startY);
  const startNegSkew = getTileNegativeSkew(startX, startY);
  const startVertCol = getTileVerticalColumn(startX, startY, gridRows);
  let { tileX: endX, tileY: endY } = getTileCoordinateNumbers(end);
  const endPosSkew = getTilePositiveSkew(endX, endY);
  const endNegSkew = getTileNegativeSkew(endX, endY);
  const endVertCol = getTileVerticalColumn(endX, endY, gridRows);
  const seePos = startPosSkew === endPosSkew;
  const seeNeg = startNegSkew === endNegSkew;
  const seeVert = startVertCol === endVertCol;

  const canSee = seePos || seeNeg || seeVert;
  let sightDirection = -1;
  if (canSee) {
    sightDirection = seePos ? 0 : seeNeg ? 1 : 2;
  }
  if (canSee) {
    DrawPath(
      sightDirection,
      startPosSkew,
      tilesToActivate,
      startNegSkew,
      startVertCol,
      gridRows
    );
  } else {
    const PositiveDifference = Math.abs(startPosSkew - endPosSkew);
    const NegativeDifference = Math.abs(startNegSkew - endNegSkew);
    const VerticalDifference = Math.abs(startVertCol - endVertCol);
    let Direction = -1;
    let sightDirection = -1;
    if (
      PositiveDifference < NegativeDifference &&
      PositiveDifference < VerticalDifference
    ) {
      Direction = startPosSkew;
      sightDirection = 0;
    } else if (NegativeDifference < VerticalDifference) {
      Direction = startNegSkew;
      sightDirection = 1;
    } else {
      Direction = startVertCol;
      sightDirection = 2;
    }

    DrawPath(
      sightDirection,
      startPosSkew,
      tilesToActivate,
      startNegSkew,
      startVertCol,
      gridRows
    );
  }

  return tilesToActivate;
}

function DrawPath(
  sightDirection: number,
  startPosSkew: number,
  tilesToActivate: string[],
  startNegSkew: number,
  startVertCol: number,
  gridRows: number[]
) {
  if (sightDirection === 0) {
    // positive
    for (let i = 0; i < gridDetails.maxHeight; i++) {
      for (let j = 0; j < gridDetails.maxWidth; j++) {
        if (startPosSkew === getTilePositiveSkew(j, i)) {
          tilesToActivate.push(getTileCoordinateString(j, i));
        }
      }
    }
  } else if (sightDirection === 1) {
    // negative
    for (let i = 0; i < gridDetails.maxHeight; i++) {
      for (let j = 0; j < gridDetails.maxWidth; j++) {
        if (startNegSkew === getTileNegativeSkew(j, i)) {
          tilesToActivate.push(getTileCoordinateString(j, i));
        }
      }
    }
  } else if (sightDirection === 2) {
    // vertical
    for (let i = 0; i < gridDetails.maxHeight; i++) {
      for (let j = 0; j < gridDetails.maxWidth; j++) {
        if (startVertCol === getTileVerticalColumn(j, i, gridRows)) {
          tilesToActivate.push(getTileCoordinateString(j, i));
        }
      }
    }
  }
}
