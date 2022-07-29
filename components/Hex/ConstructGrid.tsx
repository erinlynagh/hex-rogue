import { gridDetails } from '@/lib/constants/constants';

export function constructGridArray(): number[] {
  let rowLengths = [];
  for (let i = 0; i <= gridDetails.maxHeight; i++) {
    if (
      i <= gridDetails.maxHeight - gridDetails.steps ||
      i <= gridDetails.maxHeight / 2
    ) {
      const calcRowLength = i;
      calcRowLength > gridDetails.maxWidth
        ? rowLengths.push(
            i % 2 === 1 ? gridDetails.maxWidth : gridDetails.maxWidth - 1
          )
        : rowLengths.push(calcRowLength);
    } else {
      const calcRowLength = gridDetails.maxHeight - i + 1;
      calcRowLength > gridDetails.maxWidth
        ? rowLengths.push(gridDetails.maxWidth)
        : rowLengths.push(calcRowLength);
    }
  }
  return rowLengths; //79 cells
}

export function ConstructGridLib(
  projectionType: number,
  gridRows: number[],
  activeTiles: string[],
  HandleActiveTiles: (tile: string) => void,
  checkTile: (j: number, i: number, depth: number) => string,
  depth: number
): JSX.Element {
  const rowClassTrue = 'flex flex-row align-center';
  const hexClassTrue =
    'w-10 h-10 rounded-full text-center flex flex-col justify-center align-center ';
  const rowClass = 'flex flex-row justify-center align-center gap-12 ';
  const hexClass = hexClassTrue + ' my-[-8.5px] ';
  const hexClassActive = 'bg-green-800 hover:bg-green-400 text-white';
  const hexClassInactive =
    'bg-slate-800 hover:bg-slate-400 text-white hover:text-black';

  const showInGameProjection = projectionType === 0;
  if (gridRows.length === 0) {
    return <></>;
  }
  return (
    <div className="flex flex-col content-center">
      {[...Array(gridRows.length - 1)].map((x, i) => {
        return (
          <div
            className={showInGameProjection ? rowClass : rowClassTrue}
            key={i}
          >
            {[...Array(gridRows[i + 1])].map((x, j) => {
              const hexPositionId = 'hex-x-' + j + '-y-' + i;
              const isActive = activeTiles.includes(hexPositionId);
              return (
                <div
                  key={i + ', ' + j}
                  id={hexPositionId}
                  className={
                    (showInGameProjection ? hexClass : hexClassTrue) +
                    (isActive ? hexClassActive : hexClassInactive)
                  }
                  onClick={() => HandleActiveTiles(hexPositionId)}
                >
                  <p style={{ userSelect: 'none' }}>{checkTile(i, j, depth)}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
