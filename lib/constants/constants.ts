import { Character, Enemy } from '@/classes/characterClasses';
import assert from 'assert';

const runTests = true;

const gridMaxWidth = 5; // 5
const gridMaxHeight = 21; // 21

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
// don't spawn in the middle of your row for x, this only matters is y is even

export const you = new Character(aptitudes.spartan, { x: 1, y: 18 });
const archer = new Enemy(aptitudes.archer, { x: 1, y: 8 }, you);
const archer2 = new Enemy(aptitudes.archer, { x: 1, y: 1 }, you);
const archer3 = new Enemy(aptitudes.archer, { x: 0, y: 5 }, you);
const knight = new Enemy(aptitudes.knight, { x: 2, y: 2 }, you);
const knight2 = new Enemy(aptitudes.knight, { x: 2, y: 5 }, you);
export const allEnemies: Enemy[][] = [
  [archer, knight],
  [knight, archer2, archer3],
  [archer, knight, knight2]
];

if (runTests) {
  // test grid
  assert(gridMaxWidth >= 3, 'gridMaxWidth must be at least 3');
  assert(gridMaxHeight >= 3, 'gridMaxHeight must be at least 3');
  assert(gridMaxHeight % 2 === 1, 'gridMaxHeight must be an odd number');
  if (gridMaxWidth % 2 === 0) {
    assert(
      Math.ceil(gridMaxHeight / 2) < gridMaxWidth,
      'gridMaxHeight must be LESS than double than gridMaxWidth'
    );
  }

  // test spartan
  assert(you.position.x === 1, 'you.position.x must be 1');
  assert(you.position.y === 18, 'you.position.y must be 18');

  // test enemies
  for (let i = 0; i < allEnemies.length; i++) {
    let ids: number[] = [];
    allEnemies[i].forEach(enemy => {
      if (ids.includes(enemy.id)) {
        throw new Error('Enemy id must be unique');
      } else {
        ids.push(enemy.id);
      }
      assert(enemy.position.x >= 0, 'enemy.position.x must be >= 0');
      assert(
        enemy.position.x < gridMaxWidth,
        'enemy.position.x must be < gridMaxWidth'
      );
      assert(enemy.position.y >= 0, 'enemy.position.y must be >= 0');
      assert(
        enemy.position.y < gridMaxHeight,
        'enemy.position.y must be < gridMaxHeight'
      );
      assert(enemy.target.id === you.id, 'enemy.target.id must be you.id');
      assert(
        enemy.target.aptitude === aptitudes.spartan,
        'enemy.target.aptitude must be aptitudes.spartan'
      );
      if (
        enemy.aptitude === aptitudes.archer ||
        enemy.aptitude === aptitudes.knight ||
        enemy.aptitude === aptitudes.wizard
      ) {
        assert(enemy.cooldown === 0, 'enemy.cooldown must be 0');
      }

      if (
        enemy.aptitude === aptitudes.archer ||
        enemy.aptitude === aptitudes.wizard
      ) {
        assert(enemy.position.y <= 10, 'enemy.position.y must be <= 10');
      }
    });
  }
}
