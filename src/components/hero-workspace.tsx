'use client'
import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowLeft, ScanLine, ShieldCheck, Image as ImageIcon } from 'lucide-react'
import { AnimatedCutout } from '@/components/animated-cutout'

const App = dynamic(() => import('@/App'), { ssr: false })

export function HeroWorkspace() {
 const [open,setOpen]=useState(false)
 const reduced=useReducedMotion()
 const heading=useRef<HTMLHeadingElement>(null)
 const startButton=useRef<HTMLButtonElement>(null)
 const transition={duration:reduced?0:.55,ease:[.22,1,.36,1] as const}
 return <MotionConfig reducedMotion="user"><section className={`hero-stage ${open?'workspace-open':''}`} aria-label="Background removal studio">
  <motion.div aria-hidden="true" className="horizon" initial={{opacity:.65,scale:.94}} animate={{opacity:open?.35:1,scale:1}} transition={{duration:reduced?0:1.5}}><div/></motion.div>
  <AnimatePresence mode="wait" initial={false}>
   {!open?<motion.div key="intro" className="hero-intro" exit={{opacity:0,y:reduced?0:-24,filter:reduced?'none':'blur(8px)'}} transition={transition}>
    <motion.div className="hero-assurance" initial={{y:12}} animate={{y:0}} transition={transition}><span><ShieldCheck size={15}/> Private by design</span><span>Your images never leave your device</span></motion.div>
    <motion.h1 initial={{y:22}} animate={{y:0}} transition={{...transition,delay:.08}}>Keep the subject.<br/>Lose the <span className="inline-mark" aria-hidden="true"><ScanLine/></span> background.</motion.h1>
    <motion.p initial={{y:18}} animate={{y:0}} transition={{...transition,delay:.16}}>Make space for your next idea. Remove image backgrounds<br className="desktop-break"/> with on-device AI, and take your creativity anywhere.</motion.p>
    <motion.button ref={startButton} className="hero-cta" onClick={()=>setOpen(true)} whileHover={reduced?undefined:{y:-3,scale:1.025}} whileTap={reduced?undefined:{scale:.97}} initial={{y:16}} animate={{y:0}} transition={{...transition,delay:.22}}>Get started <ArrowRight size={23}/></motion.button>
    <motion.div className="hero-preview" initial={{y:35}} animate={{y:0}} transition={{...transition,delay:.3}}>
     <div className="preview-topbar"><span><ImageIcon size={15}/> Your creative workspace</span><span>Powered by RMBG-1.4</span></div>
     <div className="preview-composition"><AnimatedCutout/><div className="preview-copy"><ScanLine size={27}/><h2>All the focus.<br/>None of the clutter.</h2><p>A photo in.<br/>A transparent PNG out.<br/>Entirely on your device.</p><span><ShieldCheck size={14}/> No upload. No account.</span></div></div>
    </motion.div>
   </motion.div>:<motion.div key="workspace" className="workspace-reveal" initial={{opacity:0,y:reduced?0:28,filter:reduced?'none':'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:reduced?0:16}} transition={transition} onAnimationComplete={()=>heading.current?.focus({preventScroll:true})}>
    <div className="workspace-heading"><div><h1 ref={heading} tabIndex={-1}>Make room for your subject.</h1><p>Choose your image. We’ll take care of the background.</p></div><button onClick={()=>{setOpen(false);setTimeout(()=>startButton.current?.focus({preventScroll:true}),reduced?0:650)}}><ArrowLeft size={16}/> Back</button></div>
    <App/>
   </motion.div>}
  </AnimatePresence>
 </section></MotionConfig>
}
