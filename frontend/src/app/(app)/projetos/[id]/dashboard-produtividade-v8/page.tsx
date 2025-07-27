'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageSquare, FileText, Activity, Clock, CheckCircle2, Calendar, Upload, Send, Settings, Home, Columns, BarChart3, Workflow } from 'lucide-react';

// Sidebar vertical fixa
function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-blue-700 to-blue-900 flex flex-col items-center py-6 z-30 shadow-xl">
      <div className="mb-8">
        <Home className="h-8 w-8 text-white" />
      </div>
      <nav className="flex flex-col gap-8 flex-1">
        <Button variant="ghost" size="icon" className="text-white"><BarChart3 className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" className="text-white"><Columns className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" className="text-white"><Users className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" className="text-white"><MessageSquare className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" className="text-white"><Workflow className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" className="text-white mt-auto"><Settings className="h-6 w-6" /></Button>
      </nav>
    </aside>
  );
}

// Header dinâmico
function HeaderProjeto() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 ml-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Casa Residencial - Família Silva</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">Em andamento</span>
          <Progress value={68} className="w-32 h-2 bg-slate-100" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary">Modo Foco</Button>
        <Button variant="outline">Nova Tarefa</Button>
        <Button variant="outline" size="icon"><Upload className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
      </div>
    </header>
  );
}

// Cards de métricas interativos
function GridCardsMetrica() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 ml-20 mt-8">
      <Card className="hover:scale-[1.03] transition-transform cursor-pointer"><CardContent className="p-4 text-center"><Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" /><div className="font-bold text-blue-700">163h</div><div className="text-xs text-slate-500">Tempo trabalhado</div></CardContent></Card>
      <Card className="hover:scale-[1.03] transition-transform cursor-pointer"><CardContent className="p-4 text-center"><Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" /><div className="font-bold text-green-700">97</div><div className="text-xs text-slate-500">dias restantes</div></CardContent></Card>
      <Card className="hover:scale-[1.03] transition-transform cursor-pointer"><CardContent className="p-4 text-center"><Users className="h-6 w-6 mx-auto mb-2 text-purple-600" /><div className="font-bold text-purple-700">4</div><div className="text-xs text-slate-500">pessoas ativas</div></CardContent></Card>
      <Card className="hover:scale-[1.03] transition-transform cursor-pointer"><CardContent className="p-4 text-center"><CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-600" /><div className="font-bold text-emerald-700">12/20</div><div className="text-xs text-slate-500">tarefas concluídas</div></CardContent></Card>
    </div>
  );
}

// Timeline visual horizontal
function TimelineVisual() {
  return (
    <section className="ml-20 mb-8">
      <Card>
        <CardHeader><CardTitle>Linha do Tempo do Projeto</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 overflow-x-auto py-4">
            {/* Blocos de etapas/tarefas arrastáveis, status colorido, avatar, badges */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-8 bg-blue-200 rounded-full flex items-center justify-center font-semibold text-blue-800 mb-2">Estudos Preliminares</div>
              <div className="w-2 h-8 bg-blue-400" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-8 bg-green-200 rounded-full flex items-center justify-center font-semibold text-green-800 mb-2">Anteprojeto</div>
              <div className="w-2 h-8 bg-green-400" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-8 bg-purple-200 rounded-full flex items-center justify-center font-semibold text-purple-800 mb-2">Projeto Executivo</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// Card de próximas ações inteligente
function CardProximasAcoes() {
  return (
    <aside className="fixed right-8 top-32 w-80 z-20">
      <Card className="shadow-2xl border-blue-200">
        <CardHeader><CardTitle>Próximas Ações (IA)</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center justify-between bg-blue-50 rounded p-2">
              <span className="font-medium text-blue-700">Finalizar Briefing</span>
              <Button size="sm" variant="primary">Resolver</Button>
            </li>
            <li className="flex items-center justify-between bg-yellow-50 rounded p-2">
              <span className="font-medium text-yellow-700">Revisar Plantas</span>
              <Button size="sm" variant="outline">Ver</Button>
            </li>
            <li className="flex items-center justify-between bg-red-50 rounded p-2">
              <span className="font-medium text-red-700">Prazo Atrasado</span>
              <Button size="sm" variant="destructive">Ajustar</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}

// Chat flutuante (popover)
function ChatFlutuante() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button variant="primary" size="icon" className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center" onClick={() => setOpen(o => !o)}>
        <MessageSquare className="h-7 w-7" />
      </Button>
      {open && (
        <div className="absolute bottom-20 right-0 w-96 bg-white rounded-xl shadow-2xl border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-blue-700">Chat do Projeto</span>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Fechar</Button>
          </div>
          <div className="h-48 overflow-y-auto mb-2">/* ...mensagens... */</div>
          <div className="flex space-x-2">
            <Input placeholder="Digite sua mensagem..." className="flex-1" />
            <Button size="sm"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modo Foco Imersivo (modal)
function ModoFocoModal() {
  // Exemplo de modal, pode ser controlado por estado global
  return null;
}

// Rodapé com insights
function RodapeInsights() {
  return (
    <footer className="fixed bottom-0 left-20 right-0 bg-slate-50 border-t border-slate-200 py-2 px-8 flex items-center justify-between text-xs text-slate-600 z-10">
      <span>Produtividade: 87% • Última sincronização: 2min atrás</span>
      <span>Dica: Use o modo foco (F) para máxima concentração</span>
      <span>Status API: Online</span>
    </footer>
  );
}

export default function DashboardProdutividadeV8() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      <div className="ml-20">
        <HeaderProjeto />
        <GridCardsMetrica />
        <TimelineVisual />
      </div>
      <CardProximasAcoes />
      <ChatFlutuante />
      <ModoFocoModal />
      <RodapeInsights />
    </div>
  );
} 