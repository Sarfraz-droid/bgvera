'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RemovalResult } from '@/lib/rmbg'
export type Stage = {status:'idle'}|{status:'downloading-model';percent:number}|{status:'processing'}|{status:'done';result:RemovalResult;sourceUrl:string;fileName:string}|{status:'error';message:string}
export function useBackgroundRemoval() {
 const [stage,setStage]=useState<Stage>({status:'idle'})
 const run=useRef(0), urls=useRef<string[]>([])
 const clear=useCallback(()=>{urls.current.forEach(url=>URL.revokeObjectURL(url));urls.current=[]},[])
 useEffect(()=>()=>{run.current++;clear()},[clear])
 const reset=useCallback(()=>{run.current++;clear();setStage({status:'idle'})},[clear])
 const process=useCallback(async(file:File)=>{
  const id=++run.current;clear()
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)){setStage({status:'error',message:'Choose a JPG, PNG, or WebP image.'});return}
  if(file.size>20*1024*1024 || file.size===0){setStage({status:'error',message:'Choose an image smaller than 20 MB that is not empty.'});return}
  const sourceUrl=URL.createObjectURL(file);urls.current.push(sourceUrl)
  setStage({status:'downloading-model',percent:0})
  try {
   const {removeBackground}=await import('@/lib/rmbg')
   if(id!==run.current)return
   const result=await removeBackground(file,({loaded,total})=>{if(id===run.current)setStage({status:'downloading-model',percent:total?Math.min(100,Math.round(loaded/total*100)):0})},()=>{if(id===run.current)setStage({status:'processing'})})
   if(id!==run.current){URL.revokeObjectURL(result.url);return}
   urls.current.push(result.url);setStage({status:'done',result,sourceUrl,fileName:file.name})
  }catch{if(id===run.current)setStage({status:'error',message:'We could not process this image. Check your connection for the first model download, then try a smaller image or a different browser.'})}
 },[clear])
 return {stage,process,reset}
}
