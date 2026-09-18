'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { Download, RotateCcw, ShieldCheck, TriangleAlert, ArrowUpRight } from 'lucide-react'
import { CompareSlider } from '@/components/compare-slider'
import { Dropzone } from '@/components/dropzone'
import { StatusAnimation } from '@/components/status-animation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useBackgroundRemoval } from '@/hooks/use-background-removal'

export default function App() {
 const {stage,process,reset}=useBackgroundRemoval()
 const reduced=useReducedMotion()
 const [background,setBackground]=useState('transparent')
 const [sampleError,setSampleError]=useState('')
 const [sampleLoading,setSampleLoading]=useState(false)
 const busy=stage.status==='processing'||stage.status==='downloading-model'
 async function sample() {
  setSampleLoading(true);setSampleError('')
  try {const res=await fetch('/demo/tiger.jpg');if(!res.ok) throw new Error(); await process(new File([await res.blob()],'tiger.jpg',{type:'image/jpeg'}))}
  catch {setSampleError('The sample could not load. Please choose an image from your device.')}
  finally {setSampleLoading(false)}
 }
 return <motion.section key={stage.status} initial={{opacity:.5,y:reduced?0:12}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.35}} id="studio" className={`studio ${stage.status==='done'?'studio-result':''}`} aria-label="Image background remover">
  {stage.status==='idle' && <>
   <div className="sample-preview"><Image src="/demo/tiger.jpg" alt="Tiger standing in a green forest, ready to try background removal" fill priority sizes="(max-width: 760px) 100vw, 52vw"/>
    <div className="sample-caption"><span>A little less background.<br/><strong>A lot more subject.</strong></span><button onClick={sample} disabled={sampleLoading} aria-label="Try the tiger sample">{sampleLoading?'Loading…':'Try this photo'} <ArrowUpRight size={16}/></button></div>
   </div>
   <div className="upload-panel"><Dropzone onFile={process} disabled={sampleLoading}/><p className="privacy-note"><ShieldCheck size={15}/> Your photo stays on your device.</p>{sampleError&&<p role="alert">{sampleError}</p>}</div>
  </>}
  {busy && <div className="process-panel" role="status" aria-live="polite"><StatusAnimation/><h2>{stage.status==='downloading-model'?'Preparing your workspace':'Finding the edges. Keeping the detail.'}</h2><p>{stage.status==='downloading-model'?'The AI model downloads on first use. Your image stays here.':'Removing the background on your device. This may take a moment.'}</p>{stage.status==='downloading-model'&&<div className="download-progress"><Progress value={stage.percent}/><span>{stage.percent}% downloaded</span></div>}<Button variant="outline" onClick={reset}>Cancel</Button></div>}
  {stage.status==='error'&&<div className="process-panel" role="alert"><TriangleAlert size={36}/><h2>Let’s try that again.</h2><p>{stage.message}</p><Button onClick={reset}>Choose another image</Button></div>}
  {stage.status==='done'&&<>
   <div className="result-preview"><CompareSlider key={stage.sourceUrl} beforeUrl={stage.sourceUrl} afterUrl={stage.result.url} alt={stage.fileName} background={background}/></div>
   <div className="result-panel"><div className="success-heading"><StatusAnimation done/><span>Ready for your next idea</span></div><h2>Just the<br/>good part.</h2><p className="result-filename" title={stage.fileName}>{stage.fileName}</p><p>{stage.result.width} × {stage.result.height} px · PNG</p><fieldset className="swatches"><legend>Preview background</legend>{[['transparent','Transparent'],['#ffffff','White'],['#dfe7de','Sage'],['#24272b','Charcoal']].map(([value,label])=><button key={value} className={value==='transparent'?'checkerboard':''} style={{backgroundColor:value}} aria-label={label} aria-pressed={background===value} onClick={()=>setBackground(value)}/>)}</fieldset><p className="preview-note">Preview only. Your download stays transparent.</p><Button size="lg" asChild><a href={stage.result.url} download={`${stage.fileName.replace(/\.[^.]+$/,'')||'image'}-no-bg.png`}><Download size={18}/> Download PNG</a></Button><Button variant="outline" onClick={()=>{reset();setBackground('transparent')}}><RotateCcw size={16}/> Start over</Button></div>
  </>}
 </motion.section>
}
