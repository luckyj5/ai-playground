import type { TournamentFormat } from '../types';

export function prettyFormat(f: TournamentFormat): string {
  switch (f) {
    case 'single-elim':
      return 'Single elim';
    case 'double-elim':
      return 'Double elim';
    case 'round-robin':
      return 'Round robin';
    case 'swiss':
      return 'Swiss';
  }
}
