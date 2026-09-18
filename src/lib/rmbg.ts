import {
  AutoModel,
  AutoProcessor,
  env,
  RawImage,
  type PreTrainedModel,
  type Processor,
} from '@huggingface/transformers'

// Image data never leaves the device: only the model weights themselves are
// fetched from the Hugging Face CDN (once, then cached by the browser).
env.allowLocalModels = false
if (env.backends.onnx.wasm) env.backends.onnx.wasm.proxy = false

const MODEL_ID = 'briaai/RMBG-1.4'

export type Engine = 'webgpu' | 'wasm'

export interface ModelLoadProgress {
  file: string
  loaded: number
  total: number
}

export interface RemovalResult {
  /** Transparent-background PNG. */
  blob: Blob
  url: string
  width: number
  height: number
  engine: Engine
}

export function supportsWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

let modelPromise: Promise<{ model: PreTrainedModel; processor: Processor; engine: Engine }> | null = null

const PROCESSOR_CONFIG = {
  do_normalize: true,
  do_pad: false,
  do_rescale: true,
  do_resize: true,
  image_mean: [0.5, 0.5, 0.5],
  feature_extractor_type: 'ImageFeatureExtractor',
  image_std: [1, 1, 1],
  resample: 2,
  rescale_factor: 1 / 255,
  size: { width: 1024, height: 1024 },
}

async function loadModel(
  onProgress?: (progress: ModelLoadProgress) => void,
): Promise<{ model: PreTrainedModel; processor: Processor; engine: Engine }> {
  const files = new Map<string, { loaded: number; total: number }>()
  const progress_callback = (event: Record<string, unknown>) => {
    if (event.status !== 'progress' || !onProgress) return
    const file = String(event.file ?? 'model')
    const loaded = Number(event.loaded ?? 0)
    const total = Number(event.total ?? 0) || 1
    files.set(file, { loaded, total })
    let sumLoaded = 0
    let sumTotal = 0
    for (const entry of files.values()) {
      sumLoaded += entry.loaded
      sumTotal += entry.total
    }
    onProgress({ file, loaded: sumLoaded, total: sumTotal })
  }

  async function attempt(device: Engine) {
    const model = await AutoModel.from_pretrained(MODEL_ID, {
      config: { model_type: 'custom' } as never,
      device,
      dtype: 'fp32',
      progress_callback,
    })
    const processor = await AutoProcessor.from_pretrained(MODEL_ID, {
      config: PROCESSOR_CONFIG as never,
    })
    return { model, processor, engine: device }
  }

  const preferred: Engine = supportsWebGPU() ? 'webgpu' : 'wasm'
  try {
    return await attempt(preferred)
  } catch (err) {
    if (preferred === 'webgpu') {
      return await attempt('wasm')
    }
    throw err
  }
}

export function getModel(onProgress?: (progress: ModelLoadProgress) => void) {
  if (!modelPromise) {
    modelPromise = loadModel(onProgress).catch((err) => {
      modelPromise = null
      throw err
    })
  }
  return modelPromise
}

async function runRemoval(
  file: File | Blob,
  onProgress?: (progress: ModelLoadProgress) => void,
  onReady?: () => void,
): Promise<RemovalResult> {
  const { model, processor, engine } = await getModel(onProgress)
  onReady?.()

  const dataUrl = await blobToDataURL(file)
  const image = await RawImage.fromURL(dataUrl)

  const { pixel_values } = await processor(image)
  const { output } = await model({ input: pixel_values })

  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
    image.width,
    image.height,
  )

  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(image.toCanvas() as unknown as CanvasImageSource, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const maskData = mask.data
  for (let i = 0; i < mask.width * mask.height; i++) {
    imageData.data[4 * i + 3] = maskData[i]
  }
  ctx.putImageData(imageData, 0, 0)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png')
  })

  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    engine,
  }
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ONNX sessions run serially, including when a user cancels a stale UI job.
let queue: Promise<unknown> = Promise.resolve()
export function removeBackground(file: File | Blob, onProgress?: (progress: ModelLoadProgress) => void, onReady?: () => void): Promise<RemovalResult> {
  const job = queue.then(() => runRemoval(file, onProgress, onReady))
  queue = job.catch(() => undefined)
  return job
}
