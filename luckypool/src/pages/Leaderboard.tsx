import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import type { Discipline } from '../types';
import { globalStats, leaderboard } from '../data/stats';
import { GLOBAL_QUICKFIRE, formatMs, useQuickfire } from '../data/quickfire';

type Tab = 'all' | Discipline | 'quickfire';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'all', label: 'Overall' },
  { id: '8-ball', label: '8-Ball' },
  { id: '9-ball', label: '9-Ball' },
  { id: 'snooker', label: 'Snooker' },
  { id: 'quickfire', label: 'Quickfire' },
];

export default function Leaderboard() {
  const [tab, setTab] = useState<Tab>('all');
  const stats = globalStats();
  const { record } = useQuickfire();

  const rows = tab === 'quickfire' ? null : leaderboard(tab);
  const rankedBoard = tab === 'quickfire'
    ? (() => {
        const board = [...GLOBAL_QUICKFIRE];
        if (record.bestMs !== null) {
          board.push({
            player: 'You',
            country: '—',
            ms: record.bestMs,
            at: new Date().toISOString().slice(0, 10),
          });
        }
        return board.sort((a, b) => a.ms - b.ms);
      })()
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-eyebrow">Global leaderboard</div>
          <h1 className="section-title mt-1">Compare, compete, come back tomorrow</h1>
          <p className="section-sub">
            Rolling rankings across all three disciplines, plus the global
            9-Ball Quickfire board. Week-over-week deltas refresh every
            Monday.
          </p>
        </div>
        <Link to="/play" className="btn-primary">
          Play Quickfire
        </Link>
      </div>

      {/* Global stat strip */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className="card p-4">
            <div className="text-xs uppercase tracking-wider text-chalk-muted">
              {s.label}
            </div>
            <div className="mt-1 font-display text-3xl text-cue-accent">{s.value}</div>
            {s.caption ? (
              <div className="mt-1 text-xs text-chalk-muted">{s.caption}</div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`chip ${
              tab === t.id
                ? 'border-cue-accent/60 bg-cue-accent/15 text-cue-accent'
                : ''
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card mt-4 overflow-hidden">
        {rows ? (
          <table className="w-full text-sm">
            <thead className="bg-ink-soft/60 text-xs uppercase tracking-wider text-chalk-muted">
              <tr>
                <th className="px-4 py-3 text-left w-12">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-right">Rating</th>
                <th className="px-4 py-3 text-right">7-day Δ</th>
                <th className="px-4 py-3 text-right">W / L</th>
                <th className="px-4 py-3 text-right">Streak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.player.id}
                  className="border-t border-chalk/10 hover:bg-chalk/[0.03]"
                >
                  <td className="px-4 py-3 font-mono text-chalk-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/players/${r.player.id}`}
                      className="flex items-center gap-3 hover:text-cue-accent"
                    >
                      <Avatar name={r.player.name} hue={r.player.avatarHue} size={28} />
                      <span>{r.player.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-chalk-muted">{r.player.country}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-chalk">
                    {r.rating}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono tabular-nums ${
                      r.weekDelta > 0
                        ? 'text-green-400'
                        : r.weekDelta < 0
                          ? 'text-red-400'
                          : 'text-chalk-muted'
                    }`}
                  >
                    {r.weekDelta > 0 ? '+' : ''}
                    {r.weekDelta}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-chalk">
                    {r.wins} / {r.losses}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono tabular-nums ${
                      r.streak > 0
                        ? 'text-cue-accent'
                        : r.streak < 0
                          ? 'text-red-400'
                          : 'text-chalk-muted'
                    }`}
                  >
                    {r.streak > 0 ? `W${r.streak}` : r.streak < 0 ? `L${-r.streak}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-ink-soft/60 text-xs uppercase tracking-wider text-chalk-muted">
              <tr>
                <th className="px-4 py-3 text-left w-12">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-right">Time</th>
                <th className="px-4 py-3 text-right">Set</th>
              </tr>
            </thead>
            <tbody>
              {rankedBoard!.map((row, i) => {
                const isYou = row.player === 'You';
                return (
                  <tr
                    key={`${row.player}-${i}`}
                    className={`border-t border-chalk/10 ${
                      isYou
                        ? 'bg-cue-accent/10 text-cue-accent'
                        : 'hover:bg-chalk/[0.03]'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.player}</td>
                    <td className="px-4 py-3 text-chalk-muted">{row.country}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatMs(row.ms)}
                    </td>
                    <td className="px-4 py-3 text-right text-chalk-muted">{row.at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
