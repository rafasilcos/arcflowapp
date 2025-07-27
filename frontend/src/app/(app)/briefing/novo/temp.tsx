'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function NovoBriefing() {
  const router = useRouter()
  
  return (
    <div>
      <h1>Novo Briefing</h1>
    </div>
  )
} 