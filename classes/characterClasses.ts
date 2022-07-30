import {
  aptitudes,
  cooldowns,
  gridRows,
  ranges
} from '@/lib/constants/constants';
import { getTileCoordinateString } from '@/lib/hex-line-of-sight/hexCalcLib';
import { findNextMove, findPathBetween } from '@/lib/pathfinding/pathfinding';

let currentId = 0;

function getId() {
  return currentId++;
}

function getCooldown(expertise: string) {
  return cooldowns[expertise as keyof typeof aptitudes];
}

function getAttack(actor: Enemy): Function {
  const range = ranges[actor.aptitude as keyof typeof ranges];

  function dummy() {
    console.log(
      `${actor.aptitude} is attacking ${actor.target.aptitude} if in range ${range.min} to ${range.max}`
    );
  }

  switch (actor.aptitude) {
    case aptitudes.knight:
      return dummy;
    case aptitudes.wizard:
      return dummy;
    case aptitudes.archer:
      return dummy;
    default:
      return dummy;
  }
}

function dummy(actor: Enemy) {
  console.log(actor.aptitude + ' is moving ' + actor.target.aptitude);
}

function moveArcher(actor: Enemy) {
  const start = getTileCoordinateString(actor.position.x, actor.position.y);
  const end = getTileCoordinateString(
    actor.target.position.x,
    actor.target.position.y
  );
  let { tileX, tileY } = findNextMove(actor, start, end);
  console.log(tileX, tileY);
  actor.position.x = tileX;
  actor.position.y = tileY;
}

function getMove(actor: Enemy) {
  switch (actor.aptitude) {
    case aptitudes.knight:
      return dummy;
    case aptitudes.wizard:
      return dummy;
    case aptitudes.archer:
      return moveArcher;
    default:
      return moveArcher;
  }
}

export class Character {
  public aptitude: string;
  public id: number;
  public position: {
    x: number;
    y: number;
  };

  constructor(e: string, pos: { x: number; y: number }) {
    this.aptitude = e;
    this.id = getId();
    this.position = pos;
  }
}

export class Enemy extends Character {
  public target: Character;
  public cooldown: number;
  private countdown: number;
  private realAttack: Function;
  private move: Function;
  constructor(t: string, pos: { x: number; y: number }, tgt: Character) {
    super(t, pos);
    this.target = tgt;
    this.cooldown = getCooldown(this.aptitude);
    this.countdown = 0;
    this.realAttack = getAttack(this);
    this.move = getMove(this);
  }

  public takeTurn(): void {
    if (!this.attack()) {
      this.move(this);
    }
  }

  attack(): boolean {
    if (this.countdown > 0) {
      this.countdown--;
      return false;
    }
    this.countdown = this.cooldown;
    this.realAttack();
    return true;
  }
}
