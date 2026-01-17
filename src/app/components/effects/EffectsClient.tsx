'use client'

import dynamic from 'next/dynamic'

const BackgroundOrbs = dynamic(() => import('./BackgroundOrbs'), { ssr: false })
const NeonGrid = dynamic(() => import('./NeonGrid'), { ssr: false })
const GradientMesh = dynamic(() => import('./GradientMesh'), { ssr: false })
const ScanLines = dynamic(() => import('./ScanLines'), { ssr: false })
const ParticleCursor = dynamic(() => import('./ParticleCursor'), { ssr: false })

export default function EffectsClient() {
  return (
    <>
      <BackgroundOrbs />
      <NeonGrid />
      <GradientMesh />
      <ScanLines />
      <ParticleCursor />
    </>
  )
}
