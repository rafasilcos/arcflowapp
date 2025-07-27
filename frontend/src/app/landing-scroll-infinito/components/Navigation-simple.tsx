'use client'

interface NavigationProps {
  currentSection?: number
  scrollProgress?: number
  onSectionClick?: (index: number) => void
}

const sections = ['Hero', 'About', 'Features', 'Results', 'Testimonials', 'Pricing', 'FAQ', 'CTA']

export function Navigation({ currentSection = 0, scrollProgress = 0, onSectionClick }: NavigationProps) {
  return (
    <nav className="fixed top-8 right-8 z-50">
      <div className="flex flex-col space-y-2">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => onSectionClick?.(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSection 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/60'
            }`}
            title={section}
          />
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 w-1 h-20 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
    </nav>
  )
}