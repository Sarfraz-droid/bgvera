import { Cpu, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Engine } from '@/lib/rmbg'

export function EngineBadge({ engine }: { engine: Engine }) {
  const isGpu = engine === 'webgpu'
  return (
    <Badge variant="secondary" className="gap-1.5 font-normal">
      {isGpu ? <Zap className="size-3.5" strokeWidth={2} /> : <Cpu className="size-3.5" strokeWidth={2} />}
      {isGpu ? 'WebGPU' : 'WASM'}
    </Badge>
  )
}
