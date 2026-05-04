export default function DashboardIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <line x1="3" x2="21" y1="9" y2="9"/>
          <line x1="9" x2="9" y1="21" y2="9"/>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white">Bem-vindo ao Meu Painel SaaS</h1>
      <p className="text-slate-400 max-w-md">
        Selecione um módulo no menu lateral para visualizar os indicadores da sua empresa. A arquitetura atual suporta multi-tenancy e processamento de dados via FastAPI.
      </p>
    </div>
  )
}
