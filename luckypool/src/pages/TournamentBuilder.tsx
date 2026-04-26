import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { players, venues } from '../data/mock';
import { useMatches, useTournaments, resetAll } from '../data/store';
import { generateSkeletonMatches } from '../lib/bracket';
import { Avatar } from '../components/Avatar';
import { DisciplineBadge } from '../components/DisciplineBadge';
import type {
  Discipline,
  NewTournamentDraft,
  Tournament,
  TournamentFormat,
} from '../types';

const disciplines: Discipline[] = ['8-ball', '9-ball', 'snooker'];
const formats: { id: TournamentFormat; label: string; desc: string }[] = [
  {
    id: 'single-elim',
    label: 'Single elimination',
    desc: 'Classic knockout bracket — one loss and you\'re out.',
  },
  {
    id: 'double-elim',
    label: 'Double elimination',
    desc: 'Loser\'s bracket gives everyone a second chance.',
  },
  {
    id: 'round-robin',
    label: 'Round robin',
    desc: 'Each player plays every other player once.',
  },
  {
    id: 'swiss',
    label: 'Swiss',
    desc: 'Pair by current record; no eliminations.',
  },
];

const defaultDraft: NewTournamentDraft = {
  name: '',
  discipline: '9-ball',
  format: 'single-elim',
  raceTo: 9,
  startDate: new Date(Date.now() + 14 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10),
  venueId: venues[0].id,
  entryFee: 100,
  prizePool: 5000,
  description: '',
  playerIds: [],
};

export default function TournamentBuilder() {
  const [tournaments, setTournaments] = useTournaments();
  const [, setMatches] = useMatches();
  const [draft, setDraft] = useState<NewTournamentDraft>(defaultDraft);
  const [playerFilter, setPlayerFilter] = useState('');
  const nav = useNavigate();

  const eligiblePlayers = useMemo(() => {
    return players
      .filter((p) => p.disciplines.includes(draft.discipline))
      .filter((p) =>
        playerFilter
          ? p.name.toLowerCase().includes(playerFilter.toLowerCase())
          : true,
      );
  }, [draft.discipline, playerFilter]);

  const togglePlayer = (id: string) => {
    setDraft((d) =>
      d.playerIds.includes(id)
        ? { ...d, playerIds: d.playerIds.filter((p) => p !== id) }
        : { ...d, playerIds: [...d.playerIds, id] },
    );
  };

  const canCreate = draft.name.trim() && draft.playerIds.length >= 2;

  const create = () => {
    if (!canCreate) return;
    const id = `t-${Date.now().toString(36)}`;
    const tournament: Tournament = {
      id,
      name: draft.name.trim(),
      discipline: draft.discipline,
      format: draft.format,
      raceTo: draft.raceTo,
      status: 'registering',
      startDate: draft.startDate,
      venueId: draft.venueId,
      playerIds: draft.playerIds,
      entryFee: draft.entryFee,
      prizePool: draft.prizePool,
      description:
        draft.description.trim() ||
        `A ${draft.discipline} ${draft.format} event, race to ${draft.raceTo}.`,
      bannerHue: Math.floor(Math.random() * 360),
    };
    const skeleton =
      draft.format === 'single-elim' || draft.format === 'double-elim'
        ? generateSkeletonMatches(
            id,
            draft.playerIds,
            draft.raceTo,
            draft.discipline,
          )
        : [];
    setTournaments((prev) => [tournament, ...prev]);
    if (skeleton.length) setMatches((prev) => [...prev, ...skeleton]);
    nav(`/tournaments/${id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="section-title">Tournament Builder</h1>
          <p className="section-sub">
            Set up a new tournament. Bracket matches generate automatically
            for single and double elimination formats.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset all LuckyPool demo data?')) resetAll();
          }}
          className="btn-ghost"
        >
          Reset demo data
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Setup form */}
        <div className="card p-6">
          <h2 className="font-display text-xl">1 · Setup</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Tournament name</label>
              <input
                className="input"
                placeholder="e.g., Friday Night 9-Ball Open"
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="label">Discipline</label>
              <div className="flex gap-2">
                {disciplines.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        discipline: d,
                        raceTo:
                          d === 'snooker'
                            ? 6
                            : d === '9-ball'
                              ? 9
                              : 7,
                        playerIds: [],
                      }))
                    }
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.discipline === d
                        ? 'border-cue-accent bg-cue/20 text-chalk'
                        : 'border-chalk/10 bg-chalk/[0.05] text-chalk/70 hover:bg-chalk/[0.08]'
                    }`}
                  >
                    <DisciplineBadge discipline={d} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">
                {draft.discipline === 'snooker'
                  ? 'Best of (frames)'
                  : 'Race to (games)'}
              </label>
              <input
                type="number"
                min={1}
                max={99}
                className="input"
                value={draft.raceTo}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    raceTo: Math.max(1, Math.min(99, Math.floor(Number(e.target.value) || 1))),
                  }))
                }
              />
            </div>
            <div>
              <label className="label">Start date</label>
              <input
                type="date"
                className="input"
                value={draft.startDate}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="label">Venue</label>
              <select
                className="input"
                value={draft.venueId}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, venueId: e.target.value }))
                }
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Entry fee (USD)</label>
              <input
                type="number"
                min={0}
                className="input"
                value={draft.entryFee}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    entryFee: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <label className="label">Prize pool (USD)</label>
              <input
                type="number"
                min={0}
                className="input"
                value={draft.prizePool}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    prizePool: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input min-h-[90px]"
                placeholder="Rules, format notes, payout breakdown…"
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </div>
          </div>

          <h2 className="mt-10 font-display text-xl">2 · Format</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  setDraft((d) => ({ ...d, format: f.id }))
                }
                className={`rounded-lg border p-4 text-left transition-colors ${
                  draft.format === f.id
                    ? 'border-cue-accent bg-cue/10'
                    : 'border-chalk/10 bg-ink-soft/60 hover:bg-chalk/[0.05]'
                }`}
              >
                <div className="font-medium text-chalk">{f.label}</div>
                <div className="mt-1 text-xs text-chalk-muted">{f.desc}</div>
              </button>
            ))}
          </div>

          <h2 className="mt-10 font-display text-xl">3 · Players</h2>
          <div className="mt-3 flex items-center gap-3">
            <input
              className="input max-w-xs"
              placeholder="Filter players…"
              value={playerFilter}
              onChange={(e) => setPlayerFilter(e.target.value)}
            />
            <span className="text-xs text-chalk-muted">
              {draft.playerIds.length} selected · suggest 2, 4, 8, 16, 32 for
              clean brackets
            </span>
          </div>
          <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {eligiblePlayers.map((p) => {
              const selected = draft.playerIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlayer(p.id)}
                  className={`flex items-center gap-3 rounded-md border p-2 text-left transition-colors ${
                    selected
                      ? 'border-cue-accent bg-cue/10'
                      : 'border-chalk/10 bg-ink-soft/60 hover:bg-chalk/[0.05]'
                  }`}
                >
                  <Avatar name={p.name} hue={p.avatarHue} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{p.name}</div>
                    <div className="text-[11px] text-chalk-muted">
                      {p.country} · {p.rating}
                    </div>
                  </div>
                  <span
                    className={`h-4 w-4 rounded border ${
                      selected
                        ? 'border-cue-accent bg-cue-accent'
                        : 'border-white/20'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDraft(defaultDraft)}
              className="btn-ghost"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={create}
              disabled={!canCreate}
              className="btn-primary"
            >
              Create tournament →
            </button>
          </div>
        </div>

        {/* Preview */}
        <aside className="space-y-6">
          <div className="card p-6">
            <div className="text-xs uppercase tracking-widest text-chalk-muted">
              Live preview
            </div>
            <h3 className="mt-1 font-display text-2xl text-chalk">
              {draft.name || 'Untitled tournament'}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <DisciplineBadge discipline={draft.discipline} />
              <span className="chip">
                {formats.find((f) => f.id === draft.format)?.label}
              </span>
              <span className="chip">Race to {draft.raceTo}</span>
              <span className="chip">{draft.playerIds.length} players</span>
            </div>
            <p className="mt-4 text-sm text-chalk/70">
              {draft.description || 'Add a description to tell players what to expect.'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-chalk-muted">
                  Venue
                </div>
                <div>
                  {venues.find((v) => v.id === draft.venueId)?.name}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-chalk-muted">
                  Starts
                </div>
                <div>
                  {new Date(draft.startDate).toLocaleDateString(undefined, {
                    dateStyle: 'medium',
                  })}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-chalk-muted">
                  Prize pool
                </div>
                <div>${draft.prizePool.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-chalk-muted">
                  Entry fee
                </div>
                <div>${draft.entryFee.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-3 text-xs uppercase tracking-widest text-chalk-muted">
              Your tournaments
            </div>
            <ul className="space-y-2 text-sm">
              {tournaments.slice(0, 6).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate">{t.name}</span>
                  <span className="chip capitalize">{t.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
