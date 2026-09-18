'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Check, ScanLine } from 'lucide-react'
const Lottie = dynamic(() => import('lottie-react').then(module => module.Lottie), { ssr:false })
// Original geometric Lottie: a scanning frame resolves into a completion mark.
function animation(done:boolean) {
 const path = done ? {i:[[0,0],[0,0],[0,0]],o:[[0,0],[0,0],[0,0]],v:[[-18,0],[-4,14],[22,-15]],c:false} : {i:[[0,0],[0,0],[0,0],[0,0]],o:[[0,0],[0,0],[0,0],[0,0]],v:[[-22,-22],[22,-22],[22,22],[-22,22]],c:true}
 return {v:'5.7.4',fr:30,ip:0,op:60,w:100,h:100,nm:done?'Complete':'Processing',ddd:0,assets:[],layers:[{ddd:0,ind:1,ty:4,nm:'Frame',sr:1,ks:{o:{a:0,k:100},r:done?{a:0,k:0}:{a:1,k:[{t:0,s:[0],e:[180],o:{x:.4,y:0},i:{x:.6,y:1}},{t:60,s:[180]}]},p:{a:0,k:[50,50,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},ao:0,shapes:[{ty:'sh',ks:{a:0,k:path}},{ty:'st',c:{a:0,k:[1,.53,.37,1]},o:{a:0,k:100},w:{a:0,k:3},lc:2,lj:2},{ty:'tm',s:{a:0,k:0},e:{a:1,k:[{t:0,s:[0],e:[100],o:{x:.2,y:0},i:{x:.6,y:1}},{t:30,s:[100]}]},o:{a:0,k:0},m:1}],ip:0,op:60,st:0,bm:0}]}
}
const processing=animation(false), complete=animation(true)
export function StatusAnimation({done=false}:{done?:boolean}) {
 const [reduced,setReduced]=useState(true)
 useEffect(()=> {const query=matchMedia('(prefers-reduced-motion: reduce)'); const update=()=>setReduced(query.matches); update(); query.addEventListener('change',update); return ()=>query.removeEventListener('change',update)},[])
 return <div aria-hidden="true" className={`status-animation ${done?'complete':''}`}>{reduced ? (done?<Check/>:<ScanLine/>) : <Lottie src={done?complete:processing} autoplay loop={!done}/>}</div>
}
