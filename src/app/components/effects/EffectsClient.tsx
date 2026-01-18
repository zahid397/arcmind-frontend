'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// ✅ Dynamic imports with loading fallbacks and error boundaries
const BackgroundOrbs = dynamic(() => import('./BackgroundOrbs'), {
ssr: false,
loading: () => null,
})

const NeonGrid = dynamic(() => import('./NeonGrid'), {
ssr: false,
loading: () => null,
})

const GradientMesh = dynamic(() => import('./GradientMesh'), {
ssr: false,
loading: () => null,
})

const ScanLines = dynamic(() => import('./ScanLines'), {
ssr: false,
loading: () => null,
})

const ParticleCursor = dynamic(() => import('./ParticleCursor'), {
ssr: false,
loading: () => null,
})

interface EffectsClientProps {
/**

Control which effects are enabled

@default { backgroundOrbs: true, neonGrid: true, gradientMesh: true, scanLines: true, particleCursor: false }
*/
enabled?: {
backgroundOrbs?: boolean
neonGrid?: boolean
gradientMesh?: boolean
scanLines?: boolean
particleCursor?: boolean
}


/**

Intensity level for effects

@default 'medium'
*/
intensity?: 'low' | 'medium' | 'high'


/**

Additional className
*/
className?: string
}


export default function EffectsClient({
enabled = {
backgroundOrbs: true,
neonGrid: true,
gradientMesh: true,
scanLines: true,
particleCursor: false, // Disable by default for performance
},
intensity = 'medium',
className,
}: EffectsClientProps) {
return (
<div className={className}>
<Suspense fallback={null}>
{enabled.backgroundOrbs && (
<BackgroundOrbs intensity={intensity} />
)}

{enabled.neonGrid && <NeonGrid />}  
      
    {enabled.gradientMesh && <GradientMesh />}  
      
    {enabled.scanLines && <ScanLines />}  
      
    {enabled.particleCursor && <ParticleCursor />}  
  </Suspense>  
</div>

)
}
