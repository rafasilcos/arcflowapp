'use client'

interface BackgroundGradientProps {
  currentSection?: string
  transitionProgress?: number
}

const sectionGradients = {
  hero: 'from-slate-900 via-blue-900 to-slate-900',
  about: 'from-blue-900 via-indigo-900 to-slate-900',
  features: 'from-indigo-900 via-purple-900 to-blue-900',
  results: 'from-purple-900 via-pink-900 to-indigo-900',
  testimonials: 'from-pink-900 via-rose-900 to-purple-900',
  pricing: 'from-rose-900 via-orange-900 to-pink-900',
  faq: 'from-orange-900 via-amber-900 to-rose-900',
  cta: 'from-amber-900 via-yellow-900 to-orange-900'
}

export function BackgroundGradient({ currentSection = 'hero', transitionProgress = 0 }: BackgroundGradientProps) {
  const gradientClass = sectionGradients[currentSection as keyof typeof sectionGradients] || sectionGradients.hero
  
  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br ${gradientClass} transition-all duration-1000 ease-in-out`}
      style={{ 
        opacity: 0.8 + (transitionProgress * 0.2),
        transform: `scale(${1 + transitionProgress * 0.05})`
      }}
    />
  )
}