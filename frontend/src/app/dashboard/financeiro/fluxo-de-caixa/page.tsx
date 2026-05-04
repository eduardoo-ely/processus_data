// Página stub para Financeiro > Fluxo de Caixa
// Futuramente consumirá /api/v1/dashboard/financeiro/fluxo-de-caixa
export default function FluxoCaixaPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-3">
      <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <h1 className="text-2xl font-bold text-white">Fluxo de Caixa</h1>
      <p className="text-slate-400 text-sm">Em construção — em breve conectado à API.</p>
    </div>
  )
}
