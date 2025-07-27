'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSessionManager } from '@/hooks/useSessionManager'

interface SessionAlertProps {
  onExtendSession?: () => void
  onLogout?: () => void
}

export function SessionAlert({ onExtendSession, onLogout }: SessionAlertProps = {}) {
  // 🚨 TEMPORARIAMENTE DESABILITADO para evitar problemas de rate limiting
  // TODO: Reabilitar após resolver problemas de autenticação
  return null
} 