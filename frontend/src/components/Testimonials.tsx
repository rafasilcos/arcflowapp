'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      content: "O ArcFlow transformou completamente nossa operação. Em 6 meses aumentamos nossa margem em 40% e eliminamos praticamente todo retrabalho. A análise de produtividade é revolucionária.",
      author: "Ana Beatriz Costa",
      role: "Arquiteta Sócia",
      company: "Costa & Associados"
    },
    {
      content: "Finalmente um sistema feito por quem entende arquitetura. O briefing estruturado sozinho já vale o investimento. Nossos clientes ficam impressionados com o profissionalismo.",
      author: "Carlos Eduardo Silva",
      role: "Engenheiro Civil", 
      company: "Silva Projetos"
    },
    {
      content: "Gestão financeira por projeto mudou nossa vida. Agora sabemos exatamente onde ganhamos e onde perdemos dinheiro. ROI foi 380% no primeiro ano.",
      author: "Marina Santos",
      role: "Diretora Executiva",
      company: "Santos Arquitetura"
    }
  ]

  return (
    <section id="depoimentos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Quem usa, recomenda
          </motion.h2>
          <motion.p
            className="text-xl text-slate-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Descubra como escritórios AEC estão transformando seus resultados
          </motion.p>
          {/* Logos de clientes */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-10 mb-4">
            <img src="/clientes/costa-associados.png" alt="Costa & Associados" className="h-8 grayscale hover:grayscale-0 transition" />
            <img src="/clientes/silva-projetos.png" alt="Silva Projetos" className="h-8 grayscale hover:grayscale-0 transition" />
            <img src="/clientes/santos-arquitetura.png" alt="Santos Arquitetura" className="h-8 grayscale hover:grayscale-0 transition" />
            {/* Adicione mais logos conforme necessário */}
          </div>
        </div>

        {/* Testimonials Grid - transformar em carrossel simples */}
        <div className="w-full overflow-x-auto flex gap-8 pb-4 snap-x snap-mandatory">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white border border-slate-200 rounded-lg p-8 min-w-[320px] max-w-[400px] snap-center shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-slate-300 mb-6" />

              {/* Content */}
              <blockquote className="text-slate-600 leading-relaxed mb-8">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-slate-600 font-medium text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-slate-800">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-slate-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">500+</div>
            <div className="text-slate-500">Escritórios confiam</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">R$ 2,8B</div>
            <div className="text-slate-500">Em projetos gerenciados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">95%</div>
            <div className="text-slate-500">NPS médio</div>
          </div>
        </motion.div>

      </div>
    </section>
  )
} 