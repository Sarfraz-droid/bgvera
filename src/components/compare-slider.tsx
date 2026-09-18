'use client'

import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'

export function CompareSlider({ beforeUrl, afterUrl, alt, background = 'transparent' }: {
  beforeUrl: string; afterUrl: string; alt: string; background?: string
}) {
  const [position, setPosition] = useState(50)
  const pointer = useRef<number | null>(null)
  const update = (element: HTMLDivElement, x: number) => {
    const rect = element.getBoundingClientRect()
    if (rect.width) setPosition(Math.max(0, Math.min(100, (x - rect.left) / rect.width * 100)))
  }
  return <div className="comparison-wrap">
    <div className="comparison-labels"><span>Original</span><span>Background removed</span></div>
    <div className="comparison checkerboard" role="slider" tabIndex={0}
      aria-label="Before and after image comparison" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={Math.round(position)} aria-valuetext={`${Math.round(position)}% original image visible`}
      aria-describedby="comparison-help"
      onKeyDown={e => {
        const step = e.shiftKey ? 10 : 1
        const values: Record<string, number> = { ArrowLeft: position-step, ArrowDown: position-step, ArrowRight: position+step, ArrowUp: position+step, Home: 0, End: 100 }
        if (e.key in values) { e.preventDefault(); setPosition(Math.max(0, Math.min(100, values[e.key]))) }
      }}
      onPointerDown={e => { if (!e.isPrimary || e.button !== 0) return; pointer.current=e.pointerId; e.currentTarget.setPointerCapture(e.pointerId); update(e.currentTarget,e.clientX) }}
      onPointerMove={e => { if(pointer.current === e.pointerId) update(e.currentTarget,e.clientX) }}
      onPointerUp={e => { pointer.current=null; if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) }}
      onPointerCancel={() => { pointer.current=null }} onLostPointerCapture={() => { pointer.current=null }}>
      <div className="comparison-layer" style={{backgroundColor:background}}><img src={afterUrl} alt={`${alt}, background removed`} draggable={false} /></div>
      <div className="comparison-layer checkerboard" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><img src={beforeUrl} alt={`${alt}, original`} draggable={false} /></div>
      <div className="comparison-divider" style={{left:`${position}%`}}><span><MoveHorizontal size={20}/></span></div>
    </div>
    <p id="comparison-help" className="comparison-help">Drag to compare · Use arrow keys for precision</p>
  </div>
}
