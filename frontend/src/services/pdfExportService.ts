import jsPDF from 'jspdf';

interface BriefingPDFData {
  id: string;
  briefingId: string;
  clienteId: string;
  respostas: Record<string, any>;
  analiseIA?: any;
  status: string;
  concluidoEm: string;
  metadados: {
    dispositivo: string;
    navegador: string;
  };
}

interface ExportConfig {
  formato: 'pdf' | 'excel' | 'word' | 'json';
  incluir: {
    dadosBasicos: boolean;
    respostas: boolean;
    analiseIA: boolean;
    graficos: boolean;
    recomendacoes: boolean;
    anexos: boolean;
  };
}

export class PDFExportService {
  private static instance: PDFExportService;
  
  static getInstance(): PDFExportService {
    if (!PDFExportService.instance) {
      PDFExportService.instance = new PDFExportService();
    }
    return PDFExportService.instance;
  }

  // 🎨 GERAR PDF COMPLETO - PROFISSIONAL
  async gerarPDFCompleto(briefing: BriefingPDFData, clienteNome?: string, responsavelNome?: string): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;

    // 📋 CABEÇALHO PRINCIPAL
    this.adicionarCabecalho(doc, yPosition);
    yPosition += 30;

    // 📊 INFORMAÇÕES DO BRIEFING
    yPosition = this.adicionarInfoBriefing(doc, briefing, yPosition, clienteNome, responsavelNome);
    yPosition += 10;

    // 📝 RESPOSTAS DETALHADAS
    yPosition = this.adicionarRespostasDetalhadas(doc, briefing.respostas, yPosition);

    // 🧠 ANÁLISE IA (se disponível)
    if (briefing.analiseIA) {
      yPosition = this.adicionarAnaliseIA(doc, briefing.analiseIA, yPosition);
    }

    // 📄 RODAPÉ
    this.adicionarRodape(doc);

    // 💾 DOWNLOAD
    const nomeArquivo = `ArcFlow_Briefing_${briefing.briefingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);
  }

  // 📊 GERAR PDF EXECUTIVO - RESUMIDO
  async gerarPDFExecutivo(briefing: BriefingPDFData, clienteNome?: string, responsavelNome?: string): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;

    // Cabeçalho
    this.adicionarCabecalho(doc, yPosition, 'RELATÓRIO EXECUTIVO');
    yPosition += 30;

    // Info do briefing
    yPosition = this.adicionarInfoBriefing(doc, briefing, yPosition, clienteNome, responsavelNome);

    // Resumo das respostas (só principais)
    yPosition = this.adicionarResumoRespostas(doc, briefing.respostas, yPosition);

    // Análise IA resumida
    if (briefing.analiseIA) {
      yPosition = this.adicionarAnaliseIAResumida(doc, briefing.analiseIA, yPosition);
    }

    this.adicionarRodape(doc);

    const nomeArquivo = `ArcFlow_Executivo_${briefing.briefingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);
  }

  // 🧠 GERAR PDF ANÁLISE IA - FOCO EM IA
  async gerarPDFAnaliseIA(briefing: BriefingPDFData, clienteNome?: string): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;

    this.adicionarCabecalho(doc, yPosition, 'ANÁLISE INTELIGENTE');
    yPosition += 30;

    // Info básica
    yPosition = this.adicionarInfoBasica(doc, briefing, yPosition, clienteNome);

    // Análise IA completa
    if (briefing.analiseIA) {
      yPosition = this.adicionarAnaliseIACompleta(doc, briefing.analiseIA, yPosition);
    } else {
      doc.setFontSize(12);
      doc.text('⚠️ Análise IA não disponível para este briefing', 20, yPosition);
    }

    this.adicionarRodape(doc);

    const nomeArquivo = `ArcFlow_AnaliseIA_${briefing.briefingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);
  }

  // 🎨 MÉTODOS DE FORMATAÇÃO PRIVADOS

  private adicionarCabecalho(doc: jsPDF, y: number, subtitulo?: string): void {
    // Logo/Título principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('🏗️ ARCFLOW', 20, y);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema Inteligente de Briefings', 20, y + 8);

    if (subtitulo) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(subtitulo, 20, y + 18);
    }

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, y + 25, 190, y + 25);
  }

  private adicionarInfoBriefing(doc: jsPDF, briefing: BriefingPDFData, y: number, clienteNome?: string, responsavelNome?: string): number {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 INFORMAÇÕES DO BRIEFING', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Grid de informações
    const info = [
      [`ID do Briefing:`, briefing.briefingId],
      [`Cliente:`, clienteNome || 'Não informado'],
      [`Responsável:`, responsavelNome || 'Não informado'],
      [`Status:`, this.formatarStatus(briefing.status)],
      [`Data de Conclusão:`, new Date(briefing.concluidoEm).toLocaleDateString('pt-BR')],
      [`Dispositivo:`, briefing.metadados.dispositivo],
      [`Total de Respostas:`, Object.keys(briefing.respostas).length.toString()]
    ];

    info.forEach(([label, value], index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y + (index * 6));
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, y + (index * 6));
    });

    return y + (info.length * 6) + 5;
  }

  private adicionarInfoBasica(doc: jsPDF, briefing: BriefingPDFData, y: number, clienteNome?: string): number {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 Informações Básicas', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${clienteNome || 'Não informado'}`, 20, y);
    doc.text(`Status: ${this.formatarStatus(briefing.status)}`, 20, y + 6);
    doc.text(`Concluído em: ${new Date(briefing.concluidoEm).toLocaleDateString('pt-BR')}`, 20, y + 12);

    return y + 20;
  }

  private adicionarRespostasDetalhadas(doc: jsPDF, respostas: Record<string, any>, y: number): number {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('💬 RESPOSTAS DETALHADAS', 20, y);
    y += 12;

    doc.setFontSize(10);
    
    const respostasArray = Object.entries(respostas);
    
    respostasArray.forEach(([pergunta, resposta], index) => {
      // Verificar se precisa de nova página
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Pergunta
      doc.setFont('helvetica', 'bold');
      const perguntaTexto = `${index + 1}. ${this.formatarPergunta(pergunta)}`;
      const perguntaLinhas = doc.splitTextToSize(perguntaTexto, 170);
      doc.text(perguntaLinhas, 20, y);
      y += perguntaLinhas.length * 4;

      // Resposta
      doc.setFont('helvetica', 'normal');
      const respostaTexto = this.formatarResposta(resposta);
      const respostaLinhas = doc.splitTextToSize(`📝 ${respostaTexto}`, 165);
      doc.text(respostaLinhas, 25, y);
      y += respostaLinhas.length * 4 + 3;
    });

    return y + 10;
  }

  private adicionarResumoRespostas(doc: jsPDF, respostas: Record<string, any>, y: number): number {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 RESUMO DAS RESPOSTAS', 20, y);
    y += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const totalRespostas = Object.keys(respostas).length;
    const respostasPreenchidas = Object.values(respostas).filter(r => r && r !== '').length;
    const percentualCompleto = Math.round((respostasPreenchidas / totalRespostas) * 100);

    doc.text(`📋 Total de perguntas: ${totalRespostas}`, 20, y);
    doc.text(`✅ Respostas preenchidas: ${respostasPreenchidas}`, 20, y + 6);
    doc.text(`📈 Percentual completo: ${percentualCompleto}%`, 20, y + 12);

    // Principais respostas (primeiras 5)
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('🔸 Principais Respostas:', 20, y);
    y += 8;

    const principais = Object.entries(respostas).slice(0, 5);
    principais.forEach(([pergunta, resposta], index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'normal');
      const texto = `${index + 1}. ${this.formatarPergunta(pergunta)}: ${this.formatarResposta(resposta).substring(0, 50)}...`;
      const linhas = doc.splitTextToSize(texto, 170);
      doc.text(linhas, 20, y);
      y += linhas.length * 4 + 2;
    });

    return y + 10;
  }

  private adicionarAnaliseIA(doc: jsPDF, analise: any, y: number): number {
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🧠 ANÁLISE INTELIGENTE', 20, y);
    y += 12;

    doc.setFontSize(10);
    
    // Score
    if (analise.score) {
      doc.setFont('helvetica', 'bold');
      doc.text(`📊 Score: ${analise.score}/100`, 20, y);
      doc.text(`🏆 Categoria: ${analise.categoria || 'Não classificado'}`, 20, y + 6);
      y += 15;
    }

    // Pontos fortes
    if (analise.pontosFortres && analise.pontosFortres.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('✅ Pontos Fortes:', 20, y);
      y += 6;
      
      doc.setFont('helvetica', 'normal');
      analise.pontosFortres.forEach((ponto: string, index: number) => {
        const texto = `• ${ponto}`;
        const linhas = doc.splitTextToSize(texto, 170);
        doc.text(linhas, 25, y);
        y += linhas.length * 4;
      });
      y += 5;
    }

    // Pontos de atenção
    if (analise.pontosAtencao && analise.pontosAtencao.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('⚠️ Pontos de Atenção:', 20, y);
      y += 6;
      
      doc.setFont('helvetica', 'normal');
      analise.pontosAtencao.forEach((ponto: string) => {
        const texto = `• ${ponto}`;
        const linhas = doc.splitTextToSize(texto, 170);
        doc.text(linhas, 25, y);
        y += linhas.length * 4;
      });
      y += 5;
    }

    // Recomendações
    if (analise.recomendacoes && analise.recomendacoes.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('💡 Recomendações:', 20, y);
      y += 6;
      
      doc.setFont('helvetica', 'normal');
      analise.recomendacoes.forEach((rec: string) => {
        const texto = `• ${rec}`;
        const linhas = doc.splitTextToSize(texto, 170);
        doc.text(linhas, 25, y);
        y += linhas.length * 4;
      });
    }

    return y + 10;
  }

  private adicionarAnaliseIAResumida(doc: jsPDF, analise: any, y: number): number {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('🧠 Análise IA - Resumo', 20, y);
    y += 8;

    if (analise.score) {
      doc.setFontSize(10);
      doc.text(`Score: ${analise.score}/100 (${analise.categoria || 'N/A'})`, 20, y);
      y += 8;
    }

    doc.setFont('helvetica', 'normal');
    doc.text(`✅ ${analise.pontosFortres?.length || 0} pontos fortes identificados`, 20, y);
    doc.text(`⚠️ ${analise.pontosAtencao?.length || 0} pontos de atenção`, 20, y + 6);
    doc.text(`💡 ${analise.recomendacoes?.length || 0} recomendações`, 20, y + 12);

    return y + 20;
  }

  private adicionarAnaliseIACompleta(doc: jsPDF, analise: any, y: number): number {
    return this.adicionarAnaliseIA(doc, analise, y);
  }

  private adicionarRodape(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Linha separadora
      doc.setLineWidth(0.3);
      doc.line(20, 280, 190, 280);
      
      // Texto do rodapé
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Gerado pelo ArcFlow - Sistema Inteligente de Briefings', 20, 285);
      doc.text(`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 290);
      doc.text(`Página ${i} de ${pageCount}`, 170, 290);
    }
  }

  private formatarPergunta(pergunta: string): string {
    // Remover prefixos técnicos e formatar
    return pergunta
      .replace(/^(pergunta_|question_|q_)/i, '')
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());
  }

  private formatarResposta(resposta: any): string {
    if (!resposta) return 'Não respondido';
    if (typeof resposta === 'object') return JSON.stringify(resposta, null, 2);
    return String(resposta);
  }

  private formatarStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'EM_ANDAMENTO': '⏳ Em Andamento',
      'CONCLUIDO': '✅ Concluído',
      'EM_EDICAO': '✏️ Em Edição',
      'ORCAMENTO_ELABORACAO': '💰 Orçamento em Elaboração',
      'PROJETO_INICIADO': '🚀 Projeto Iniciado',
      
      // Status legados para compatibilidade
      'concluido': '✅ Concluído',
      'aprovado': '✅ Concluído',
      'em_revisao': '✏️ Em Edição',
      'rejeitado': '✏️ Em Edição',
      'rascunho': '⏳ Em Andamento',
      'em_andamento': '⏳ Em Andamento'
    };
    return statusMap[status] || status;
  }
}

// Exportar instância única
export const pdfExportService = PDFExportService.getInstance(); 