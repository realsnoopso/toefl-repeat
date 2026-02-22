/**
 * Compare user's speech with the original sentence.
 * Returns annotated tokens showing:
 * - correct words (as-is)
 * - wrong words (with correction): ~~wrong~~correct
 * - missing words: (missing)
 * - extra words: [extra]
 */

interface DiffToken {
  type: 'correct' | 'wrong' | 'missing' | 'extra';
  original?: string; // expected word
  spoken?: string;   // what user said
}

export function diffSentences(original: string, spoken: string): DiffToken[] {
  const origWords = normalize(original).split(/\s+/).filter(Boolean);
  const spokenWords = normalize(spoken).split(/\s+/).filter(Boolean);

  if (origWords.length === 0) return spokenWords.map(w => ({ type: 'extra' as const, spoken: w }));
  if (spokenWords.length === 0) return origWords.map(w => ({ type: 'missing' as const, original: w }));

  // Use LCS (Longest Common Subsequence) based diff
  const dp: number[][] = Array.from({ length: origWords.length + 1 }, () =>
    Array(spokenWords.length + 1).fill(0)
  );

  for (let i = 1; i <= origWords.length; i++) {
    for (let j = 1; j <= spokenWords.length; j++) {
      if (origWords[i - 1].toLowerCase() === spokenWords[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffToken[] = [];
  let i = origWords.length;
  let j = spokenWords.length;

  const stack: DiffToken[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1].toLowerCase() === spokenWords[j - 1].toLowerCase()) {
      stack.push({ type: 'correct', original: origWords[i - 1], spoken: spokenWords[j - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'extra', spoken: spokenWords[j - 1] });
      j--;
    } else {
      stack.push({ type: 'missing', original: origWords[i - 1] });
      i--;
    }
  }

  // Reverse (we built it backwards)
  stack.reverse();

  // Post-process: merge adjacent missing+extra into "wrong" (substitution)
  for (let k = 0; k < stack.length; k++) {
    if (k + 1 < stack.length && stack[k].type === 'missing' && stack[k + 1].type === 'extra') {
      result.push({ type: 'wrong', original: stack[k].original, spoken: stack[k + 1].spoken });
      k++; // skip next
    } else if (k + 1 < stack.length && stack[k].type === 'extra' && stack[k + 1].type === 'missing') {
      result.push({ type: 'wrong', original: stack[k + 1].original, spoken: stack[k].spoken });
      k++;
    } else {
      result.push(stack[k]);
    }
  }

  return result;
}

function normalize(text: string): string {
  return text
    .replace(/[.,!?;:'"()\[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Render diff tokens as an annotated string.
 * Correct: word
 * Wrong: ~~spoken~~original
 * Missing: (original)
 * Extra: [spoken]
 */
export function renderDiffText(tokens: DiffToken[]): string {
  return tokens.map(t => {
    switch (t.type) {
      case 'correct': return t.original || '';
      case 'wrong': return `~~${t.spoken}~~${t.original}`;
      case 'missing': return `(${t.original})`;
      case 'extra': return `[${t.spoken}]`;
    }
  }).join(' ');
}

/**
 * Calculate accuracy score (0-5) based on diff
 */
export function calculateAccuracy(tokens: DiffToken[]): number {
  if (tokens.length === 0) return 0;
  const correct = tokens.filter(t => t.type === 'correct').length;
  const total = tokens.filter(t => t.type !== 'extra').length; // don't penalize extra words as much
  if (total === 0) return 0;
  return Math.round((correct / total) * 5 * 10) / 10;
}
