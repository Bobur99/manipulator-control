import React from 'react';
import { Box } from '@mui/material';

interface GridTableProps {
  rows: number;
  cols: number;
  manipulatorPosition: { x: number; y: number }; // x = колонка, y = строка
  samples?: { x: number; y: number }[]; // расположение образцов
}

const GridTable: React.FC<GridTableProps> = ({
  rows,
  cols,
  manipulatorPosition,
  samples = [],
}) => {
  return (
    <Box
      display="grid"
      gridTemplateRows={`repeat(${rows}, 50px)`}
      gridTemplateColumns={`repeat(${cols}, 50px)`}
      gap={1}
    >
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const isManipulator =
            manipulatorPosition.x === col && manipulatorPosition.y === row;
          const hasSample = samples.some(
            (s) => s.x === col && s.y === row
          );

          return (
            <Box
              key={`${row}-${col}`}
              sx={{
                width: 50,
                height: 50,
                border: '1px solid #999',
                backgroundColor: isManipulator
                  ? 'blue'
                  : hasSample
                  ? 'orange'
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {isManipulator ? 'M' : hasSample ? 'O' : ''}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default GridTable;
