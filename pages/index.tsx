import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import {
  you,
  allEnemies,
  ascii,
  debug,
  gridDetails
} from '@/lib/constants/constants';
import { Character, Enemy } from '@/classes/characterClasses';
import { checkTilesLib } from 'components/Hex/CheckTiles';
import {
  constructGridArray,
  ConstructGridLib
} from 'components/Hex/ConstructGrid';

function getTileCoordinateNumbers(tile: string) {
  const tileX = parseInt(tile.split('-')[0].split('x')[1]);
  const tileY = parseInt(tile.split('-')[1].split('y')[1]);
  return { tileX, tileY };
}

function getTileCoordinateString(x: number, y: number) {
  return 'x' + x + '-y' + y;
}

/**
 * [0, 2], 0 --> 2 =
 * [0, 1], 0 --> 3 =
 * [1, 2], 1 --> 4 =
 * [0, 0], 0 --> 4 =
 * [1, 1], 1 --> 5 =
 * [2, 2], 2 --> 6 =
 * maxHeight = 21
 * maxWidth = 5
 * ()
 */

function getTileVerticalPosition(
  x: number,
  y: number,
  gridRows: number[]
): number {
  let position: number = -1;

  const inSteps =
    y < gridDetails.steps || y >= gridDetails.maxHeight - gridDetails.steps;
  if (inSteps) {
    if (y >= gridDetails.maxHeight - gridDetails.steps) {
      position =
        y - (gridDetails.maxHeight - gridDetails.maxWidth) + x + gridRows[x];
    } else {
      position =
        gridDetails.maxHeight -
        (1 + y) -
        (gridDetails.maxHeight - gridDetails.maxWidth) +
        x +
        gridRows[x];
    }
  } else if (!inSteps) {
    for (let i = 0; i < gridDetails.maxWidth; i++) {
      if (i === x) {
        position = 2 * i + (y % 2);
      }
    }
  }
  return position;
}

const Home: NextPage = () => {
  const [gridRows, setGridRows] = React.useState<number[]>([]);
  const [turns, setTurns] = React.useState(0);
  const [totalTurns, setTotalTurns] = React.useState(0);
  const [depth, setDepth] = React.useState(0);
  const [enemies, setEnemies] = React.useState<Enemy[]>(allEnemies[0]);
  const [projectionType, setProjectionType] = React.useState(0);
  const [activeTiles, setActiveTiles] = React.useState<string[]>([]);
  const [debugMode, setDebugMode] = React.useState(0);

  function getTilesAbove(x: number, y: number) {
    let tilesAbove: string[] = [];
    let tileVerticalPosition = getTileVerticalPosition(x, y, gridRows);
    console.log('tileVerticalPosition', tileVerticalPosition);
    for (let i = 0; i < gridDetails.maxHeight; i++) {
      for (let j = 0; j < gridDetails.maxWidth; j++) {
        if (tileVerticalPosition === getTileVerticalPosition(j, i, gridRows)) {
          tilesAbove.push(getTileCoordinateString(j, i));
        }
      }
    }
    return tilesAbove;
  }

  function getTilesInLineOfSight(tile: string) {
    let tilesInLineOfSight: string[] = [];
    const { tileX, tileY } = getTileCoordinateNumbers(tile);
    tilesInLineOfSight.push(getTileCoordinateString(tileX, tileY));
    tilesInLineOfSight.push(...getTilesAbove(tileX, tileY));
    //getTilesBelow

    return tilesInLineOfSight;
  }

  function HandleActiveTiles(tile: string): void {
    console.log(tile);
    if (debugMode === 0) {
      if (activeTiles.includes(tile)) {
        setActiveTiles(activeTiles.filter(t => t !== tile));
      } else {
        setActiveTiles([...activeTiles, tile]);
      }
    } else if (debugMode === 1) {
      let y = getTilesInLineOfSight(tile);
      setActiveTiles(y);
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
    console.log(gridDetails);
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
        <div className="flex flex-col gap-4 text-white text-center">
          {ConstructHexGrid()}
          <div className="flex justify-evenly mt-[8px]">
            <input type={'button'} value={'Bash'} className={blueButton} />
            <input type={'button'} value={'Hop'} className={blueButton} />
            <input type={'button'} value={'Throw'} className={blueButton} />
          </div>
          {debug && (
            <div className="flex flex-col gap-2 border-2 border-white p-2 rounded-xl">
              <h1 className="text-2xl">Debug Settings</h1>
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
                Debug Mode:
                <select
                  className="bg-slate-900"
                  onChange={e => {
                    //setProjectionType(0);
                    setDebugMode(parseInt(e.target.value));
                  }}
                >
                  <option value={0}>View Projections</option>
                  <option value={1}>View Line of Sight</option>
                </select>
              </label>
              {debugMode === 0 && (
                <>
                  <label className="text-white flex gap-2 justify-center">
                    Projection Type:
                    <select
                      className="bg-slate-900"
                      onChange={e =>
                        setProjectionType(parseInt(e.target.value))
                      }
                    >
                      <option value={0}>In Game</option>
                      <option value={1}>True</option>
                    </select>
                  </label>
                </>
              )}
              <input
                type={'button'}
                value={'Reset Tiles'}
                className={blueButton}
                onClick={() => setActiveTiles([])}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
