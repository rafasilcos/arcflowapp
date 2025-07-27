export interface Reuniao {
  id: string;
  clienteId: string;
  projetoId?: string;
  tipo: 'briefing' | 'apresentacao' | 'outro';
  data: string;
  local: string;
  participantes: ParticipanteReuniao[];
  observacoes?: string;
  status: 'agendada' | 'realizada' | 'cancelada';
}

export interface ParticipanteReuniao {
  nome: string;
  email?: string;
  papel?: string;
} 