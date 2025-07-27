// SERVIÇO DE EXPORTAÇÃO DE RELATÓRIOS - ARCFLOW
// Sistema completo de geração e exportação de relatórios

import { BriefingCompleto } from '../types/briefing';
import { AnaliseIA } from './analiseIA';
import { BriefingConcluido } from './salvamentoBriefing';

export interface RelatorioConfig {
  formato: 'pdf' | 'excel' | 'word' | 'json';
  incluir: {
    dadosBasicos: boolean;
    respostas: boolean;
    analiseIA: boolean;
    graficos: boolean;
    recomendacoes: boolean;
    anexos: boolean;
  };
  filtros?: {
    dataInicio?: string;
    dataFim?: string;
    tipologia?: string;
    status?: string;
    scoreMinimo?: number;
  };
  personalizacao?: {
    logo?: string;
    empresa?: string;
    cores?: {
      primaria: string;
      secundaria: string;
    };
  };
}

export interface DadosRelatorio {
  briefings: BriefingConcluido[];
  estatisticas: {
    total: number;
    porTipologia: Record<string, number>;
    scoreMedio: number;
    tempoMedio: number;
    aprovacoes: number;
  };
  periodo: {
    inicio: string;
    fim: string;
  };
  geradoEm: string;
}

// Classe principal do serviço
export class ExportacaoRelatoriosService {
  private static instance: ExportacaoRelatoriosService;

  static getInstance(): ExportacaoRelatoriosService {
    if (!ExportacaoRelatoriosService.instance) {
      ExportacaoRelatoriosService.instance = new ExportacaoRelatoriosService();
    }
    return ExportacaoRelatoriosService.instance;
  }

  // Gerar relatório completo
  async gerarRelatorio(
    briefings: BriefingConcluido[],
    config: RelatorioConfig
  ): Promise<Blob> {
    const dados = this.prepararDados(briefings, config);

    switch (config.formato) {
      case 'pdf':
        return await this.gerarPDF(dados, config);
      case 'excel':
        return await this.gerarExcel(dados, config);
      case 'word':
        return await this.gerarWord(dados, config);
      case 'json':
        return this.gerarJSON(dados);
      default:
        throw new Error('Formato não suportado');
    }
  }

  // Relatórios específicos
  async gerarRelatorioAnaliseIA(
    briefings: BriefingConcluido[],
    formato: 'pdf' | 'excel' = 'pdf'
  ): Promise<Blob> {
    const config: RelatorioConfig = {
      formato,
      incluir: {
        dadosBasicos: true,
        respostas: false,
        analiseIA: true,
        graficos: true,
        recomendacoes: true,
        anexos: false
      }
    };

    return await this.gerarRelatorio(briefings, config);
  }

  async gerarRelatorioComparativo(
    briefings: BriefingConcluido[],
    formato: 'pdf' | 'excel' = 'pdf'
  ): Promise<Blob> {
    const config: RelatorioConfig = {
      formato,
      incluir: {
        dadosBasicos: true,
        respostas: true,
        analiseIA: true,
        graficos: true,
        recomendacoes: false,
        anexos: false
      }
    };

    return await this.gerarRelatorio(briefings, config);
  }

  async gerarRelatorioExecutivo(
    briefings: BriefingConcluido[],
    formato: 'pdf' | 'word' = 'pdf'
  ): Promise<Blob> {
    const config: RelatorioConfig = {
      formato,
      incluir: {
        dadosBasicos: true,
        respostas: false,
        analiseIA: true,
        graficos: true,
        recomendacoes: true,
        anexos: false
      }
    };

    return await this.gerarRelatorio(briefings, config);
  }

  // Preparar dados para relatório
  private prepararDados(
    briefings: BriefingConcluido[],
    config: RelatorioConfig
  ): DadosRelatorio {
    // Aplicar filtros
    let briefingsFiltrados = [...briefings];

    if (config.filtros) {
      const { dataInicio, dataFim, tipologia, status, scoreMinimo } = config.filtros;

      if (dataInicio) {
        briefingsFiltrados = briefingsFiltrados.filter(b => 
          new Date(b.concluidoEm) >= new Date(dataInicio)
        );
      }

      if (dataFim) {
        briefingsFiltrados = briefingsFiltrados.filter(b => 
          new Date(b.concluidoEm) <= new Date(dataFim)
        );
      }

      if (tipologia) {
        briefingsFiltrados = briefingsFiltrados.filter(b => 
          b.briefingId.includes(tipologia.toLowerCase())
        );
      }

      if (status) {
        briefingsFiltrados = briefingsFiltrados.filter(b => 
          b.status === status
        );
      }

      if (scoreMinimo && scoreMinimo > 0) {
        briefingsFiltrados = briefingsFiltrados.filter(b => 
          b.analiseIA && b.analiseIA.score >= scoreMinimo
        );
      }
    }

    // Calcular estatísticas
    const estatisticas = this.calcularEstatisticas(briefingsFiltrados);

    // Determinar período
    const datas = briefingsFiltrados.map(b => new Date(b.concluidoEm));
    const periodo = {
      inicio: datas.length > 0 ? new Date(Math.min(...datas.map(d => d.getTime()))).toISOString() : '',
      fim: datas.length > 0 ? new Date(Math.max(...datas.map(d => d.getTime()))).toISOString() : ''
    };

    return {
      briefings: briefingsFiltrados,
      estatisticas,
      periodo,
      geradoEm: new Date().toISOString()
    };
  }

  // Calcular estatísticas
  private calcularEstatisticas(briefings: BriefingConcluido[]) {
    const total = briefings.length;
    
    const porTipologia: Record<string, number> = {};
    let somaScores = 0;
    let somaTempos = 0;
    let aprovacoes = 0;

    briefings.forEach(briefing => {
      // Tipologia (extrair do briefingId)
      const tipologia = this.extrairTipologia(briefing.briefingId);
      porTipologia[tipologia] = (porTipologia[tipologia] || 0) + 1;

      // Score IA
      if (briefing.analiseIA) {
        somaScores += briefing.analiseIA.score;
      }

      // Tempo de preenchimento
      somaTempos += briefing.tempoPreenchimento;

      // Aprovações
      if (briefing.status === 'aprovado') {
        aprovacoes++;
      }
    });

    return {
      total,
      porTipologia,
      scoreMedio: total > 0 ? Math.round(somaScores / total) : 0,
      tempoMedio: total > 0 ? Math.round(somaTempos / total) : 0,
      aprovacoes
    };
  }

  // Gerar PDF
  private async gerarPDF(dados: DadosRelatorio, config: RelatorioConfig): Promise<Blob> {
    // Simulação de geração de PDF
    // Em produção, usar biblioteca como jsPDF ou Puppeteer
    
    const conteudoHTML = this.gerarHTMLRelatorio(dados, config);
    
    // Converter HTML para PDF (simulado)
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Relatório ArcFlow - ${dados.briefings.length} briefings) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF
`;

    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  // Gerar Excel
  private async gerarExcel(dados: DadosRelatorio, config: RelatorioConfig): Promise<Blob> {
    // Simulação de geração de Excel
    // Em produção, usar biblioteca como SheetJS
    
    const csvContent = this.gerarCSV(dados, config);
    
    return new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // Gerar Word
  private async gerarWord(dados: DadosRelatorio, config: RelatorioConfig): Promise<Blob> {
    // Simulação de geração de Word
    // Em produção, usar biblioteca como docx
    
    const conteudo = this.gerarTextoRelatorio(dados, config);
    
    return new Blob([conteudo], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  }

  // Gerar JSON
  private gerarJSON(dados: DadosRelatorio): Blob {
    const json = JSON.stringify(dados, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  // Gerar HTML para relatório
  private gerarHTMLRelatorio(dados: DadosRelatorio, config: RelatorioConfig): string {
    const { briefings, estatisticas, periodo } = dados;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Relatório ArcFlow - Briefings</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { max-width: 200px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .briefing-item { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .score { font-weight: bold; }
        .score.excelente { color: #28a745; }
        .score.bom { color: #007bff; }
        .score.regular { color: #ffc107; }
        .score.precisa-melhorar { color: #dc3545; }
    </style>
</head>
<body>
    <div class="header">
        ${config.personalizacao?.logo ? `<img src="${config.personalizacao.logo}" class="logo" alt="Logo">` : ''}
        <h1>Relatório de Briefings ArcFlow</h1>
        <p>Período: ${new Date(periodo.inicio).toLocaleDateString()} - ${new Date(periodo.fim).toLocaleDateString()}</p>
        <p>Gerado em: ${new Date(dados.geradoEm).toLocaleString()}</p>
    </div>

    ${config.incluir.graficos ? `
    <div class="stats">
        <div class="stat-card">
            <div class="stat-value">${estatisticas.total}</div>
            <div>Total de Briefings</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${estatisticas.scoreMedio}%</div>
            <div>Score Médio IA</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${Math.round(estatisticas.tempoMedio / 60)}min</div>
            <div>Tempo Médio</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${estatisticas.aprovacoes}</div>
            <div>Aprovados</div>
        </div>
    </div>
    ` : ''}

    <h2>Briefings Detalhados</h2>
    ${briefings.map(briefing => `
        <div class="briefing-item">
            <h3>${briefing.briefingId}</h3>
            ${config.incluir.dadosBasicos ? `
                <p><strong>Status:</strong> ${briefing.status}</p>
                <p><strong>Concluído em:</strong> ${new Date(briefing.concluidoEm).toLocaleString()}</p>
                <p><strong>Tempo de preenchimento:</strong> ${Math.round(briefing.tempoPreenchimento / 60)} minutos</p>
            ` : ''}
            
            ${config.incluir.analiseIA && briefing.analiseIA ? `
                <div class="analise-ia">
                    <h4>Análise IA</h4>
                    <p><span class="score ${briefing.analiseIA.categoria}">Score: ${briefing.analiseIA.score}% (${briefing.analiseIA.categoria})</span></p>
                    
                    ${config.incluir.recomendacoes ? `
                        <h5>Pontos Fortes:</h5>
                        <ul>
                            ${briefing.analiseIA.pontosFortres.map(ponto => `<li>${ponto}</li>`).join('')}
                        </ul>
                        
                        <h5>Recomendações:</h5>
                        <ul>
                            ${briefing.analiseIA.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `).join('')}

    <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.9em;">
        <p>Relatório gerado pelo ArcFlow - Sistema Inteligente de Briefings AEC</p>
        <p>${config.personalizacao?.empresa || 'ArcFlow'} • ${new Date().getFullYear()}</p>
    </div>
</body>
</html>
    `;
  }

  // Gerar CSV
  private gerarCSV(dados: DadosRelatorio, config: RelatorioConfig): string {
    const { briefings } = dados;
    
    const headers = [
      'ID',
      'Status',
      'Data Conclusão',
      'Tempo (min)',
      'Score IA',
      'Categoria IA'
    ];

    const rows = briefings.map(briefing => [
      briefing.briefingId,
      briefing.status,
      new Date(briefing.concluidoEm).toLocaleDateString(),
      Math.round(briefing.tempoPreenchimento / 60).toString(),
      briefing.analiseIA?.score?.toString() || '',
      briefing.analiseIA?.categoria || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  // Gerar texto para relatório
  private gerarTextoRelatorio(dados: DadosRelatorio, config: RelatorioConfig): string {
    const { briefings, estatisticas, periodo } = dados;
    
    return `
RELATÓRIO DE BRIEFINGS ARCFLOW
==============================

Período: ${new Date(periodo.inicio).toLocaleDateString()} - ${new Date(periodo.fim).toLocaleDateString()}
Gerado em: ${new Date(dados.geradoEm).toLocaleString()}

ESTATÍSTICAS GERAIS
-------------------
Total de Briefings: ${estatisticas.total}
Score Médio IA: ${estatisticas.scoreMedio}%
Tempo Médio: ${Math.round(estatisticas.tempoMedio / 60)} minutos
Briefings Aprovados: ${estatisticas.aprovacoes}

DISTRIBUIÇÃO POR TIPOLOGIA
--------------------------
${Object.entries(estatisticas.porTipologia)
  .map(([tipologia, quantidade]) => `${tipologia}: ${quantidade}`)
  .join('\n')}

BRIEFINGS DETALHADOS
--------------------
${briefings.map(briefing => `
${briefing.briefingId}
Status: ${briefing.status}
Concluído: ${new Date(briefing.concluidoEm).toLocaleString()}
Tempo: ${Math.round(briefing.tempoPreenchimento / 60)} min
${briefing.analiseIA ? `Score IA: ${briefing.analiseIA.score}% (${briefing.analiseIA.categoria})` : ''}
---
`).join('')}

Relatório gerado pelo ArcFlow
${config.personalizacao?.empresa || 'ArcFlow'} • ${new Date().getFullYear()}
    `;
  }

  // Extrair tipologia do briefingId
  private extrairTipologia(briefingId: string): string {
    if (briefingId.includes('residencial')) return 'Residencial';
    if (briefingId.includes('comercial')) return 'Comercial';
    if (briefingId.includes('industrial')) return 'Industrial';
    if (briefingId.includes('institucional')) return 'Institucional';
    if (briefingId.includes('urbanistico')) return 'Urbanístico';
    return 'Outros';
  }

  // Download do arquivo
  downloadArquivo(blob: Blob, nomeArquivo: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Gerar nome do arquivo
  gerarNomeArquivo(tipo: string, formato: string): string {
    const data = new Date().toISOString().split('T')[0];
    return `arcflow-${tipo}-${data}.${formato}`;
  }
}

// Instância singleton
export const exportacaoService = ExportacaoRelatoriosService.getInstance();

// Funções de conveniência
export async function exportarRelatorioCompleto(
  briefings: BriefingConcluido[],
  formato: 'pdf' | 'excel' | 'word' = 'pdf'
): Promise<void> {
  const config: RelatorioConfig = {
    formato,
    incluir: {
      dadosBasicos: true,
      respostas: true,
      analiseIA: true,
      graficos: true,
      recomendacoes: true,
      anexos: false
    }
  };

  const blob = await exportacaoService.gerarRelatorio(briefings, config);
  const nomeArquivo = exportacaoService.gerarNomeArquivo('completo', formato);
  exportacaoService.downloadArquivo(blob, nomeArquivo);
}

export async function exportarRelatorioAnaliseIA(
  briefings: BriefingConcluido[],
  formato: 'pdf' | 'excel' = 'pdf'
): Promise<void> {
  const blob = await exportacaoService.gerarRelatorioAnaliseIA(briefings, formato);
  const nomeArquivo = exportacaoService.gerarNomeArquivo('analise-ia', formato);
  exportacaoService.downloadArquivo(blob, nomeArquivo);
}

export async function exportarRelatorioExecutivo(
  briefings: BriefingConcluido[],
  formato: 'pdf' | 'word' = 'pdf'
): Promise<void> {
  const blob = await exportacaoService.gerarRelatorioExecutivo(briefings, formato);
  const nomeArquivo = exportacaoService.gerarNomeArquivo('executivo', formato);
  exportacaoService.downloadArquivo(blob, nomeArquivo);
} 