export const dadosProjetoExpandido = {
  id: "proj_001",
  nome: "Residência Unifamiliar - João Silva",
  cliente: "João Silva",
  gerente: "Arq. Maria Santos", 
  data_inicio: "2024-01-15",
  prazo_final: "2024-06-15",
  status: "em_progresso",
  progresso_geral: 45,
  tempo_total_estimado: 720000, // 200 horas
  tempo_total_trabalhado: 324000, // 90 horas
  equipe: [
    { id: "user_001", nome: "Arq. Maria Santos", cargo: "Gerente de Projeto", avatar: "👩‍💼", status: "online" },
    { id: "user_002", nome: "Eng. Carlos Lima", cargo: "Engenheiro Civil", avatar: "👨‍💻", status: "ocupado" },
    { id: "user_003", nome: "Eng. Roberto Silva", cargo: "Engenheiro Estrutural", avatar: "👨‍🔧", status: "online" },
    { id: "user_004", nome: "Eng. Paulo Elétrica", cargo: "Engenheiro Elétrico", avatar: "⚡", status: "offline" }
  ],
  etapas: [
    {
      id: "etapa_001",
      numero: 1,
      nome: "Projeto Arquitetônico",
      progresso: 80,
      status: "em_progresso" as const,
      data_inicio: "2024-01-15",
      data_fim: "2024-02-28",
      responsavel: "Arq. Maria Santos",
      arquivos: 12,
      comentarios: 8,
      tarefas: [
        {
          id: "tarefa_001",
          nome: "Análise do Terreno e Levantamento Topográfico",
          status: "concluida" as const,
          responsavel: "Eng. Carlos Lima",
          tempo_estimado: 28800,
          tempo_total: 32400,
          data_entrega: "2024-01-20",
          prioridade: "alta" as const,
          arquivos: 3,
          comentarios: 2
        },
        {
          id: "tarefa_002", 
          nome: "Estudo de Viabilidade e Programa de Necessidades",
          status: "em_progresso" as const,
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 36000,
          tempo_total: 25200,
          data_entrega: "2024-01-25",
          prioridade: "alta" as const,
          arquivos: 1,
          comentarios: 5
        },
        {
          id: "tarefa_003",
          nome: "Anteprojeto e Plantas Baixas",
          status: "em_revisao" as const,
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 72000,
          tempo_total: 45000,
          data_entrega: "2024-02-10",
          prioridade: "alta" as const,
          arquivos: 8,
          comentarios: 3
        },
        {
          id: "tarefa_004",
          nome: "Projeto Executivo - Detalhamentos",
          status: "nao_iniciada" as const,
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 54000,
          tempo_total: 0,
          data_entrega: "2024-02-25",
          prioridade: "media" as const,
          arquivos: 0,
          comentarios: 1
        }
      ]
    },
    {
      id: "etapa_002",
      numero: 2,
      nome: "Projeto Estrutural",
      progresso: 25,
      status: "nao_iniciada" as const,
      data_inicio: "2024-02-01",
      data_fim: "2024-03-15",
      responsavel: "Eng. Roberto Silva",
      arquivos: 2,
      comentarios: 3,
      tarefas: [
        {
          id: "tarefa_005",
          nome: "Análise Estrutural Preliminar",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 36000,
          tempo_total: 0,
          data_entrega: "2024-02-15",
          prioridade: "media" as const,
          arquivos: 0,
          comentarios: 0
        },
        {
          id: "tarefa_006",
          nome: "Cálculo de Fundações",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 54000,
          tempo_total: 0,
          data_entrega: "2024-03-01",
          prioridade: "alta" as const,
          arquivos: 0,
          comentarios: 2
        },
        {
          id: "tarefa_007",
          nome: "Dimensionamento de Pilares e Vigas",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 72000,
          tempo_total: 0,
          data_entrega: "2024-03-10",
          prioridade: "alta" as const,
          arquivos: 0,
          comentarios: 1
        },
        {
          id: "tarefa_008",
          nome: "Plantas de Formas e Armaduras",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 45000,
          tempo_total: 0,
          data_entrega: "2024-03-15",
          prioridade: "media" as const,
          arquivos: 2,
          comentarios: 0
        }
      ]
    },
    {
      id: "etapa_003",
      numero: 3,
      nome: "Instalações Prediais",
      progresso: 0,
      status: "nao_iniciada" as const,
      data_inicio: "2024-03-01",
      data_fim: "2024-04-15",
      responsavel: "Eng. Paulo Elétrica",
      arquivos: 0,
      comentarios: 0,
      tarefas: [
        {
          id: "tarefa_009",
          nome: "Projeto Elétrico - Pontos e Circuitos",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Paulo Elétrica",
          tempo_estimado: 45000,
          tempo_total: 0,
          data_entrega: "2024-03-20",
          prioridade: "media" as const,
          arquivos: 0,
          comentarios: 0
        },
        {
          id: "tarefa_010",
          nome: "Projeto Hidrossanitário",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Carlos Lima",
          tempo_estimado: 36000,
          tempo_total: 0,
          data_entrega: "2024-03-25",
          prioridade: "media" as const,
          arquivos: 0,
          comentarios: 0
        },
        {
          id: "tarefa_011",
          nome: "Sistema de Climatização",
          status: "nao_iniciada" as const,
          responsavel: "Eng. Paulo Elétrica",
          tempo_estimado: 27000,
          tempo_total: 0,
          data_entrega: "2024-04-10",
          prioridade: "baixa" as const,
          arquivos: 0,
          comentarios: 0
        }
      ]
    },
    {
      id: "etapa_004",
      numero: 4,
      nome: "Compatibilização e Finalização",
      progresso: 0,
      status: "nao_iniciada" as const,
      data_inicio: "2024-04-15",
      data_fim: "2024-05-30",
      responsavel: "Arq. Maria Santos",
      arquivos: 0,
      comentarios: 0,
      tarefas: [
        {
          id: "tarefa_012",
          nome: "Compatibilização de Projetos",
          status: "nao_iniciada" as const,
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 54000,
          tempo_total: 0,
          data_entrega: "2024-05-10",
          prioridade: "alta" as const,
          arquivos: 0,
          comentarios: 0
        },
        {
          id: "tarefa_013",
          nome: "Documentação Final e Entrega",
          status: "nao_iniciada" as const,
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 36000,
          tempo_total: 0,
          data_entrega: "2024-05-30",
          prioridade: "alta" as const,
          arquivos: 0,
          comentarios: 0
        }
      ]
    }
  ]
}; 