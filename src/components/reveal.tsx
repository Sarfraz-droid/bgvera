'use client'
import { motion, useReducedMotion } from 'motion/react'
export function Reveal({children,className}:{children:React.ReactNode;className?:string}) {
 const reduced=useReducedMotion()
 return <motion.div className={className} initial={{y:0}} whileInView={{y:reduced?0:[16,0]}} viewport={{once:true,amount:.15}} transition={{duration:reduced?0:.65,ease:[.22,1,.36,1]}}>{children}</motion.div>
}
