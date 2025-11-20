interface Position {
  x: number;
  y: number;
}

interface Sample {
  x: number;
  y: number;
}

interface ExecuteWithSamplesResult {
  positions: Position[];
  samplesAfter: Sample[];
}

export function executeCommandsWithSamples(
  commands: string,
  startPosition: Position,
  rows: number,
  cols: number,
  samplesBefore: Sample[]
): ExecuteWithSamplesResult {
  let x = startPosition.x;
  let y = startPosition.y;

  const samples: Sample[] = samplesBefore.map((s) => ({ ...s }));

  const positions: Position[] = [{ x, y }];

  let carriedIndex: number | null = null;

  for (const cmd of commands) {
    switch (cmd) {
      case "Л":
        x = Math.max(0, x - 1);
        break;
      case "П":
        x = Math.min(cols - 1, x + 1);
        break;
      case "В":
        y = Math.max(0, y - 1);
        break;
      case "Н":
        y = Math.min(rows - 1, y + 1);
        break;
    }

    if (cmd === "О") {
      if (carriedIndex === null) {
        const idx = samples.findIndex((s) => s.x === x && s.y === y);
        if (idx !== -1) {
          carriedIndex = idx;
        }
      }
    } else if (cmd === "Б") {
      if (carriedIndex !== null) {
        samples[carriedIndex] = { x, y };
        carriedIndex = null;
      } 
    }

    positions.push({ x, y });
  }

  return { positions, samplesAfter: samples };
}
