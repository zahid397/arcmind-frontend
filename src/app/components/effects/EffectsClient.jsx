'use client'

import BackgroundOrbs from './BackgroundOrbs'
import GradientMesh from './GradientMesh'

export default function EffectsClient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <BackgroundOrbs />
      <GradientMesh />
    </div>
  )
}
