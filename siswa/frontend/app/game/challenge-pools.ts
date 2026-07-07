import { ChallengePools, ChallengePool, MorphemeBridgeEntry } from '../types';

export const LEVEL_POOLS: ChallengePools = {
  1: {
    name: 'Vokal Tunggal',
    items: ['A', 'I', 'U', 'E', 'O']
  },
  2: {
    name: 'Suku Kata Tunggal',
    items: ['ba', 'ca', 'da', 'ma', 'sa', 'li', 'ku', 'to']
  },
  3: {
    name: 'Suku Kata Kompleks',
    items: ['ban', 'tup', 'sing', 'plat', 'tra', 'nyi', 'klor', 'trans']
  },
  4: {
    name: 'Digraf & Diftong',
    items: ['ng', 'ny', 'sy', 'kh', 'ai', 'au', 'oi', 'ua']
  },
  5: {
    name: 'Kata Dasar',
    items: ['main', 'baca', 'tulis', 'makan', 'lari', 'sapu', 'buka', 'beli']
  }
};

/**
 * Gets the challenge pool for a given level.
 * Falls back to level 5 pool if the level exceeds 5.
 */
export function getChallengePool(level: number): ChallengePool {
  const targetLevel = level > 5 ? 5 : (level < 1 ? 1 : level);
  return LEVEL_POOLS[targetLevel];
}

/**
 * Morpheme Bridge Builder word pool.
 * Each entry has the target word, correct pieces (in order), and distractor tiles.
 */
export const MORPHEME_BRIDGE_POOL: MorphemeBridgeEntry[] = [
  { target: 'menulis',      pieces: ['me', 'nu', 'lis'],         distractors: ['ber', 'kan'] },
  { target: 'berlari',      pieces: ['ber', 'la', 'ri'],         distractors: ['me', 'an'] },
  { target: 'membaca',      pieces: ['mem', 'ba', 'ca'],         distractors: ['kan', 'ter'] },
  { target: 'berjalan',     pieces: ['ber', 'ja', 'lan'],        distractors: ['me', 'di'] },
  { target: 'bermain',      pieces: ['ber', 'ma', 'in'],         distractors: ['an', 'ke'] },
  { target: 'memakan',      pieces: ['me', 'ma', 'kan'],         distractors: ['ber', 'di'] },
  { target: 'terlihat',     pieces: ['ter', 'li', 'hat'],        distractors: ['me', 'kan'] },
  { target: 'penulisan',    pieces: ['pe', 'nu', 'li', 'san'],   distractors: ['ber', 'ter'] },
  { target: 'pembaca',      pieces: ['pem', 'ba', 'ca'],         distractors: ['an', 'ter'] },
  { target: 'dilakukan',    pieces: ['di', 'la', 'ku', 'kan'],   distractors: ['me', 'ber'] },
  { target: 'perjalanan',   pieces: ['per', 'ja', 'la', 'nan'],  distractors: ['me', 'di'] },
  { target: 'pembelajaran', pieces: ['pem', 'be', 'la', 'jar', 'an'], distractors: ['ber', 'ter'] },
];
