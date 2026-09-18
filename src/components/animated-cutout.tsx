'use client'

import { motion } from 'motion/react'

// Both frames are local assets. This demo never imports or runs the ML pipeline.
export function AnimatedCutout() {
  return <div className="cutout-demo">
    <div className="cutout-canvas checkerboard">
      <img className="demo-local-image" src="/demo/tiger-transparent.png" alt="Tiger with its forest background removed" width={612} height={408} />
      <motion.div className="cutout-original local-photo-reveal" initial={false}>
        <img className="demo-local-image" src="/demo/tiger.jpg" alt="" width={612} height={408} />
      </motion.div>
      <div className="cutout-scan local-photo-scan" aria-hidden="true" />
    </div>
  </div>
}
