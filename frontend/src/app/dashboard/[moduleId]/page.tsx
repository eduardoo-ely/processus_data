'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getModuleById } from '@/data/modules'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Loader2, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const params = useParams()
  const moduleId = params.moduleId as string
  const moduleData = getModuleById(moduleId)
  
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fazemos a chamada para o nosso novo backend em FastAPI
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        
        const response = await fetch(`${apiUrl}/api/v1/dashboard/financeiro`, {
          headers: {
            'X-Tenant-ID': '11111111-1111-1111-1111-111111111111' // Isolamento multi-tenant pelo Header usando UUID
          }
        })
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do servidor SaaS.')
        }
        
        const result = await response.json()
        setData(result)
      } catch (err: any) {
        setError(err.message || 'Erro de conexão com a API.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [moduleId])

  if (!moduleData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Módulo não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">{moduleData.title}</h1>
        <p className="text-slate-400 mt-1">{moduleData.description}</p>
      </header>

      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">Visão Geral de Dados (Recharts + FastAPI)</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[400px] text-red-400 gap-2">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="receita" name="Receita" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="custo" name="Custo" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
