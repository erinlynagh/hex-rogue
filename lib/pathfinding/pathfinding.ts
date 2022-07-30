import { Enemy } from '@/classes/characterClasses';
import {
  getHexCoordinates,
  getTileCoordinateNumbers,
  getTileCoordinateString,
  getTileNegativeSkew,
  getTilePositiveSkew,
  getTileVerticalColumn
} from '@/lib/hex-line-of-sight/hexCalcLib';
import { gridDetails } from '../constants/constants';

function getHexDistanceCords(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
) {
  return Math.sqrt(
    Math.pow(a - d, 2) + Math.pow(b - e, 2) + Math.pow(c - f, 2)
  );
}

function getHexDistance(start: string, end: string) {
  let a: number = -1;
  let b: number = -1;
  let c: number = -1;
  let d: number = -1;
  let e: number = -1;
  let f: number = -1;
  let { tileX: startX, tileY: startY } = getTileCoordinateNumbers(start);
  let { tileX: endX, tileY: endY } = getTileCoordinateNumbers(end);
  const {
    posSkew: startPosSkew,
    negSkew: startNegSkew,
    vertCol: startVertCol
  } = getHexCoordinates(startX, startY);
  const {
    posSkew: endPosSkew,
    negSkew: endNegSkew,
    vertCol: endVertCol
  } = getHexCoordinates(endX, endY);
  return getHexDistanceCords(
    startPosSkew,
    startNegSkew,
    startVertCol,
    endPosSkew,
    endNegSkew,
    endVertCol
  );
}

export function findNextMove(
  actor: Enemy,
  start: string,
  end: string
): { tileX: number; tileY: number } {
  let path: string[] = findPathBetween(start, end);
  path = path.filter(tile => tile !== start); // has to move!
  path = path.filter(tile => getHexDistance(start, tile) < 2); // can't move more than 1

  let minimumDistance = Infinity;
  let indexOfMinimum = -1;
  path.forEach((tileString, index) => {
    if (getHexDistance(end, tileString) < minimumDistance) {
      minimumDistance = getHexDistance(end, tileString);
      indexOfMinimum = index;
    }
  });
  console.log(path);
  console.log(indexOfMinimum);
  return getTileCoordinateNumbers(path[indexOfMinimum]);
}

export function findPathBetween(start: string, end: string): string[] {
  let tilesToActivate: string[] = [];
  let { tileX: startX, tileY: startY } = getTileCoordinateNumbers(start);
  const {
    posSkew: startPosSkew,
    negSkew: startNegSkew,
    vertCol: startVertCol
  } = getHexCoordinates(startX, startY);
  let { tileX: endX, tileY: endY } = getTileCoordinateNumbers(end);
  const {
    posSkew: endPosSkew,
    negSkew: endNegSkew,
    vertCol: endVertCol
  } = getHexCoordinates(endX, endY);
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
      startVertCol
    );
  } else {
    console.log('cant see');
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
      startVertCol
    );
  }

  return tilesToActivate;
}

function DrawPath(
  sightDirection: number,
  startPosSkew: number,
  tilesToActivate: string[],
  startNegSkew: number,
  startVertCol: number
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
        if (startVertCol === getTileVerticalColumn(j, i)) {
          tilesToActivate.push(getTileCoordinateString(j, i));
        }
      }
    }
  }
}
