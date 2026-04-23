import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader'
import {
  CATEGORY_OPTIONS,
  suggestListing,
  TRADITION_OPTIONS,
} from '../lib/aiListing'
import { useCatalog } from '../store/CatalogContext'
import { useAuth } from '../store/AuthContext'
import type { CraftCategory, CraftTradition } from '../types'
import { formatINR, toMinor } from '../lib/currency'

type Draft = {
  name: string
  description: string
  story: string
  category: CraftCategory
  tradition: CraftTradition
  origin: string
  artisan: string
  priceRupees: number
  mrpRupees: number
  stock: number
  tags: string
  imageDataUrl: string
}

const EMPTY_DRAFT: Draft = {
  name: '',
  description: '',
  story: '',
  category: 'Textiles & Sarees',
  tradition: 'Block Print (Bagru/Sanganeri)',
  origin: '',
  artisan: '',
  priceRupees: 0,
  mrpRupees: 0,
  stock: 1,
  tags: '',
  imageDataUrl: '',
}

export default function SellNew() {
  const { addProduct } = useCatalog()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [generating, setGenerating] = useState(false)

  function patch<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
  }

  async function onImage(dataUrl: string) {
    patch('imageDataUrl', dataUrl)
    setGenerating(true)
    // Brief pause to make the "AI is thinking" feel real.
    await new Promise((r) => setTimeout(r, 600))
    const s = suggestListing(dataUrl)
    setDraft((d) => ({
      ...d,
      name: d.name || s.name,
      description: d.description || s.description,
      story: d.story || s.story,
      category: s.category,
      tradition: s.tradition,
      origin: d.origin || s.origin,
      artisan: d.artisan || user?.name || 'Artisan',
      priceRupees: d.priceRupees || Math.round(s.priceMinor / 100),
      mrpRupees: d.mrpRupees || Math.round(s.mrpMinor / 100),
      tags: d.tags || s.tags.join(', '),
      imageDataUrl: dataUrl,
    }))
    setGenerating(false)
  }

  function publish(asDraft: boolean) {
    if (!draft.imageDataUrl || !draft.name) return
    addProduct({
      name: draft.name,
      description: draft.description,
      story: draft.story,
      imageDataUrl: draft.imageDataUrl,
      priceMinor: toMinor(draft.priceRupees),
      mrpMinor: draft.mrpRupees > 0 ? toMinor(draft.mrpRupees) : undefined,
      category: draft.category,
      tradition: draft.tradition,
      origin: draft.origin,
      artisan: draft.artisan || user?.name || 'Artisan',
      tags: draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      stock: Math.max(0, Math.floor(draft.stock)),
      published: !asDraft,
    })
    navigate('/sell')
  }

  const canPublish =
    draft.imageDataUrl &&
    draft.name.trim().length > 0 &&
    draft.priceRupees > 0 &&
    draft.origin.trim().length > 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-bark">List a new craft</h1>
      <p className="text-sm text-bark/70 mt-1">
        Upload a photo. We’ll draft a listing in the next second. Edit anything
        before you publish.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ImageUploader
            onImage={(u) => void onImage(u)}
            currentImage={draft.imageDataUrl}
          />
          {generating && (
            <div className="card p-4 bg-saffron-50 border-saffron-200 text-sm text-saffron-700 animate-fade-in">
              ✨ Analysing your photo and drafting the listing…
            </div>
          )}
          <div className="card p-4 bg-parchment/40 text-sm text-bark/80 leading-relaxed">
            <div className="label">How this works</div>
            Our vision model looks at the photo, guesses the craft tradition
            (e.g. Kalamkari vs Madhubani), suggests a title, story, category,
            tags and a fair price band. You stay in control — review and edit
            anything.
          </div>
        </div>

        <div className="space-y-4">
          <Field
            label="Product name"
            value={draft.name}
            onChange={(v) => patch('name', v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={draft.category}
              onChange={(v) => patch('category', v as CraftCategory)}
              options={CATEGORY_OPTIONS}
            />
            <Select
              label="Craft tradition"
              value={draft.tradition}
              onChange={(v) => patch('tradition', v as CraftTradition)}
              options={TRADITION_OPTIONS}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Origin"
              value={draft.origin}
              onChange={(v) => patch('origin', v)}
              placeholder="e.g. Kutch, Gujarat"
            />
            <Field
              label="Artisan"
              value={draft.artisan}
              onChange={(v) => patch('artisan', v)}
              placeholder="Maker's name"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field
              label={`Price (${formatINR(toMinor(draft.priceRupees))})`}
              value={String(draft.priceRupees || '')}
              onChange={(v) => patch('priceRupees', Number(v) || 0)}
              placeholder="₹"
            />
            <Field
              label="MRP (strike)"
              value={String(draft.mrpRupees || '')}
              onChange={(v) => patch('mrpRupees', Number(v) || 0)}
              placeholder="optional"
            />
            <Field
              label="Stock"
              value={String(draft.stock)}
              onChange={(v) => patch('stock', Number(v) || 0)}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input h-24"
              value={draft.description}
              onChange={(e) => patch('description', e.target.value)}
            />
          </div>
          <div>
            <label className="label">The story behind the craft</label>
            <textarea
              className="input h-20"
              value={draft.story}
              onChange={(e) => patch('story', e.target.value)}
            />
          </div>
          <Field
            label="Tags (comma separated)"
            value={draft.tags}
            onChange={(v) => patch('tags', v)}
            placeholder="handmade, GI-tagged, giftable"
          />

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              className="btn-primary"
              disabled={!canPublish}
              onClick={() => publish(false)}
            >
              Publish
            </button>
            <button
              className="btn-secondary"
              disabled={!canPublish}
              onClick={() => publish(true)}
            >
              Save draft
            </button>
            <button className="btn-ghost" onClick={() => setDraft(EMPTY_DRAFT)}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: readonly T[]
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
