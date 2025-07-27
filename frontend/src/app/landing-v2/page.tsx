"use client"

import { motion } from "framer-motion";
import { Check, Shield, Zap, Users, BarChart3, FileText, Building, DollarSign, Calendar, Lock, Star, ArrowRight, Cpu, ClipboardList, Workflow, PieChart, HardHat, UserCheck, Layers } from "lucide-react";
import Image from "next/image";

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-50 to-white pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 mb-6 animate-pulse">REVOLUÇÃO PARA ESCRITÓRIOS AEC</span>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transforme seu escritório com a <span className="text-blue-600">primeira plataforma all-in-one</span> especializada em AEC
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 mb-8 max-w-xl">
                Chega de perder tempo e dinheiro com sistemas genéricos. O ArcFlow integra projeto, obra, administração e gestão financeira com IA avançada — tudo em um só lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                <a href="/onboarding/perfil" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg">Começar agora</a>
                <a href="#resultados" className="bg-white border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-50 transition-colors">Ver resultados</a>
              </div>
              <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start">
                <Badge icon={<Star className="w-5 h-5 text-yellow-400" />} text="95% Satisfação" />
                <Badge icon={<BarChart3 className="w-5 h-5 text-blue-500" />} text="+40% Produtividade" />
                <Badge icon={<DollarSign className="w-5 h-5 text-green-500" />} text="+35% Margem" />
                <Badge icon={<Users className="w-5 h-5 text-slate-500" />} text="500+ Escritórios" />
              </div>
            </motion.div>
          </div>
          <div className="flex-1 flex justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white max-w-xl">
              <Image src="/screenshot-dashboard.png" alt="Dashboard ArcFlow" width={600} height={400} className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* RESULTADOS IMEDIATOS */}
      <section className="py-24 bg-white" id="resultados">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Aumente sua rentabilidade em até 300%</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Escritórios que usam o ArcFlow reportam:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            <ImpactCard value="-40%" label="Tempo de briefing" desc="com nosso sistema inteligente de 230 perguntas" />
            <ImpactCard value="-30%" label="Retrabalho" desc="graças à compatibilização automática entre disciplinas" />
            <ImpactCard value="-25%" label="Custos operacionais" desc="com automação de tarefas administrativas" />
            <ImpactCard value="+35%" label="Aprovação de projetos" desc="na primeira apresentação" />
          </div>
          <div className="max-w-2xl mx-auto mt-12">
            <TestimonialCard content="O ArcFlow transformou completamente nosso escritório. Reduzimos o tempo de briefing pela metade e aumentamos nossa margem de lucro em 40% no primeiro ano." author="Arq. Renata Mendes" company="Studio RM Arquitetura" />
          </div>
        </div>
      </section>

      {/* IA ESPECIALIZADA */}
      <SectionCard icon={Cpu} title="Inteligência Artificial que realmente entende arquitetura" badge="IA AEC de verdade">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>Analisa automaticamente seus briefings e detecta inconsistências antes que virem problemas</li>
          <li>Verifica a viabilidade construtiva com base em dados reais do mercado brasileiro</li>
          <li>Sugere otimizações técnicas específicas para cada tipologia de projeto</li>
          <li>Analisa zoneamento e restrições integrado a dados municipais</li>
        </ul>
      </SectionCard>

      {/* BRIEFING ULTRA-DETALHADO */}
      <SectionCard icon={ClipboardList} title="Briefing ultra-detalhado que impressiona seus clientes" badge="10x mais completo">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>230 perguntas adaptativas, 10x mais completo que qualquer concorrente</li>
          <li>Adapta-se automaticamente à tipologia do projeto</li>
          <li>Gera programa de necessidades detalhado e profissional em segundos</li>
          <li>Identifica inconsistências e conflitos antes mesmo de iniciar o projeto</li>
          <li>Estima custos e prazos realistas baseados em dados do mercado brasileiro</li>
        </ul>
      </SectionCard>

      {/* WORKFLOWS NORMATIZADOS */}
      <SectionCard icon={Workflow} title="Workflows baseados em normas técnicas brasileiras" badge="NBR 13532 + Ágil">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>NBR 13532 (Arquitetura) integrada nativamente em cada etapa</li>
          <li>Metodologia Ágil adaptada para AEC para maior eficiência e controle</li>
          <li>Workflows personalizáveis para cada tipo de escritório</li>
          <li>Automação de marcos e aprovações para eliminar atrasos e esquecimentos</li>
        </ul>
      </SectionCard>

      {/* ANÁLISE DE PRODUTIVIDADE */}
      <SectionCard icon={PieChart} title="Descubra onde vai seu dinheiro com análise exclusiva" badge="Benchmark AEC">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>Revela quais etapas consomem mais recursos em cada tipo de projeto</li>
          <li>Mostra quais colaboradores são mais eficientes em cada disciplina</li>
          <li>Compara seu escritório com benchmarks do mercado AEC</li>
          <li>Aponta suas maiores oportunidades de otimização de custos</li>
        </ul>
      </SectionCard>

      {/* ADMINISTRAÇÃO DE OBRA */}
      <SectionCard icon={HardHat} title="Módulo de administração de obra revolucionário" badge="Controle total">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>Acompanhe todos os gastos organizados por categorias e fornecedores</li>
          <li>Controle medições e cronogramas com atualizações em tempo real</li>
          <li>Gere relatórios automáticos para clientes com sua identidade visual</li>
          <li>Calcule automaticamente sua taxa de administração (15-20%)</li>
        </ul>
      </SectionCard>

      {/* SEGURANÇA ENTERPRISE */}
      <SectionCard icon={Shield} title="Segurança enterprise para seus dados mais valiosos" badge="Compliance total">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>Autenticação multi-fator para acesso seguro de qualquer lugar</li>
          <li>Criptografia avançada para dados em trânsito e em repouso</li>
          <li>Controle granular de permissões por usuário, projeto e documento</li>
          <li>Conformidade total com LGPD e melhores práticas de segurança</li>
        </ul>
      </SectionCard>

      {/* INTERFACE ADAPTATIVA */}
      <SectionCard icon={UserCheck} title="Interface adaptativa para seu tipo de escritório" badge="Personalização total">
        <ul className="list-disc pl-6 text-lg text-slate-600 space-y-2">
          <li>Arquitetura Residencial: foco em clientes PF, briefing residencial e aprovações municipais</li>
          <li>Engenharia Estrutural: integração com arquitetos, controle de revisões e memórias de cálculo</li>
          <li>Construtoras com Projetos: gestão completa de obras, fornecedores e equipamentos</li>
          <li>E muito mais: o ArcFlow se adapta ao seu perfil e necessidades</li>
        </ul>
      </SectionCard>

      {/* CTA FINAL */}
      <section className="py-24 bg-blue-50" id="cta-final">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 className="text-4xl lg:text-5xl font-bold mb-6 flex items-center justify-center gap-3" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            O ArcFlow faz tudo isso e muito mais para o seu escritório
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 animate-pulse">Garanta sua transformação</span>
          </motion.h2>
          <motion.p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            Teste grátis por 14 dias, sem cartão de crédito. Resultados comprovados em até 90 dias ou seu dinheiro de volta.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="/onboarding/perfil" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg">Começar agora</a>
            <a href="#resultados" className="text-blue-600 hover:underline font-medium text-lg">Ver resultados</a>
            <a href="#" className="text-slate-600 hover:text-slate-800 font-medium transition-colors text-lg">Falar com especialista</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ icon, text }: any) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 gap-2">{icon}{text}</span>
  );
}

function ImpactCard({ value, label, desc }: any) {
  return (
    <motion.div className="bg-blue-50 border border-blue-100 rounded-xl p-10 flex flex-col items-center justify-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
      <div className="text-4xl font-bold text-blue-700 mb-2">{value}</div>
      <div className="text-lg text-slate-600 font-semibold mb-1">{label}</div>
      <div className="text-slate-500 text-sm">{desc}</div>
    </motion.div>
  );
}

function TestimonialCard({ content, author, company }: any) {
  return (
    <motion.div className="bg-white border border-slate-200 rounded-lg p-8 shadow-md" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
      <div className="text-slate-600 leading-relaxed mb-8">"{content}"</div>
      <div className="font-medium text-slate-800">{author}</div>
      <div className="text-sm text-slate-500">{company}</div>
    </motion.div>
  );
}

function SectionCard({ icon: Icon, title, badge, children }: any) {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-1/4 mb-8 md:mb-0">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4"><Icon className="h-8 w-8 text-blue-600" /></div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 mb-2">{badge}</span>
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
          {children}
        </div>
      </div>
    </section>
  );
} 