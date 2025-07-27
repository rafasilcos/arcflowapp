'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'O ArcFlow funciona para qualquer tipo de escritório AEC?',
      answer: 'Sim! O ArcFlow foi desenvolvido especificamente para escritórios de Arquitetura, Engenharia e Construção. Funciona para escritórios de todos os tamanhos, desde freelancers até grandes empresas multidisciplinares.'
    },
    {
      question: 'Como é feita a migração dos dados do sistema atual?',
      answer: 'Nossa equipe técnica faz toda a migração sem custo adicional. Importamos projetos, clientes, colaboradores e histórico financeiro. O processo leva 2-3 dias úteis e você continua trabalhando normalmente.'
    },
    {
      question: 'Preciso de treinamento para usar o sistema?',
      answer: 'Oferecemos treinamento completo para toda sua equipe, incluído em todos os planos. São 4 horas de capacitação online + materiais de apoio + suporte especializado nos primeiros 30 dias.'
    },
    {
      question: 'O sistema funciona offline?',
      answer: 'O ArcFlow funciona 100% online para garantir sincronização em tempo real entre toda a equipe. Porém, você pode exportar relatórios e documentos para trabalhar offline quando necessário.'
    },
    {
      question: 'Como funciona a integração com outros softwares?',
      answer: 'Temos integrações nativas com AutoCAD, Revit, Google Workspace, Office 365, WhatsApp Business e principais bancos. Para outras integrações, oferecemos API robusta e webhooks.'
    },
    {
      question: 'Os dados ficam seguros na nuvem?',
      answer: 'Sim! Usamos criptografia militar (AES-256), backup automático diário, servidores no Brasil e certificação ISO 27001. Seus dados ficam mais seguros na nuvem do que no seu computador.'
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, você pode cancelar a qualquer momento sem multa ou taxa. O acesso continua até o fim do período pago e você recebe todos os seus dados para download.'
    },
    {
      question: 'Quanto tempo leva para ver resultados?',
      answer: 'A maioria dos escritórios vê os primeiros resultados em 30 dias. Melhoria na organização é imediata, aumento de produtividade em 30-60 dias e aumento de margem em 60-90 dias.'
    },
    {
      question: 'Como o ArcFlow garante a segurança dos meus dados?',
      answer: 'Utilizamos criptografia de ponta a ponta (AES-256), servidores no Brasil, backups diários automáticos, autenticação multifator e compliance total com LGPD e PCI DSS.'
    },
    {
      question: 'O que diferencia a IA do ArcFlow das demais?',
      answer: 'Nossa IA é treinada exclusivamente em projetos AEC reais, oferece análise de produtividade, detecção de inconsistências técnicas e sugestões de otimização baseadas em normas NBR 13532.'
    },
    {
      question: 'Qual o tipo de suporte oferecido?',
      answer: 'Oferecemos suporte especializado por chat, e-mail e WhatsApp, além de consultoria personalizada para implantação e treinamento contínuo.'
    },
    {
      question: 'O ArcFlow é realmente especializado em AEC?',
      answer: 'Sim! É o único SaaS brasileiro 100% focado em AEC, com workflows, relatórios e integrações pensados para a realidade de escritórios de arquitetura, engenharia e construção.'
    }
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Perguntas frequentes
          </motion.h2>
          <motion.p
            className="text-xl text-slate-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Tire suas dúvidas sobre o ArcFlow
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-slate-800 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <motion.div
                  className="px-6 pb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 mb-6">
            Ainda tem dúvidas?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Falar com especialista
            </button>
            <button className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Ver demonstração
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
} 