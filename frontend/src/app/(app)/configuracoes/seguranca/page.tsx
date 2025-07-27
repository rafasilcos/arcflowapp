'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../../../../contexts/ThemeContext';

const ConfiguracaoSegurancaPage: React.FC = () => {
  const { temaId } = useTheme();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/configuracoes">
          <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            temaId === 'elegante'
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              : 'bg-white/10 hover:bg-white/20 text-white/70'
          }`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          temaId === 'elegante' 
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg' 
            : 'bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg'
        }`}>
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
            Configurações de Segurança
          </h1>
          <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
            Configure políticas de segurança, backup e privacidade
          </p>
        </div>
      </div>
      
      {/* Conteúdo */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
          temaId === 'elegante'
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="text-center">
          <Shield className={`w-16 h-16 mx-auto mb-4 ${
            temaId === 'elegante' ? 'text-gray-300' : 'text-white/30'
          }`} />
          <h2 className={`text-xl font-bold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
            🔐 Configurações de Segurança
          </h2>
          <p className={`mb-6 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
            Esta página será implementada na próxima versão do sistema
          </p>
          
          <div className={`max-w-md mx-auto p-4 rounded-lg border ${
            temaId === 'elegante' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'
          }`}>
            <h4 className={`font-semibold mb-3 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Funcionalidades Planejadas:
            </h4>
            <ul className={`text-sm text-left space-y-2 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              <li>• Políticas de senha avançadas</li>
              <li>• Autenticação de dois fatores (MFA)</li>
              <li>• Configurações de backup automático</li>
              <li>• Logs de auditoria e acesso</li>
              <li>• Compliance com LGPD</li>
              <li>• Termos de uso e privacidade</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfiguracaoSegurancaPage; 