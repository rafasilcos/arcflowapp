import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'

export async function POST(request: NextRequest) {
  try {
    const { briefingData, emailCliente, emailResponsavel } = await request.json()
    
    if (!briefingData || !emailCliente) {
      return NextResponse.json({ error: 'Dados do briefing e email do cliente são obrigatórios' }, { status: 400 })
    }

    // Gerar o PDF
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
    }

    // Adicionar cada seção
    Object.entries(secoes).forEach(([secao, items]) => {
      if (doc.y > 700) {
        doc.addPage()
      }

      doc.fontSize(16)
         .fillColor('#1f2937')
         .text(secao.toUpperCase(), { underline: true })
         .moveDown(0.5)

      items.forEach(({ pergunta, resposta }) => {
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

    // Configurar transporter de email
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Configurar opções do email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailCliente,
      cc: emailResponsavel,
      subject: `Briefing do Projeto: ${briefingData.nomeProjeto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            Briefing do Projeto: ${briefingData.nomeProjeto}
          </h2>
          
          <p>Prezado(a) ${briefingData.nomeCliente},</p>
          
          <p>Segue em anexo o briefing completo do seu projeto, conforme as informações fornecidas.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Resumo do Briefing:</h3>
            <ul style="color: #6b7280;">
              <li><strong>Projeto:</strong> ${briefingData.nomeProjeto}</li>
              <li><strong>Cliente:</strong> ${briefingData.nomeCliente}</li>
              <li><strong>Responsável:</strong> ${briefingData.nomeResponsavel}</li>
              <li><strong>Data:</strong> ${new Date(briefingData.createdAt).toLocaleDateString('pt-BR')}</li>
              <li><strong>Tempo de Preenchimento:</strong> ${briefingData.metadados?.tempoRealFormatado || 'Não calculado'}</li>
              <li><strong>Total de Respostas:</strong> ${briefingData.metadados?.totalRespostas || 0}</li>
            </ul>
          </div>
          
          <p>O documento em PDF anexo contém todas as perguntas e respostas organizadas por seções, além de espaços para assinatura.</p>
          
          <p>Caso tenha alguma dúvida ou precise de esclarecimentos, não hesite em entrar em contato.</p>
          
          <p>Atenciosamente,<br>
          <strong>Sistema ArcFlow</strong><br>
          Gestão Inteligente para Arquitetura, Engenharia e Construção</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Este email foi enviado automaticamente pelo Sistema ArcFlow em ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `briefing-${briefingData.nomeProjeto.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer
        }
      ]
    }

    // Enviar email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado com sucesso!',
      recipients: {
        to: emailCliente,
        cc: emailResponsavel
      }
    })

  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json({ 
      error: 'Erro ao enviar email', 
      details: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 })
  }
} 