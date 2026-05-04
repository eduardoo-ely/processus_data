'use client'

import { useState } from 'react'
import { Server, Table, Link2, CheckCircle2, AlertCircle } from 'lucide-react'

// Mock para a lista de tenants (viria do PostgreSQL)
const MOCK_TENANTS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Demo Corp SaaS' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Acme Ltda' }
]

export default function TenantSetupPage() {
  const [selectedTenant, setSelectedTenant] = useState(MOCK_TENANTS[0].id)
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [sheetName, setSheetName] = useState('Página1')
  
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleTestConnection = async () => {
    if (!spreadsheetId) {
      setErrorMessage('O ID da planilha é obrigatório.')
      setTestStatus('error')
      return
    }

    setTestStatus('testing')
    setErrorMessage('')

    try {
      // Simula o back-end validando a conexão e o schema
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulação: se o ID terminar em 'erro', falha.
      if (spreadsheetId.endsWith('erro')) {
        throw new Error('As colunas canônicas (data, receita, custo) não foram encontradas na planilha.')
      }

      setTestStatus('success')
    } catch (err: any) {
      setTestStatus('error')
      setErrorMessage(err.message || 'Falha ao conectar. Verifique as permissões da planilha.')
    }
  }

  const handleSave = () => {
    if (testStatus !== 'success') {
      alert('Por favor, teste a conexão com sucesso antes de salvar.')
      return
    }
    alert('Conexão com Google Sheets salva no PostgreSQL!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      <header className="border-b border-slate-700/50 pb-6">
        <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
          <Server className="w-3 h-3" /> Torre de Controle
        </p>
        <h1 className="text-3xl font-bold text-white">Setup de Conexão (Google Sheets)</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Vincule uma fonte de dados isolada para cada Tenant.
        </p>
      </header>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
        
        {/* 1. SELEÇÃO DE TENANT */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tenant (Cliente)</label>
          <select 
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {MOCK_TENANTS.map(t => (
              <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2">
            O `tenant_id` será usado estritamente no back-end para isolar o `spreadsheet_id`.
          </p>
        </div>

        <div className="border-t border-slate-700/50 my-6"></div>

        {/* 2. DADOS DA PLANILHA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Link2 className="w-4 h-4 text-emerald-400" /> Spreadsheet ID
            </label>
            <input 
              type="text" 
              value={spreadsheetId}
              onChange={(e) => {
                setSpreadsheetId(e.target.value)
                setTestStatus('idle')
              }}
              placeholder="Ex: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              A planilha precisa estar com visibilidade "Qualquer pessoa com o link".
            </p>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Table className="w-4 h-4 text-emerald-400" /> Nome da Aba
            </label>
            <input 
              type="text" 
              value={sheetName}
              onChange={(e) => {
                setSheetName(e.target.value)
                setTestStatus('idle')
              }}
              placeholder="Ex: Página1"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 3. TESTE DE CONEXÃO E FEEDBACK */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleTestConnection}
            disabled={testStatus === 'testing' || !spreadsheetId}
            className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {testStatus === 'testing' ? 'Testando Conexão...' : 'Testar Conexão'}
          </button>
          
          <button 
            onClick={handleSave}
            disabled={testStatus !== 'success'}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Salvar DataSource
          </button>
        </div>

        {/* Feedback visual do teste */}
        {testStatus === 'success' && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <h4 className="text-emerald-400 font-medium">Conexão Bem-Sucedida!</h4>
              <p className="text-emerald-400/80 text-sm mt-1">O back-end conseguiu ler a planilha e validou o schema canônico (data, receita, custo).</p>
            </div>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-medium">Erro de Validação</h4>
              <p className="text-red-400/80 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
