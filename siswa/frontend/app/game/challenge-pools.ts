import { ChallengePools, ChallengePool } from '../types';

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
