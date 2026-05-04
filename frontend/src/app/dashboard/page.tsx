'use client'

import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, DollarSign, Users, Database, PieChart } from 'lucide-react'

// =============================================================================
//  DADOS MOCKADOS (Baseado na Imagem)
// =============================================================================
const revenueData = [
  { mes: 'Jan', actual: 0.1, target: 0.2 },
  { mes: 'Fev', actual: 0.3, target: 0.45 },
  { mes: 'Mar', actual: 0.6, target: 0.7 },
  { mes: 'Apr', actual: 0.8, target: 0.9 },
  { mes: 'May', actual: 1.15, target: 1.35 },
  { mes: 'Jun', actual: null, target: 1.6 },
]

const industryData = [
  { name: 'Technology', value: 64 },
  { name: 'Finance', value: 52 },
  { name: 'Healthcare', value: 45 },
  { name: 'Retail', value: 38 },
  { name: 'Manufacturing', value: 29 },
]

const recentProjects = [
  { project: 'Project Pronet 1', client: 'Salesforce', status: 'Active', statusColor: 'text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/10', update: 'Jan 10, 2023' },
  { project: 'Project Pronet 2', client: 'Finance', status: 'Completed', statusColor: 'text-[#38ef7d] border-[#38ef7d]/30 bg-[#38ef7d]/10', update: 'Jan 19, 2023' },
  { project: 'Project Pronet 3', client: 'clientT', status: 'Active', statusColor: 'text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/10', update: 'Jan 27, 2023' },
]

const connectivity = [
  { name: 'Salesforce', status: 'Healthy', color: 'bg-[#38ef7d]', iconUrl: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg' },
  { name: 'Snowflake', status: 'Active', color: 'bg-[#00f2fe]', iconUrl: 'https://cdn.worldvectorlogo.com/logos/snowflake-2.svg' },
  { name: 'GA4', status: 'Active', color: 'bg-[#00f2fe]', iconUrl: 'https://cdn.worldvectorlogo.com/logos/google-analytics-4.svg' },
  { name: 'HubSpot', status: 'Healthy', color: 'bg-[#38ef7d]', iconUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot-1.svg' },
]

// Mini charts data
const miniChartData = [
  { v: 10 }, { v: 25 }, { v: 15 }, { v: 30 }, { v: 20 }, { v: 45 }, { v: 40 }
]

// =============================================================================
//  COMPONENTES REUTILIZÁVEIS
// =============================================================================
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#161a22] border border-[#2a3441] rounded-2xl p-5 ${className}`}>
    {children}
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#181b21] border border-[#2a3441] rounded-lg px-3 py-2 shadow-2xl text-xs">
      <p className="text-[#9ca3af] mb-1 font-medium text-[10px] uppercase">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.name === 'Actual Revenue' || p.name === 'Target' ? `$${p.value}M` : p.value}
        </p>
      ))}
    </div>
  )
}

// =============================================================================
//  PAGE COMPONENT
// =============================================================================
export default function DashboardOverview() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* ── 1. KPI CARDS ROW ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Revenue */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#9ca3af] text-sm font-medium">Total Revenue</span>
            <div className="p-1.5 bg-[#1f2937] rounded-md"><DollarSign className="w-4 h-4 text-[#9ca3af]" /></div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">$1.48M</h2>
              <p className="text-[#38ef7d] text-xs font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +12.6%
              </p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartData}>
                  <Line type="monotone" dataKey="v" stroke="#00f2fe" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Card 2: Clients */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#9ca3af] text-sm font-medium">Active Clients</span>
            <div className="p-1.5 bg-[#1f2937] rounded-md"><Users className="w-4 h-4 text-[#9ca3af]" /></div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">184</h2>
              <p className="text-[#38ef7d] text-xs font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +5.2%
              </p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartData}>
                  <Line type="monotone" dataKey="v" stroke="#00f2fe" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Card 3: Data Volume */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#9ca3af] text-sm font-medium">Data Volume</span>
            <div className="p-1.5 bg-[#1f2937] rounded-md"><Database className="w-4 h-4 text-[#9ca3af]" /></div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">2.1 TB</h2>
              <p className="text-[#38ef7d] text-xs font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +18%
              </p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={miniChartData}>
                  <Bar dataKey="v" fill="#38ef7d" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Card 4: Retention */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#9ca3af] text-sm font-medium">Project Retention</span>
            <div className="p-1.5 bg-[#1f2937] rounded-md"><PieChart className="w-4 h-4 text-[#9ca3af]" /></div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">94%</h2>
              <p className="text-[#38ef7d] text-xs font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +3%
              </p>
            </div>
            <div className="w-20 h-10 flex items-end gap-1">
              {[15, 25, 20, 35, 30, 40].map((v, i) => (
                <div key={i} className="w-1.5 bg-[#00f2fe] rounded-t-sm" style={{ height: `${v}px` }}></div>
              ))}
            </div>
          </div>
        </Card>

      </div>

      {/* ── 2. CHARTS ROW ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Monthly Revenue & Pipeline */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold text-lg">Monthly Revenue & Pipeline</h3>
            <button className="text-[#6b7280] hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3441" />
                <XAxis dataKey="mes" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="actual" name="Actual Revenue" stroke="#00f2fe" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6, fill: '#161a22', stroke: '#00f2fe', strokeWidth: 3 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#38ef7d" strokeWidth={2} dot={false} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart: Client Growth by Industry */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold text-lg">Client Growth by Industry</h3>
            <button className="text-[#6b7280] hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38ef7d" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3441" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#1f2937', opacity: 0.4 }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                  label={{ position: 'top', fill: '#fff', fontSize: 12, fontWeight: 600, dy: -6 }}
                  style={{ filter: 'url(#glow)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── 3. LISTS ROW ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table: Recent Project Activity */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold text-lg">Recent Project Activity</h3>
            <button className="text-[#6b7280] hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[#9ca3af] border-b border-[#2a3441]">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Team</th>
                  <th className="pb-3 font-medium text-right">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3441]">
                {recentProjects.map((item, i) => (
                  <tr key={i} className="group hover:bg-[#1f2937]/30 transition-colors">
                    <td className="py-4 text-white font-medium">{item.project}</td>
                    <td className="py-4 text-[#9ca3af]">{item.client}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex -space-x-2">
                        <img src="https://i.pravatar.cc/100?img=12" className="w-7 h-7 rounded-full border-2 border-[#161a22]" alt="Team" />
                        <img src="https://i.pravatar.cc/100?img=33" className="w-7 h-7 rounded-full border-2 border-[#161a22]" alt="Team" />
                        <img src="https://i.pravatar.cc/100?img=44" className="w-7 h-7 rounded-full border-2 border-[#161a22]" alt="Team" />
                      </div>
                    </td>
                    <td className="py-4 text-right text-[#9ca3af]">{item.update}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* List: Data Connectivity Status */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold text-lg">Data Connectivity Status</h3>
            <button className="text-[#6b7280] hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="space-y-0">
            {connectivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-[#2a3441] last:border-0 group hover:bg-[#1f2937]/20 -mx-5 px-5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1f2937] flex items-center justify-center p-1.5">
                    {/* Placeholder div as image fallback */}
                    <div className="w-4 h-4 bg-[#6b7280] rounded-sm opacity-50"></div>
                  </div>
                  <span className="text-white font-medium text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-[#38ef7d] text-xs font-semibold">{item.status}</span>
                  </div>
                  <span className="text-[#6b7280] text-xs">Sync Time</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
