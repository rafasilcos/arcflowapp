'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  BarChart3, 
  Building, 
  DollarSign, 
  Users 
} from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: FileText,
      title: 'Briefing Estruturado',
      description: 'Capture necessidades com precisão através de questionários inteligentes por tipologia de projeto.',
      tag: 'Único no mercado'
    },
    {
      icon: Calendar,
      title: 'Agenda Integrada',
      description: 'Sincronize equipe e projetos com otimização automática de rotas e integração completa.',
      tag: 'Diferencial'
    },
    {
      icon: BarChart3,
      title: 'Análise de Produtividade',
      description: 'Identifique gargalos e otimize processos com dashboard "Onde vai seu dinheiro".',
      tag: 'Exclusivo'
    },
    {
      icon: Building,
      title: 'Gestão de Projetos',
      description: 'Controle completo do workflow com metodologia AEC especializada e timesheet integrado.',
      tag: 'Completo'
    },
    {
      icon: DollarSign,
      title: 'Financeiro Inteligente',
      description: 'Maximize rentabilidade com controle separado por projeto e análise de margem em tempo real.',
      tag: 'Avançado'
    },
    {
      icon: Users,
      title: 'Portal do Cliente',
      description: 'Transparência total com acompanhamento online, aprovações digitais e comunicação integrada.',
      tag: 'Premium'
    }
  ]

  return (
    <section id="funcionalidades" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Funcionalidades que fazem a diferença
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold ml-2 animate-pulse border border-blue-200">Especialização AEC</span>
          </motion.h2>
          <motion.p
            className="text-xl text-slate-500 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            O ArcFlow integra gestão de projetos, financeiro, produtividade, clientes e equipe em um só lugar, com inteligência artificial, automação total e segurança enterprise. Pronto para crescer com seu escritório.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              
              {/* Tag */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 mb-6 animate-bounce group-hover:animate-none">
                {feature.tag}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors">
                <feature.icon className="h-6 w-6 text-slate-600" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                {feature.title}
                {feature.title === 'Briefing Estruturado' && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold animate-pulse">Exclusivo</span>
                )}
              </h3>
              
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>

            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 mb-8 text-lg">
            Pronto para transformar seu escritório? Veja tudo que o ArcFlow pode fazer por você.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg animate-pulse">
            Ver demonstração
          </button>
        </motion.div>

      </div>
    </section>
  )
} 