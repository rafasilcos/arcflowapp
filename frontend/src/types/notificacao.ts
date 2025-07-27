export interface Notificacao {
  id: string;
  destinatario: string;
  titulo: string;
  mensagem: string;
  dataEnvio: string;
  lida: boolean;
  tipo: 'sistema' | 'projeto' | 'reuniao' | 'financeiro';
} 