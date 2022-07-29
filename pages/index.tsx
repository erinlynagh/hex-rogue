import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { you, allEnemies, ascii } from '@/lib/constants/constants';
import { Character, Enemy } from '@/classes/characterClasses';
import { checkTilesLib } from 'components/Hex/CheckTiles';
import {
  constructGridArray,
  ConstructGridLib
} from 'components/Hex/ConstructGrid';

const Home: NextPage = () => {
  const [gridRows, setGridRows] = React.useState<number[]>([]);
  const [turns, setTurns] = React.useState(0);
  const [totalTurns, setTotalTurns] = React.useState(0);
  const [depth, setDepth] = React.useState(0);
  const [enemies, setEnemies] = React.useState<Enemy[]>(allEnemies[0]);
  const [projectionType, setProjectionType] = React.useState(0);
  const [activeTiles, setActiveTiles] = React.useState<string[]>([]);

  function HandleActiveTiles(tile: string): void {
    if (activeTiles.includes(tile)) {
      setActiveTiles(activeTiles.filter(t => t !== tile));
    } else {
      setActiveTiles([...activeTiles, tile]);
    }
  }

  function Descend(): void {
    console.log('descending to level ' + (depth + 1));
    console.log('total turns: ' + (totalTurns + turns));
    setTotalTurns(totalTurns + turns);
    setTurns(0);
    setDepth(depth + 1);
  }

  function ConstructHexGrid(): React.ReactNode {
    return ConstructGridLib(
      projectionType,
      gridRows,
      activeTiles,
      HandleActiveTiles,
      checkTilesLib,
      depth
    );
  }

  useEffect(() => {
    setGridRows(constructGridArray());
  }, []);

  useEffect(() => {
    if (turns > 0) {
      enemies.forEach(enemy => {
        enemy.takeTurn();
      });
    }
  }, [turns, enemies]);

  useEffect(() => {
    setEnemies(allEnemies[depth]);
  }, [depth]);

  const baseButton = 'rounded-lg px-2 py-1';
  const blueButton =
    baseButton +
    ' text-white bg-blue-700 border-blue-700 hover:bg-blue-500 hover:border-blue-500';

  return (
    <div className="bg-black">
      <Head>
        <title>Hex Rogue</title>
        <meta name="description" content="Simple Hex Based Roguelike" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="flex flex-col gap-4">
          {ConstructHexGrid()}
          <div className="flex justify-evenly mt-[8px]">
            <input type={'button'} value={'Bash'} className={blueButton} />
            <input type={'button'} value={'Hop'} className={blueButton} />
            <input type={'button'} value={'Throw'} className={blueButton} />
          </div>
          <div className="flex justify-center gap-5">
            <input
              type={'button'}
              className={blueButton}
              value={'End Turn'}
              onClick={() => setTurns(turns + 1)}
            />
            <input
              type={'button'}
              value={'Descend'}
              className={blueButton}
              onClick={() => Descend()}
            />
          </div>
          <label className="text-white flex gap-2 justify-center">
            Projection Type:
            <select
              className="bg-slate-900"
              onChange={e => setProjectionType(parseInt(e.target.value))}
            >
              <option value={0}>In Game</option>
              <option value={1}>True</option>
            </select>
          </label>
          <input
            type={'button'}
            value={'Reset Tiles'}
            className={blueButton}
            onClick={() => setActiveTiles([])}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
