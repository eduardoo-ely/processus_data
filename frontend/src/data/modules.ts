import type { Module } from '@/types'

/**
 * =============================================
 *  CONFIGURAÇÃO DOS SEUS PAINÉIS
 * =============================================
 *  Edite este arquivo para adicionar, remover ou
 *  modificar módulos e dashboards.
 *
 *  embedUrl: coloque a URL do seu dashboard aqui
 *  (Looker, Metabase, Grafana, PowerBI, etc.)
 * =============================================
 */
export const modules: Module[] = [
  {
    id: 'financeiro',
    title: 'Financeiro',
    description: 'Indicadores financeiros, receita e fluxo de caixa',
    icon: 'DollarSign',
    isActive: true,
    dashboards: [
      {
        id: 'fin-receita',
        title: 'Receita Mensal',
        embedUrl: 'https://lookerstudio.google.com/embed/reporting/exemplo',
        description: 'Visão geral de receita',
      },
      {
        id: 'fin-fluxo',
        title: 'Fluxo de Caixa',
        embedUrl: '',
        description: 'Entradas e saídas',
      },
    ],
  },
  {
    id: 'vendas',
    title: 'Vendas',
    description: 'Pipeline, conversão e performance comercial',
    icon: 'TrendingUp',
    isActive: true,
    dashboards: [
      {
        id: 'vnd-pipeline',
        title: 'Pipeline',
        embedUrl: '',
        description: 'Funil de vendas',
      },
      {
        id: 'vnd-conversao',
        title: 'Conversão',
        embedUrl: '',
        description: 'Taxa de conversão',
      },
    ],
  },
  {
    id: 'operacional',
    title: 'Operacional',
    description: 'Indicadores operacionais e de performance',
    icon: 'Settings',
    isActive: true,
    dashboards: [
      {
        id: 'ops-geral',
        title: 'Visão Geral',
        embedUrl: '',
        description: 'KPIs operacionais',
      },
    ],
  },
  {
    id: 'gerencial',
    title: 'Gerencial',
    description: 'Visão executiva e indicadores estratégicos',
    icon: 'BarChart2',
    isActive: false,
    dashboards: [],
  },
  {
    id: 'estoque',
    title: 'Estoque',
    description: 'Gestão de estoque, giro e ruptura',
    icon: 'Package',
    isActive: false,
    dashboards: [],
  },
]

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id)
}
