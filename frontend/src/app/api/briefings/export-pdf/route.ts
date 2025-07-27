import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export async function POST(request: NextRequest) {
  try {
    const { briefingData } = await request.json()
    
    if (!briefingData) {
      return NextResponse.json({ error: 'Dados do briefing são obrigatórios' }, { status: 400 })
    }

    // Criar o PDF
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    })
    
    const chunks: Buffer[] = []
    
    doc.on('data', (chunk) => chunks.push(chunk))
    
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
    })

    // Header do documento
    doc.fontSize(24)
       .fillColor('#6366f1')
       .text('BRIEFING DE PROJETO', { align: 'center' })
       .moveDown(0.5)
    
    doc.fontSize(18)
       .fillColor('#374151')
       .text(briefingData.nomeProjeto, { align: 'center' })
       .moveDown(1)

    // Linha divisória
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .strokeColor('#e5e7eb')
       .stroke()
       .moveDown(1)

    // Informações gerais
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('INFORMAÇÕES GERAIS', { underline: true })
       .moveDown(0.5)

    doc.fontSize(12)
       .fillColor('#374151')
       .text(`Cliente: ${briefingData.nomeCliente || 'Não informado'}`)
       .text(`Email: ${briefingData.emailCliente || 'Não informado'}`)
       .text(`Responsável: ${briefingData.nomeResponsavel || 'Não informado'}`)
       .text(`Data: ${new Date(briefingData.createdAt).toLocaleDateString('pt-BR')}`)
       .text(`Tempo de Preenchimento: ${briefingData.metadados?.tempoRealFormatado || 'Não calculado'}`)
       .text(`Total de Respostas: ${briefingData.metadados?.totalRespostas || 0}`)
       .text(`Progresso: ${briefingData.metadados?.progresso || 100}%`)
       .moveDown(1)

    // Organizar respostas por seções
    const secoes: Record<string, Array<{pergunta: string, resposta: any}>> = {}
    
    if (briefingData.perguntasERespostas) {
      briefingData.perguntasERespostas.forEach((item: any) => {
        if (!secoes[item.secao]) {
          secoes[item.secao] = []
        }
        secoes[item.secao].push({
          pergunta: item.pergunta,
          resposta: item.resposta
        })
      })
    } else {
      // Fallback para respostas não organizadas
      Object.entries(briefingData.respostas || {}).forEach(([pergunta, resposta]) => {
        if (!secoes['Informações Gerais']) {
          secoes['Informações Gerais'] = []
        }
        secoes['Informações Gerais'].push({ pergunta, resposta })
      })
    }

    // Adicionar cada seção
    Object.entries(secoes).forEach(([secao, items]) => {
      // Verificar se há espaço suficiente na página
      if (doc.y > 700) {
        doc.addPage()
      }

      doc.fontSize(16)
         .fillColor('#1f2937')
         .text(secao.toUpperCase(), { underline: true })
         .moveDown(0.5)

      items.forEach(({ pergunta, resposta }) => {
        // Verificar se há espaço para a pergunta e resposta
        if (doc.y > 720) {
          doc.addPage()
        }

        doc.fontSize(11)
           .fillColor('#4b5563')
           .text(`PERGUNTA: ${pergunta}`, { continued: false })
           .fontSize(10)
           .fillColor('#6b7280')
           .text(`RESPOSTA: ${typeof resposta === 'object' ? JSON.stringify(resposta) : String(resposta)}`, 
                  { indent: 20 })
           .moveDown(0.5)
      })
      
      doc.moveDown(0.5)
    })

    // Nova página para assinaturas
    doc.addPage()
    
    doc.fontSize(18)
       .fillColor('#1f2937')
       .text('ASSINATURAS', { align: 'center' })
       .moveDown(2)

    // Espaço para assinatura do responsável
    doc.fontSize(14)
       .text('RESPONSÁVEL PELO BRIEFING:')
       .moveDown(0.5)
       .fontSize(12)
       .text(`Nome: ${briefingData.nomeResponsavel || 'Não informado'}`)
       .text(`Email: ${briefingData.emailResponsavel || 'Não informado'}`)
       .moveDown(2)
       .text('Assinatura: ________________________________', { indent: 50 })
       .text(`Data: ____/____/________`, { indent: 50 })
       .moveDown(3)

    // Espaço para assinatura do cliente
    doc.fontSize(14)
       .text('CLIENTE:')
       .moveDown(0.5)
       .fontSize(12)
       .text(`Nome: ${briefingData.nomeCliente || 'Não informado'}`)
       .text(`Email: ${briefingData.emailCliente || 'Não informado'}`)
       .moveDown(2)
       .text('Assinatura: ________________________________', { indent: 50 })
       .text(`Data: ____/____/________`, { indent: 50 })

    // Footer
    doc.fontSize(8)
       .fillColor('#9ca3af')
       .text(`Documento gerado automaticamente pelo Sistema ArcFlow em ${new Date().toLocaleDateString('pt-BR')}`, 
             50, 750, { align: 'center' })

    doc.end()
    
    const pdfBuffer = await pdfPromise

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="briefing-${briefingData.nomeProjeto?.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json({ 
      error: 'Erro ao gerar PDF', 
      details: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 })
  }
} 