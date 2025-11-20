const ALLOWED_COMMANDS = ['Л', 'П', 'В', 'Н', 'О', 'Б'] as const;
export type CommandChar = (typeof ALLOWED_COMMANDS)[number];

export function cleanCommands(input: string): string {
  const noSpaces = input.replace(/\s+/g, '').toUpperCase();
  return noSpaces;
}

export function hasInvalidCommands(input: string): boolean {
  return /[^ЛПВНОБ]/i.test(input.replace(/\s+/g, ''));
}

export function encodeRLE(s: string): string {
  if (!s) return '';
  let result = '';
  let current = s[0];
  let count = 1;

  for (let i = 1; i < s.length; i++) {
    if (s[i] === current) {
      count++;
    } else {
      result += (count > 1 ? count.toString() : '') + current;
      current = s[i];
      count = 1;
    }
  }

  result += (count > 1 ? count.toString() : '') + current;
  return result;
}

export function optimizeCommands(input: string): string {
  const cleaned = cleanCommands(input);
  if (!cleaned) return '';

  const baseRLE = encodeRLE(cleaned);
  let best = baseRLE;

  const n = cleaned.length;

  for (let p = 1; p <= Math.floor(n / 2); p++) {
    const pattern = cleaned.slice(0, p);

    let k = 1;
    while (cleaned.slice(p * k, p * (k + 1)) === pattern) {
      k++;
    }

    if (k <= 1) continue;

    const prefixLen = p * k;
    const remainder = cleaned.slice(prefixLen);

    const encodedPattern = `${k}(${encodeRLE(pattern)})`;
    const encodedRemainder = remainder ? encodeRLE(remainder) : '';

    const candidate = encodedPattern + encodedRemainder;

    if (candidate.length < best.length) {
      best = candidate;
    }
  }

  return best;
}
