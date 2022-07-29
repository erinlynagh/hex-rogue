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

const middle = [
  [0, 20],
  [1, 18],
  [2, 16],
  [2, 14],
  [2, 12],
  [2, 8],
  [2, 6],
  [2, 4],
  [1, 2],
  [0, 0]
];
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
    // if you are already at the top
    if (y === 0 || (x === 0 && y <= gridDetails.steps + 1) || x === y) {
      console.log('topmost');
      return tilesAbove;
    }

    let position: number = -1;
    console.log(gridDetails.maxHeight - 1 - gridDetails.steps);
    const inSteps =
      y < gridDetails.steps || y >= gridDetails.maxHeight - gridDetails.steps;
    console.log(inSteps);
    if (x === 0) {
      if (!inSteps && y % 2 === 0) {
        position = 0;
      } else if (inSteps) {
        position = 5 - (gridDetails.maxHeight - y);
      } else {
        position = 1;
      }
    } else if (!inSteps) {
      if (x === 0 && y % 2 === 0) {
        position = 0;
      } else if (x === 0 && y % 2 === 1) {
        position = 1;
      } else if (x === gridDetails.maxWidth - 4 && y % 2 === 0) {
        position = 2;
      } else if (x === gridDetails.maxWidth - 4 && y % 2 === 1) {
        position = 3;
      } else if (x === gridDetails.maxWidth - 3 && y % 2 === 0) {
        position = 4;
      } else if (x === gridDetails.maxWidth - 3 && y % 2 === 1) {
        position = 5;
      } else if (x === gridDetails.maxWidth - 2 && y % 2 === 0) {
        position = 6;
      } else if (x === gridDetails.maxWidth - 2 && y % 2 === 1) {
        position = 7;
      } else if (x === gridDetails.maxWidth - 1 && y % 2 === 0) {
        position = 8;
      }
    } else if (inSteps) {
      let compare = gridRows.length - 2 - 2 * x;
      let compare2 = 2 * x;
      if (y > gridDetails.steps) {
        position = 4 - (compare - y);
      } else {
        position = 4;
      }
    } else if (x + 0.5 == gridDetails.maxWidth / 2 && y % 2 === 0) {
      position = 4;
    }
    console.log(position);
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
      setActiveTiles([...activeTiles, ...getTilesInLineOfSight(tile)]);
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
