import { checkTileForRange } from 'components/Hex/CheckTiles';
import { globalDepth, gridRows } from '../constants/constants';
import { getTilesInLineOfSight } from '../hex-line-of-sight/hexCalcLib';

export function canAttack(actor: string, potential: string, target: string) {
  let range: { min: number; max: number } = checkTileForRange(actor)
    ? checkTileForRange(actor)
    : { min: 0, max: 10 };
  let y = getTilesInLineOfSight(gridRows, potential, range);
  return y.includes(target);
}
