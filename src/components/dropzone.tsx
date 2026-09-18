'use client'
import { useRef, useState } from 'react'
import { ArrowUpRight, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function Dropzone({ onFile, disabled }: { onFile: (file: File) => void; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [over,setOver] = useState(false)
  return <div className={`dropzone ${over ? 'drag-over' : ''}`}
    onDragOver={e => { e.preventDefault(); if(!disabled) setOver(true) }}
    onDragLeave={e => { if(!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false) }}
    onDrop={e => { e.preventDefault(); setOver(false); const file=e.dataTransfer.files[0]; if(file && !disabled) onFile(file) }}>
    <div className="upload-symbol"><ImagePlus size={30} strokeWidth={1.5}/></div>
    <h2>Your next great image<br/>starts here.</h2>
    <p>Drop a photo. Keep what matters.</p>
    <input ref={input} id="image-upload" aria-label="Choose an image" type="file" accept="image/png,image/jpeg,image/webp" hidden disabled={disabled}
      onChange={e => { const file=e.target.files?.[0]; if(file) onFile(file); e.target.value='' }}/>
    <Button size="lg" disabled={disabled} onClick={() => input.current?.click()}>Choose an image <ArrowUpRight size={18}/></Button>
    <span className="file-hint">or drag and drop it here</span>
    <small>JPG, PNG or WebP · up to 20 MB</small>
  </div>
}
