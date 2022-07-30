import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import {
  allEnemies,
  debug,
  globalDepth,
  gridRows,
  increaseDepth
} from '@/lib/constants/constants';
import { Enemy } from '@/classes/characterClasses';
import { checkTileForRange, getTileAsciiArt } from 'components/Hex/CheckTiles';
import { ConstructGridLib } from 'components/Hex/ConstructGrid';
import { getTilesInLineOfSight } from '@/lib/hex-line-of-sight/hexCalcLib';
import { findPathBetween } from '@/lib/pathfinding/pathfinding';

const Home: NextPage = () => {
  const [turns, setTurns] = React.useState(0);
  const [totalTurns, setTotalTurns] = React.useState(0);
  const [depth, setDepth] = React.useState(0);
  const [enemies, setEnemies] = React.useState<Enemy[]>(allEnemies[0]);
  const [projectionType, setProjectionType] = React.useState(0);
  const [activeTiles, setActiveTiles] = React.useState<string[]>([]);
  const [debugMode, setDebugMode] = React.useState(0);
  const [lastTile, setLastTile] = React.useState('');
  const [forceRender, setForceRender] = React.useState(false);

  function rerender() {
    setForceRender(!forceRender);
  }

  function HandleTileClick(tile: string, hasChar: boolean): void {
    if (hasChar) {
      let range: { min: number; max: number } = checkTileForRange(tile)
        ? checkTileForRange(tile)
        : { min: 0, max: 10 };
      let y = getTilesInLineOfSight(gridRows, tile, range);
      setActiveTiles(y);
    }
    if (debug) {
      console.log(tile);
    }
    if (debugMode === 0) {
      if (activeTiles.includes(tile)) {
        setActiveTiles(activeTiles.filter(t => t !== tile));
      } else {
        setActiveTiles([...activeTiles, tile]);
      }
    } else if (debugMode === 1) {
      if (lastTile === tile) {
        setActiveTiles([]);
      } else {
        let y = getTilesInLineOfSight(gridRows, tile);
        setActiveTiles(y);
      }
    } else if (debugMode === 2) {
      HandlePathfinding();
    }
    if (lastTile !== tile) {
      setLastTile(tile);
    } else {
      setLastTile('');
    }

    function HandlePathfinding() {
      if (activeTiles.includes(tile)) {
        if (activeTiles.length >= 2) {
          setActiveTiles([]);
        } else {
          setActiveTiles(activeTiles.filter(t => t !== tile));
        }
      } else {
        if (activeTiles.length >= 2) {
          setActiveTiles([tile]);
        } else {
          if (activeTiles.length === 1) {
            if (lastTile === '') {
              setActiveTiles([]);
            } else {
              let y = findPathBetween(lastTile, tile);
              setActiveTiles([...y, tile]);
            }
          } else {
            setActiveTiles([...activeTiles, tile]);
          }
        }
      }
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
      HandleTileClick,
      getTileAsciiArt,
      depth
    );
  }

  useEffect(() => {
    console.log('welcome to the dungeon');
  }, []);

  useEffect(() => {
    setActiveTiles([]);
  }, [debugMode]);

  useEffect(() => {
    if (turns > 0) {
      enemies.forEach(enemy => {
        enemy.takeTurn();
      });
      setActiveTiles([]);
    }
  }, [turns, enemies, allEnemies]);

  useEffect(() => {
    increaseDepth();
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
      <main className="min-h-screen w-full pt-10 justify-center flex">
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
              {debugMode === 3 && (
                <div className="flex justify-center gap-2 flex-col">
                  <div className="flex flex-row gap-5 justify-center">
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
                  <p>add collision checks and more advanced ai using range</p>
                </div>
              )}
              <label className="text-white flex gap-2 justify-center">
                Debug Mode:
                <select
                  className="bg-slate-900"
                  onChange={e => {
                    setProjectionType(0);
                    setDebugMode(parseInt(e.target.value));
                  }}
                >
                  <option value={0}>Select Tiles</option>
                  <option value={1}>View Line of Sight</option>
                  <option value={2}>Pathfinding</option>
                  <option value={3}>Enemy Interaction</option>
                  {/*<option value={5}>Player Movement</option>
                  <option value={6}>Player Attack</option>
                  <option value={7}>Upgrades</option> */}
                </select>
              </label>

              <>
                <label className="text-white flex gap-2 justify-center">
                  Projection Type:
                  <select
                    className="bg-slate-900"
                    onChange={e => setProjectionType(parseInt(e.target.value))}
                  >
                    <option value={0}>Hexagon (Default)</option>
                    <option value={1}>X,Y</option>
                  </select>
                </label>
              </>

              <input
                type={'button'}
                value={'Reset Tiles'}
                className={blueButton}
                onClick={() => setActiveTiles([])}
              />
            </div>
          )}
          <a
            href="https://github.com/erinlynagh/hex-rogue"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            github
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
