import { allEnemies, ascii, you } from '@/lib/constants/constants';

export function checkTilesLib(i: number, j: number, depth: number) {
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
