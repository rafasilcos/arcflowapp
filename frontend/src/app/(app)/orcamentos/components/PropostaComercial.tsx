import React, { useRef, useState } from "react";
import type { PropostaComercialData } from "../services/gerarProposta";
import { BreakdownMultidisciplinar } from "./BreakdownMultidisciplinar";
import { CronogramaRecebimento } from "./CronogramaRecebimento";
import { gerarCronogramaRecebimento } from "../services/cronogramaRecebimento";

interface Props {
  proposta: PropostaComercialData;
}

export const PropostaComercial: React.FC<Props> = ({ proposta }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("Olá! Segue em anexo a proposta comercial do seu projeto. Qualquer dúvida, estou à disposição.");
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const breakdownMulti = proposta.detalhesOrcamento.breakdown?.multidisciplinar;
  const temMultidisciplinar = breakdownMulti && (
    breakdownMulti.interiores > 0 ||
    breakdownMulti.decoracao > 0 ||
    breakdownMulti.paisagismo > 0
  );

  const handleExportPDF = async () => {
    if (!ref.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(ref.current, { backgroundColor: null } as any);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Proposta-${proposta.cliente.replace(/\s+/g, "_")}.pdf`);
  };

  const handleEnviarEmail = async () => {
    setEnviando(true);
    setFeedback(null);
    try {
      if (!ref.current) throw new Error("Proposta não encontrada para exportação.");
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const canvas = await html2canvas(ref.current, { backgroundColor: null } as any);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      const pdfBase64 = await blobToBase64(pdfBlob);
      const res = await fetch("/orcamentos/api/enviar-proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: proposta.titulo,
          message: mensagem,
          pdfBase64: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
        }),
      });
      if (res.ok) {
        setFeedback("Proposta enviada com sucesso!");
        setShowModal(false);
      } else {
        const data = await res.json();
        setFeedback(data.error || "Erro ao enviar e-mail.");
      }
    } catch (err) {
      setFeedback("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 mt-10 border border-gray-200 dark:border-gray-800" ref={ref}>
      <h2 className="text-3xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">{proposta.titulo}</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Cliente: <span className="font-semibold">{proposta.cliente}</span></p>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Resumo do Projeto</h3>
        <p className="text-gray-700 dark:text-gray-300">{proposta.resumoProjeto}</p>
      </div>
      {temMultidisciplinar && (
        <>
          <BreakdownMultidisciplinar breakdown={breakdownMulti} />
          <CronogramaRecebimento etapas={gerarCronogramaRecebimento(breakdownMulti)} />
        </>
      )}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="flex-1 mb-4 md:mb-0">
          <span className="block text-gray-600 dark:text-gray-400">Valor Total do Projeto</span>
          <span className="text-4xl font-bold text-primary-700 dark:text-primary-400">R$ {proposta.valorTotal.toLocaleString()}</span>
        </div>
        <div className="flex-1">
          <span className="block text-gray-600 dark:text-gray-400">Cronograma Estimado</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">{proposta.cronograma}</span>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Diferenciais ArcFlow</h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
          {proposta.diferenciais.map((dif, i) => (
            <li key={i}>{dif}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Condições Comerciais</h3>
        <p className="text-gray-700 dark:text-gray-300">{proposta.condicoesComerciais}</p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Validade da proposta: {proposta.validade}</p>
      </div>
      <div className="flex justify-end mt-8 gap-4">
        <button className="px-6 py-3 rounded-lg bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition">Aceitar Proposta</button>
        <button onClick={handleExportPDF} className="px-6 py-3 rounded-lg bg-primary-100 text-primary-700 font-bold text-lg hover:bg-primary-200 transition border border-primary-300">Exportar para PDF</button>
        <button onClick={() => setShowModal(true)} className="px-6 py-3 rounded-lg bg-primary-50 text-primary-700 font-bold text-lg hover:bg-primary-100 transition border border-primary-200">Enviar por E-mail</button>
      </div>
      {/* Modal de envio por e-mail */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Enviar Proposta por E-mail</h3>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">E-mail do destinatário</label>
            <input type="email" className="w-full rounded border px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={email} onChange={e => setEmail(e.target.value)} required />
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
            <textarea className="w-full rounded border px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" rows={4} value={mensagem} onChange={e => setMensagem(e.target.value)} />
            <button onClick={handleEnviarEmail} disabled={enviando || !email} className="w-full py-3 rounded bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition disabled:opacity-50 mb-2">
              {enviando ? "Enviando..." : "Enviar Proposta"}
            </button>
            {feedback && <div className={`mt-2 text-center font-medium ${feedback.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
          </div>
        </div>
      )}
    </div>
  );
}; 