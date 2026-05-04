'use client'

import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Wallet } from 'lucide-react'

// =============================================================================
//  DADOS MOCKADOS — Substituir por chamada à API FastAPI futuramente
// =============================================================================
const dadosMensais = [
  { mes: 'Jan', receita: 124000, despesa: 82000, lucro: 42000 },
  { mes: 'Fev', receita: 98000,  despesa: 75000, lucro: 23000 },
  { mes: 'Mar', receita: 145000, despesa: 91000, lucro: 54000 },
  { mes: 'Abr', receita: 132000, despesa: 88000, lucro: 44000 },
  { mes: 'Mai', receita: 167000, despesa: 95000, lucro: 72000 },
  { mes: 'Jun', receita: 159000, despesa: 102000, lucro: 57000 },
]

const dadosInadimplencia = [
  { mes: 'Jan', taxa: 3.2 },
  { mes: 'Fev', taxa: 4.1 },
  { mes: 'Mar', taxa: 2.8 },
  { mes: 'Abr', taxa: 3.5 },
  { mes: 'Mai', taxa: 2.1 },
  { mes: 'Jun', taxa: 1.9 },
]

const dadosPieComposicao = [
  { name: 'Serviços', value: 58 },
  { name: 'Produtos', value: 27 },
  { name: 'Recorrente', value: 15 },
]

// Paleta do PieChart alinhada ao tema dark
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b']

// =============================================================================
//  CARDS DE RESUMO
// =============================================================================
const cards = [
  {
    id: 'faturamento',
    label: 'Faturamento Mensal',
    value: 'R$ 159.000',
    delta: '+10,4%',
    positive: true,
    icon: DollarSign,
    iconBg: 'bg-emerald-600/15',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'lucro',
    label: 'Lucro Líquido',
    value: 'R$ 57.000',
    delta: '+20,8%',
    positive: true,
    icon: TrendingUp,
    iconBg: 'bg-blue-600/15',
    iconColor: 'text-blue-400',
  },
  {
    id: 'caixa',
    label: 'Caixa Atual',
    value: 'R$ 312.400',
    delta: '-2,1% vs mês ant.',
    positive: false,
    icon: Wallet,
    iconBg: 'bg-violet-600/15',
    iconColor: 'text-violet-400',
  },
  {
    id: 'inadimplencia',
    label: 'Inadimplência',
    value: '1,9%',
    delta: '-0,2 p.p.',
    positive: true,
    icon: AlertTriangle,
    iconBg: 'bg-amber-600/15',
    iconColor: 'text-amber-400',
  },
]

// =============================================================================
//  TOOLTIP CUSTOMIZADO — padrão dark mode
// =============================================================================
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.value > 100
            ? `R$ ${p.value.toLocaleString('pt-BR')}`
            : `${p.value}%`}
        </p>
      ))}
    </div>
  )
}

// =============================================================================
//  COMPONENTE PRINCIPAL
// =============================================================================
export default function FinanceiroVisaoGeralPage() {
  return (
    <div className="space-y-8">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Financeiro</p>
        <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
        <p className="text-slate-400 mt-1 text-sm">Resumo dos últimos 6 meses de performance financeira.</p>
      </header>

      {/* ── CARDS DE RESUMO ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              id={`card-${card.id}`}
              className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4 hover:border-slate-600/60 transition-colors"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-slate-400 text-xs font-medium truncate">{card.label}</p>
                <p className="text-white text-xl font-bold mt-0.5">{card.value}</p>
                <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.delta}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── GRÁFICO 1: BarChart — Receita vs Despesa ─────────────────────── */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-1">Receita vs Despesa</h2>
        <p className="text-slate-500 text-xs mb-6">Comparativo mensal dos últimos 6 meses</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosMensais} margin={{ top: 5, right: 20, left: 10, bottom: 5 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="mes" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="receita" name="Receita" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── GRÁFICOS 2 e 3: LineChart (Lucro) + PieChart (Composição) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LineChart — Evolução do Lucro */}
        <div className="lg:col-span-3 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Evolução do Lucro & Inadimplência</h2>
          <p className="text-slate-500 text-xs mb-6">Lucro líquido mensal vs taxa de inadimplência</p>
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosMensais.map((d, i) => ({ ...d, inadimplencia: dadosInadimplencia[i].taxa }))} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="lucro" name="Lucro" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 7 }} />
                <Line yAxisId="right" type="monotone" dataKey="inadimplencia" name="Inadimplência" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" dot={{ fill: '#f59e0b', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PieChart — Composição da Receita */}
        <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Composição da Receita</h2>
          <p className="text-slate-500 text-xs mb-4">Distribuição por origem</p>
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPieComposicao}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dadosPieComposicao.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                  formatter={(value: any) => [`${value}%`, '']}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
