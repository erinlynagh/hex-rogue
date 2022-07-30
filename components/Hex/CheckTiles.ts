import { Enemy } from '@/classes/characterClasses';
import {
  allEnemies,
  ascii,
  globalDepth,
  ranges,
  you
} from '@/lib/constants/constants';
import { getTileCoordinateNumbers } from '@/lib/hex-line-of-sight/hexCalcLib';

export function getTileAsciiArt(i: number, j: number, depth: number): string {
  let char = '';
  if (you.position.x === j && you.position.y === i) {
    char = ascii.spartan;
  } else {
    allEnemies[depth].forEach(enemy => {
      if (enemy.position.x === j && enemy.position.y === i) {
        char = ascii[enemy.aptitude as keyof typeof ascii];
      }
    });
  }
  return char;
}

export function checkTileForEnemy(
  tile: string,
  depth: number
): Enemy | undefined {
  let { tileX, tileY } = getTileCoordinateNumbers(tile);
  allEnemies[depth].forEach(enemy => {
    if (enemy.position.x === tileX && enemy.position.y === tileY) {
      return enemy;
    }
  });
  return undefined;
}

export function checkTileForRange(
  tile: string,
  range: { min: number; max: number } = { min: 0, max: 0 }
): { min: number; max: number } {
  let { tileX, tileY } = getTileCoordinateNumbers(tile);
  if (tileX === you.position.x && tileY === you.position.y) {
    range = ranges[you.aptitude as keyof typeof ranges];
  }
  allEnemies[globalDepth].forEach(enemy => {
    if (enemy.position.x === tileX && enemy.position.y === tileY) {
      range = ranges[enemy.aptitude as keyof typeof ranges];
    }
  });
  return range;
}
