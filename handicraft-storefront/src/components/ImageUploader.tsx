import { useCallback, useRef, useState } from 'react'

type Props = {
  onImage: (dataUrl: string) => void
  currentImage?: string
}

const MAX_DIM = 1200

async function fileToResizedDataUrl(file: File): Promise<string> {
  const arrayBuf = await file.arrayBuffer()
  const blob = new Blob([arrayBuf], { type: file.type || 'image/jpeg' })
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.85)
}

export default function ImageUploader({ onImage, currentImage }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !files[0]) return
      const f = files[0]
      if (!f.type.startsWith('image/')) return
      const url = await fileToResizedDataUrl(f)
      onImage(url)
    },
    [onImage],
  )

  return (
    <div>
      <label className="label">Product photo</label>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${
          dragging
            ? 'border-terracotta-400 bg-terracotta-50'
            : 'border-bark/20 bg-white hover:bg-parchment/50'
        }`}
      >
        {currentImage ? (
          <div className="flex items-center gap-4">
            <img
              src={currentImage}
              alt="Uploaded preview"
              className="h-28 w-28 rounded-xl object-cover border border-bark/10"
            />
            <div className="text-sm text-bark/70">
              <div className="font-medium text-bark">Looks good.</div>
              <div>
                Click to replace, or drop a new photo. We’ll suggest a title,
                description and price.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="h-12 w-12 rounded-full bg-terracotta-50 text-terracotta-500 flex items-center justify-center text-xl font-semibold">
              +
            </div>
            <div className="mt-3 font-medium text-bark">
              Snap or drop a photo of your craft
            </div>
            <div className="text-xs text-bark/60 mt-1">
              JPG, PNG or HEIC · up to ~5 MB · we auto-resize to 1200px
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
    </div>
  )
}
