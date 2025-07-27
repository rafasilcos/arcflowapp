'use client'

import { motion } from 'framer-motion'

export function Footer() {
  const links = {
    produto: [
      { name: 'Funcionalidades', href: '#funcionalidades' },
      { name: 'Preços', href: '#precos' },
      { name: 'Cases', href: '#depoimentos' },
      { name: 'Demonstração', href: '#' }
    ],
    empresa: [
      { name: 'Sobre', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Carreiras', href: '#' },
      { name: 'Contato', href: '#' }
    ],
    suporte: [
      { name: 'Central de ajuda', href: '#' },
      { name: 'Documentação', href: '#' },
      { name: 'Status', href: '#' },
      { name: 'Falar conosco', href: '#' }
    ],
    legal: [
      { name: 'Privacidade', href: '#' },
      { name: 'Termos', href: '#' },
      { name: 'Cookies', href: '#' },
      { name: 'LGPD', href: '#' }
    ]
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-slate-800 mb-4">
                ArcFlow
              </div>
              <p className="text-slate-500 mb-6 max-w-sm">
                O sistema de gestão mais completo para escritórios de arquitetura e engenharia.
              </p>
              <div className="text-sm text-slate-400">
                © 2024 ArcFlow. Todos os direitos reservados.
              </div>
            </motion.div>
          </div>

          {/* Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-slate-800 mb-4">Produto</h3>
              <ul className="space-y-3">
                {links.produto.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-slate-500 hover:text-slate-700 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-slate-800 mb-4">Empresa</h3>
              <ul className="space-y-3">
                {links.empresa.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-slate-500 hover:text-slate-700 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-slate-800 mb-4">Suporte</h3>
              <ul className="space-y-3">
                {links.suporte.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-slate-500 hover:text-slate-700 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-slate-800 mb-4">Legal</h3>
              <ul className="space-y-3">
                {links.legal.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-slate-500 hover:text-slate-700 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-slate-400 mb-4 sm:mb-0">
            Feito com ❤️ para arquitetos e engenheiros
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.017 1.5c1.326 0 2.482 1.156 2.482 2.482v12.036c0 1.326-1.156 2.482-2.482 2.482H7.983c-1.326 0-2.482-1.156-2.482-2.482V3.982c0-1.326 1.156-2.482 2.482-2.482h4.034zm0 1.5H7.983c-.544 0-.982.438-.982.982v12.036c0 .544.438.982.982.982h4.034c.544 0 .982-.438.982-.982V3.982c0-.544-.438-.982-.982-.982zM10 5a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.5-2.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="sr-only">YouTube</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 6.48C2 4.56 3.56 3 5.48 3h9.04C16.44 3 18 4.56 18 6.48v7.04c0 1.92-1.56 3.48-3.48 3.48H5.48C3.56 17 2 15.44 2 13.52V6.48zM8 7.5v5l4-2.5-4-2.5z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </motion.div>

      </div>
    </footer>
  )
} 