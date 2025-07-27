'use client';

import InterfacePerguntas from '@/components/briefing/InterfacePerguntas';
import { BRIEFING_RESIDENCIAL_UNIFAMILIAR } from '@/data/briefings-aprovados/residencial/unifamiliar';
import { useRouter } from 'next/navigation';

export default function CasaSimplesPage() {
  const router = useRouter();

  const handleVoltar = () => {
    router.push('/briefing');
  };

  // ✅ USANDO BRIEFING APROVADO COM 235 PERGUNTAS
  const briefingCompleto = BRIEFING_RESIDENCIAL_UNIFAMILIAR;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <InterfacePerguntas 
        briefing={briefingCompleto}
        onVoltar={handleVoltar}
        onConcluir={(respostas: Record<string, any>) => {
          console.log('Briefing Casa Simples concluído:', respostas);
          router.push('/briefing');
        }}
      />
    </div>
  );
} 