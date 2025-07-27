/**
 * 📅 COMPONENTE DE CRONOGRAMA DE EXECUÇÃO
 * 
 * Gera automaticamente as fases do projeto na ordem profissional correta:
 * LV (Levantamento) → PN (Programa) → EV (Viabilidade) → EP (Preliminar) → 
 * AP (Anteprojeto) → PL (Legal) → PB (Básico) → PE (Executivo)
 * 
 * Inclui disciplinas ativas em cada fase conforme apropriado.
 */

import React from 'react';
import { BudgetData, CalculatedValues } from '../types/budget';

interface ExecutionScheduleProps {
  budgetData: BudgetData;
  activeDisciplines: string[];
  calculatedValues: CalculatedValues | null;
  classes: any;
}

// Definição oficial das fases conforme NBR 13532
const PROJECT_PHASES = [
  {
    id: 'LV',
    name: 'Levantamento de Dados',
    description: 'Coleta de informações e levantamentos técnicos',
    order: 1,
    duration: 2, // semanas
    disciplines: ['ARQUITETURA'],
    percentage: 5
  },
  {
    id: 'PN',
    name: 'Programa de Necessidades',
    description: 'Definição do programa arquitetônico',
    order: 2,
    duration: 1,
    disciplines: ['ARQUITETURA'],
    percentage: 5
  },
  {
    id: 'EV',
    name: 'Estudo de Viabilidade',
    description: 'Análise de viabilidade técnica e econômica',
    order: 3,
    duration: 3,
    disciplines: ['ARQUITETURA', 'ESTRUTURAL', 'APROVACAO_LEGAL'],
    percentage: 10
  },
  {
    id: 'EP',
    name: 'Estudo Preliminar',
    description: 'Concepção e representação do conjunto da edificação',
    order: 4,
    duration: 4,
    disciplines: ['ARQUITETURA', 'MODELAGEM_3D'],
    percentage: 15
  },
  {
    id: 'AP',
    name: 'Anteprojeto',
    description: 'Definição geral da edificação',
    order: 5,
    duration: 6,
    disciplines: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'MODELAGEM_3D'],
    percentage: 25
  },
  {
    id: 'PL',
    name: 'Projeto Legal',
    description: 'Representação das informações técnicas para aprovação',
    order: 6,
    duration: 4,
    disciplines: ['ARQUITETURA', 'APROVACAO_LEGAL'],
    percentage: 10
  },
  {
    id: 'PB',
    name: 'Projeto Básico',
    description: 'Definição clara da edificação e seus elementos',
    order: 7,
    duration: 8,
    disciplines: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'CLIMATIZACAO', 'PAISAGISMO', 'INTERIORES'],
    percentage: 15
  },
  {
    id: 'PE',
    name: 'Projeto Executivo',
    description: 'Representação final completa da edificação',
    order: 8,
    duration: 10,
    disciplines: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'CLIMATIZACAO', 'PAISAGISMO', 'INTERIORES', 'MODELAGEM_3D'],
    percentage: 15
  }
];

// Mapeamento de disciplinas
const DISCIPLINE_INFO = {
  'ARQUITETURA': { name: 'Arquitetura', icon: '🏗️' },
  'ESTRUTURAL': { name: 'Estrutural', icon: '🏢' },
  'INSTALACOES_ELETRICAS': { name: 'Elétrica', icon: '⚡' },
  'INSTALACOES_HIDRAULICAS': { name: 'Hidráulica', icon: '🚿' },
  'CLIMATIZACAO': { name: 'AVAC', icon: '❄️' },
  'PAISAGISMO': { name: 'Paisagismo', icon: '🌿' },
  'INTERIORES': { name: 'Interiores', icon: '🛋️' },
  'APROVACAO_LEGAL': { name: 'Legal', icon: '📋' },
  'MODELAGEM_3D': { name: '3D', icon: '🎨' }
};

export function ExecutionSchedule({ 
  budgetData, 
  activeDisciplines, 
  calculatedValues, 
  classes 
}: ExecutionScheduleProps) {

  /**
   * 🔄 GERAR FASES DINÂMICAS BASEADAS NAS DISCIPLINAS ATIVAS
   */
  const generateDynamicPhases = () => {
    return PROJECT_PHASES.map(phase => {
      // Filtrar disciplinas da fase que estão ativas
      const activePhaseDisciplines = phase.disciplines.filter(discipline => 
        activeDisciplines.includes(discipline)
      );

      // Calcular valor da fase baseado no percentual e disciplinas ativas
      let phaseValue = 0;
      if (calculatedValues && activePhaseDisciplines.length > 0) {
        const totalPhaseValue = activePhaseDisciplines.reduce((sum, discipline) => {
          return sum + (calculatedValues.disciplineValues[discipline] || 0);
        }, 0);
        phaseValue = (totalPhaseValue * phase.percentage) / 100;
      }

      // Ajustar duração baseada na quantidade de disciplinas
      const adjustedDuration = Math.max(
        phase.duration,
        Math.ceil(phase.duration * (activePhaseDisciplines.length / phase.disciplines.length))
      );

      return {
        ...phase,
        activeDisciplines: activePhaseDisciplines,
        value: phaseValue,
        adjustedDuration,
        isActive: activePhaseDisciplines.length > 0
      };
    }).filter(phase => phase.isActive); // Mostrar apenas fases com disciplinas ativas
  };

  const dynamicPhases = generateDynamicPhases();
  const totalDuration = dynamicPhases.reduce((sum, phase) => sum + phase.adjustedDuration, 0);
  const totalValue = dynamicPhases.reduce((sum, phase) => sum + phase.value, 0);

  return (
    <div className="mb-8">
      <div className={`rounded-xl p-8 border ${classes.card}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${classes.text}`}>
            Cronograma de Execução
          </h3>
          <div className="text-right">
            <div className={`text-2xl font-bold ${classes.textPrimary}`}>
              {totalDuration} semanas
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Prazo total estimado
            </div>
          </div>
        </div>

        {/* Resumo do Cronograma */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.text}`}>
              {dynamicPhases.length}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Fases Ativas
            </div>
          </div>
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.text}`}>
              {totalDuration}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Semanas Totais
            </div>
          </div>
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.text}`}>
              {activeDisciplines.length}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Disciplinas
            </div>
          </div>
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.textPrimary}`}>
              R$ {Math.round(totalValue).toLocaleString('pt-BR')}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Valor Total
            </div>
          </div>
        </div>

        {/* Timeline das Fases */}
        <div className="space-y-6">
          {dynamicPhases.map((phase, index) => {
            const isLast = index === dynamicPhases.length - 1;
            const cumulativeDuration = dynamicPhases
              .slice(0, index)
              .reduce((sum, p) => sum + p.adjustedDuration, 0);

            return (
              <div key={phase.id} className="relative">
                {/* Linha de Conexão */}
                {!isLast && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-300"></div>
                )}

                <div className={`flex items-start gap-6 p-6 rounded-lg ${classes.cardSecondary}`}>
                  {/* Número da Fase */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white ${classes.backgroundPrimary}`}>
                    {phase.order}
                  </div>

                  {/* Conteúdo da Fase */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`text-lg font-semibold ${classes.text}`}>
                          {phase.name} ({phase.id})
                        </h4>
                        <p className={`text-sm ${classes.textSecondary} mt-1`}>
                          {phase.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${classes.text}`}>
                          {phase.adjustedDuration} semanas
                        </div>
                        <div className={`text-sm ${classes.textSecondary}`}>
                          Semana {cumulativeDuration + 1}-{cumulativeDuration + phase.adjustedDuration}
                        </div>
                      </div>
                    </div>

                    {/* Disciplinas da Fase */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {phase.activeDisciplines.map(disciplineCode => {
                        const disciplineInfo = DISCIPLINE_INFO[disciplineCode as keyof typeof DISCIPLINE_INFO] || {
                          name: disciplineCode,
                          icon: '📋'
                        };

                        return (
                          <span
                            key={disciplineCode}
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full ${classes.badge}`}
                            title={`${disciplineInfo.name} - Incluída nesta fase`}
                          >
                            {disciplineInfo.icon} {disciplineInfo.name}
                          </span>
                        );
                      })}
                    </div>

                    {/* Valor e Percentual da Fase */}
                    <div className="flex items-center justify-between">
                      <div className={`text-sm ${classes.textSecondary}`}>
                        {phase.percentage}% do projeto
                      </div>
                      <div className={`font-semibold ${classes.textPrimary}`}>
                        R$ {Math.round(phase.value).toLocaleString('pt-BR')}
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${classes.progressBar}`}
                          style={{ width: `${phase.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Aviso se não há fases */}
        {dynamicPhases.length === 0 && (
          <div className={`text-center py-12 ${classes.textSecondary}`}>
            <div className="text-6xl mb-4">📅</div>
            <h4 className={`text-lg font-semibold mb-2 ${classes.text}`}>
              Nenhuma fase ativa
            </h4>
            <p className="mb-4">
              Ative disciplinas para gerar o cronograma automaticamente
            </p>
            <a
              href="/orcamentos/configuracoes"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${classes.buttonPrimary}`}
            >
              Configurar Disciplinas
            </a>
          </div>
        )}

        {/* Observações */}
        <div className={`mt-8 p-4 rounded-lg ${classes.cardTertiary}`}>
          <h5 className={`font-semibold mb-2 ${classes.text}`}>
            📋 Observações do Cronograma
          </h5>
          <ul className={`text-sm ${classes.textSecondary} space-y-1`}>
            <li>• Prazos baseados na metodologia NBR 13532</li>
            <li>• Fases podem ser executadas parcialmente em paralelo</li>
            <li>• Disciplinas especializadas seguem cronograma específico</li>
            <li>• Prazos podem variar conforme complexidade do projeto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}