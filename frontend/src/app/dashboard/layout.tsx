'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Overlay para mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Container da Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 lg:static
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar 
          collapsed={collapsed} 
          mobileOpen={mobileOpen}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header para Mobile */}
        <div className="lg:hidden p-4 border-b border-slate-700/50 flex items-center justify-between">
          <span className="font-semibold text-white">Meu Painel SaaS</span>
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 bg-slate-800 rounded-lg"
          >
            ☰
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
