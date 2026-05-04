export default function PipelinePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-3">
      <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <h1 className="text-2xl font-bold text-white">Pipeline de Vendas</h1>
      <p className="text-slate-400 text-sm">Em construção — em breve conectado à API.</p>
    </div>
  )
}
