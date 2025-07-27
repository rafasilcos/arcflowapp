'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-slate-800">ArcFlow</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#funcionalidades" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Funcionalidades
            </a>
            <a href="#precos" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Preços
            </a>
            <a href="#cases" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Cases
            </a>
            <a href="#sobre" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Contato
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/auth/login" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Entrar
            </a>
            
            <Button 
              variant="primary" 
              size="md"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-medium rounded-lg transition-colors"
              asChild
            >
              <a href="/onboarding/perfil">Começar agora</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-800 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-slate-200 py-4"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#funcionalidades" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Funcionalidades
              </a>
              <a href="#precos" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Preços
              </a>
              <a href="#cases" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Cases
              </a>
              <a href="#sobre" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Sobre
              </a>
              <a href="#contato" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Contato
              </a>
              
              <div className="pt-4 border-t border-slate-200">
                <a href="/auth/login" className="text-slate-600 hover:text-slate-800 font-medium transition-colors block mb-3">
                  Entrar
                </a>
                <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <a href="/onboarding/perfil">Começar agora</a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
} 