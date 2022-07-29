import { Character, Enemy } from '@/classes/characterClasses';
import assert from 'assert';

const gridMaxWidth = 5; // 5
const gridMaxHeight = 21; // 21

assert(gridMaxWidth >= 3, 'gridMaxWidth must be at least 3');
assert(gridMaxHeight >= 3, 'gridMaxHeight must be at least 3');
assert(gridMaxWidth % 2 === 1, 'gridMaxWidth must be an odd number');
assert(gridMaxHeight % 2 === 1, 'gridMaxHeight must be an odd number');

export const gridDetails = {
  maxHeight: gridMaxHeight,
  maxWidth: gridMaxWidth,
  steps: gridMaxWidth - 2 < 0 ? 0 : gridMaxWidth - 2
};

export const ascii = {
  spartan: '@',
  knight: 'K',
  wizard: 'W',
  archer: 'A'
};

export const aptitudes = {
  spartan: 'spartan',
  knight: 'knight',
  wizard: 'wizard',
  archer: 'archer'
};

export const cooldowns = {
  spartan: 0,
  knight: 0,
  wizard: 0,
  archer: 0
};

export const ranges = {
  spartan: 1,
  knight: 1,
  wizard: 6,
  archer: 6
};

// y 12 seems like a good cutoff for enemy spawns
// don't spawn in the middle for x

export const you = new Character(aptitudes.spartan, { x: 1, y: 18 });
const archer = new Enemy(aptitudes.archer, { x: 0, y: 0 }, you);
const archer2 = new Enemy(aptitudes.archer, { x: 1, y: 1 }, you);
const archer3 = new Enemy(aptitudes.archer, { x: 0, y: 5 }, you);
const knight = new Enemy(aptitudes.knight, { x: 2, y: 2 }, you);
const knight2 = new Enemy(aptitudes.knight, { x: 2, y: 5 }, you);
export const allEnemies: Enemy[][] = [
  [archer, knight],
  [knight, archer2, archer3],
  [archer, knight, knight2]
];
