'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface UseScrollAnimationProps {
  trigger: string
  timeline: () => gsap.core.Timeline
  dependencies?: any[]
}

export function useScrollAnimation({ trigger, timeline, dependencies = [] }: UseScrollAnimationProps) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Cleanup previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create new timeline
    timelineRef.current = timeline()

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, dependencies)

  return timelineRef.current
}