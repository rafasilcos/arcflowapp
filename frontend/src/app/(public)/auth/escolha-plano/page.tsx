'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Building2, Users, FolderOpen } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  type: string;
  price_monthly: number;
  price_yearly: number;
  max_users: number;
  max_projects: number;
  features: Record<string, boolean>;
  savings_yearly: number;
}

interface PlanFeatures {
  [key: string]: {
    icon: any;
    label: string;
    description: string;
  };
}

const PLAN_FEATURES: PlanFeatures = {
  briefings: {
    icon: Building2,
    label: 'Briefings Estruturados',
    description: 'Sistema completo de briefings inteligentes'
  },
  basic_reports: {
    icon: FolderOpen,
    label: 'Relatórios Básicos',
    description: 'Relatórios essenciais de projeto'
  },
  reports: {
    icon: FolderOpen,
    label: 'Relatórios Avançados',
    description: 'Suite completa de relatórios'
  },
  crm: {
    icon: Users,
    label: 'CRM Integrado',
    description: 'Gestão completa de clientes'
  },
  all_features: {
    icon: Star,
    label: 'Todas as Funcionalidades',
    description: 'Acesso completo ao ArcFlow'
  },
  api_access: {
    icon: Zap,
    label: 'API Access',
    description: 'Integrações via API'
  },
  priority_support: {
    icon: Star,
    label: 'Suporte Prioritário',
    description: 'Atendimento VIP'
  },
  white_label: {
    icon: Building2,
    label: 'White Label',
    description: 'Marca própria'
  },
  custom_integrations: {
    icon: Zap,
    label: 'Integrações Customizadas',
    description: 'Desenvolvimentos sob medida'
  }
};

export default function EscolhaPlanoPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/payments/plans');
      const data = await response.json();
      
      if (response.ok) {
        setPlans(data.plans);
      } else {
        console.error('Erro ao carregar planos:', data.error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Redirecionar para página de registro com plano selecionado
    router.push(`/auth/registro?planId=${planId}&billing=${selectedBilling}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'FREE': return 'bg-gray-50 border-gray-200';
      case 'BASIC': return 'bg-blue-50 border-blue-200';
      case 'PROFESSIONAL': return 'bg-purple-50 border-purple-200 ring-2 ring-purple-300';
      case 'ENTERPRISE': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getPlanButtonColor = (type: string) => {
    switch (type) {
      case 'FREE': return 'bg-gray-600 hover:bg-gray-700';
      case 'BASIC': return 'bg-blue-600 hover:bg-blue-700';
      case 'PROFESSIONAL': return 'bg-purple-600 hover:bg-purple-700';
      case 'ENTERPRISE': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const isPlanPopular = (type: string) => type === 'PROFESSIONAL';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal para seu Escritório
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transforme sua gestão arquitetônica com a tecnologia ArcFlow
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white p-1 rounded-lg shadow-sm border">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedBilling === 'monthly'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setSelectedBilling('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedBilling === 'yearly'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                Economize até 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${getPlanColor(plan.type)} hover:shadow-lg transition-all duration-200 ${
                isPlanPopular(plan.type) ? 'scale-105' : ''
              }`}
            >
              {isPlanPopular(plan.type) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1">
                    🔥 Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.type === 'FREE' && 'Para começar e experimentar'}
                  {plan.type === 'BASIC' && 'Para escritórios pequenos'}
                  {plan.type === 'PROFESSIONAL' && 'Para escritórios em crescimento'}
                  {plan.type === 'ENTERPRISE' && 'Para grandes escritórios'}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.type === 'FREE' ? 'Grátis' : formatPrice(
                      selectedBilling === 'yearly' ? plan.price_yearly : plan.price_monthly
                    )}
                  </div>
                  {plan.type !== 'FREE' && (
                    <div className="text-sm text-gray-600">
                      {selectedBilling === 'yearly' ? '/ano' : '/mês'}
                      {selectedBilling === 'yearly' && plan.savings_yearly > 0 && (
                        <div className="text-green-600 font-semibold">
                          Economize {plan.savings_yearly}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Limits */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Até {plan.max_users} usuários</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FolderOpen className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Até {plan.max_projects} projetos</span>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Features */}
                <div className="space-y-2">
                  {Object.entries(plan.features).map(([key, enabled]) => {
                    if (!enabled) return null;
                    const feature = PLAN_FEATURES[key];
                    if (!feature) return null;

                    const Icon = feature.icon;
                    return (
                      <div key={key} className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        <span>{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${getPlanButtonColor(plan.type)} text-white`}
                  size="lg"
                >
                  {plan.type === 'FREE' ? 'Começar Grátis' : 'Escolher Plano'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Todos os planos incluem suporte 24/7 e atualizações gratuitas
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              Sem taxa de setup
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              Cancele a qualquer momento
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              30 dias de garantia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 