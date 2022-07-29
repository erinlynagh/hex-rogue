import { Character, Enemy } from '@/classes/characterClasses';

export const ascii = {
  spartan: 'You',
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

export const you = new Character(aptitudes.spartan, { x: 1, y: 18 });
const archer = new Enemy(aptitudes.archer, { x: 0, y: 0 }, you);
const knight = new Enemy(aptitudes.knight, { x: 2, y: 2 }, you);
export const allEnemies: Enemy[][] = [
  [archer, knight],
  [knight, archer],
  [archer, knight, knight]
];
