'use client'

import { useEffect, useRef, RefObject } from 'react'
import { gsap } from 'gsap'

interface UseGSAPProps {
  scope?: RefObject<HTMLElement>
  dependencies?: any[]
}

export function useGSAP({ scope, dependencies = [] }: UseGSAPProps = {}) {
  const contextRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create GSAP context
    contextRef.current = gsap.context(() => {}, scope?.current || document)

    return () => {
      if (contextRef.current) {
        contextRef.current.revert()
      }
    }
  }, dependencies)

  return contextRef.current
}