'use client'

import { useState } from 'react'
import { 
  Settings, Database, LayoutTemplate, Save, 
  Users, Plus, Trash2, Check, ArrowRight 
} from 'lucide-react'

// =============================================================================
//  DADOS MOCKADOS (Até a API de Admin ser conectada)
// =============================================================================
const MOCK_TENANTS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Demo Corp SaaS' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Acme Ltda' }
]

const CANONICAL_COLUMNS = ['data', 'receita', 'custo']
const AVAILABLE_MODULES = [
  { id: 'financeiro', name: 'Financeiro' },
  { id: 'vendas', name: 'Vendas' },
  { id: 'operacional', name: 'Operacional' },
  { id: 'rh', name: 'RH' },
  { id: 'diretoria', name: 'Diretoria' }
]

export default function AdminConfigPage() {
  const [selectedTenant, setSelectedTenant] = useState(MOCK_TENANTS[0].id)
  
  // Estado local para o "De-Para" de colunas
  const [mappings, setMappings] = useState([
    { raw: 'Faturamento Bruto', canonical: 'receita' },
    { raw: 'Custo Total', canonical: 'custo' },
    { raw: 'Data Competência', canonical: 'data' }
  ])

  // Estado local para os módulos ativos
  const [activeModules, setActiveModules] = useState(['financeiro', 'vendas'])

  // Estado para UX de Salvamento
  const [isSaving, setIsSaving] = useState(false)

  // Handlers
  const handleAddMapping = () => {
    setMappings([...mappings, { raw: '', canonical: '' }])
  }

  const handleRemoveMapping = (index: number) => {
    const newMappings = [...mappings]
    newMappings.splice(index, 1)
    setMappings(newMappings)
  }

  const handleUpdateMapping = (index: number, field: 'raw' | 'canonical', value: string) => {
    const newMappings = [...mappings]
    newMappings[index][field] = value
    setMappings(newMappings)
  }

  const handleToggleModule = (moduleId: string) => {
    setActiveModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSaving(false)
    alert('Configurações salvas com sucesso!')
  }

  const activeTenantName = MOCK_TENANTS.find(t => t.id === selectedTenant)?.name

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-700/50 pb-6">
        <div>
          <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
            <Settings className="w-3 h-3" /> Torre de Controle
          </p>
          <h1 className="text-3xl font-bold text-white">Configurações do Processus</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Gerencie Tenants, mapeamentos de dados e ative módulos dinamicamente.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <span className="animate-pulse">Salvando...</span> : <><Save className="w-4 h-4" /> Salvar Alterações</>}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        
        {/* ── COLUNA ESQUERDA: LISTA DE TENANTS ───────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Tenants Ativos</h2>
          </div>
          
          <div className="space-y-2">
            {MOCK_TENANTS.map(tenant => (
              <button
                key={tenant.id}
                onClick={() => setSelectedTenant(tenant.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedTenant === tenant.id
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/40'
                }`}
              >
                <div className="font-medium truncate">{tenant.name}</div>
                <div className="text-[10px] text-slate-500 truncate mt-1 font-mono">{tenant.id}</div>
              </button>
            ))}
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-colors text-sm">
            <Plus className="w-4 h-4" /> Novo Tenant
          </button>
        </div>

        {/* ── COLUNA DIREITA: CONFIGURAÇÕES DO TENANT ────────────────────── */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Configurando: <span className="text-blue-400">{activeTenantName}</span>
            </h3>
            <p className="text-slate-400 text-sm mt-1">ID: {selectedTenant}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* 1. MAPEAMENTO DE DADOS (DE-PARA) */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-700/50 bg-slate-800/80">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Mapeamento (De-Para)</h3>
                </div>
                <p className="text-slate-400 text-xs">Vincule as colunas do CSV do cliente às nossas métricas canônicas.</p>
              </div>
              
              <div className="p-5 flex-1">
                <div className="space-y-3">
                  {mappings.map((mapping, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={mapping.raw}
                          onChange={(e) => handleUpdateMapping(idx, 'raw', e.target.value)}
                          placeholder="Ex: Faturamento Bruto"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <div className="flex-1">
                        <select 
                          value={mapping.canonical}
                          onChange={(e) => handleUpdateMapping(idx, 'canonical', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {CANONICAL_COLUMNS.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => handleRemoveMapping(idx)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Remover mapeamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handleAddMapping}
                  className="mt-4 flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Adicionar Coluna
                </button>
              </div>
            </div>

            {/* 2. MÓDULOS ATIVOS */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-700/50 bg-slate-800/80">
                <div className="flex items-center gap-2 mb-1">
                  <LayoutTemplate className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Módulos do Painel</h3>
                </div>
                <p className="text-slate-400 text-xs">Defina quais módulos estarão visíveis no menu deste cliente.</p>
              </div>
              
              <div className="p-5 flex-1 flex flex-col gap-3">
                {AVAILABLE_MODULES.map(module => {
                  const isActive = activeModules.includes(module.id)
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleToggleModule(module.id)}
                      className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all ${
                        isActive 
                          ? 'bg-purple-600/10 border-purple-500/40' 
                          : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <span className={`font-medium ${isActive ? 'text-purple-300' : 'text-slate-400'}`}>
                        {module.name}
                      </span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isActive 
                          ? 'bg-purple-500 border-purple-500 text-white' 
                          : 'border-slate-600 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
