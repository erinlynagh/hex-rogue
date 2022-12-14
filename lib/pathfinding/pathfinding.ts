import { Enemy } from '@/classes/characterClasses';
import {
  getHexCoordinates,
  getHexDistance,
  getSurroundingTiles,
  getTileCoordinateNumbers,
  getTileCoordinateString,
  getTileNegativeSkew,
  getTilePositiveSkew,
  getTileVerticalColumn
} from '@/lib/hex-line-of-sight/hexCalcLib';
import { gridDetails } from '../constants/constants';
import { canAttack } from '../enemy-attacks';

export function findNextMove(
  actor: string,
  target: string
): { tileX: number; tileY: number } {
  let path: string[] = getSurroundingTiles(actor);
  path = path.filter(tile => tile !== actor); // has to move!
  path = path.filter(tile => tile !== target); // cannot move onto target
  // needs collision detection with other enemies as well

  let minimumDistance = Infinity;
  let indexOfMinimum = -1;
  let canAttackFlag: boolean = false;
  path.forEach((tileString, index) => {
    if (getHexDistance(target, tileString) < minimumDistance) {
      if (canAttack(actor, tileString, target)) {
        canAttackFlag = true;
      }
      minimumDistance = getHexDistance(target, tileString);
      indexOfMinimum = index;
    }
  });
  if (canAttackFlag) {
    path.forEach((tileString, index) => {
      if (
        getHexDistance(target, tileString) > minimumDistance &&
        canAttack(actor, tileString, target)
      ) {
        minimumDistance = getHexDistance(target, tileString);
        indexOfMinimum = index;
      }
    });
  }

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
