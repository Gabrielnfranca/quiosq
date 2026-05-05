const fs = require('fs');

const FIX_CODE = `import { useState, useEffect } from 'react';
import { BellRing, CheckCircle2, Clock, Users, Coffee, ChefHat, AlertCircle, X, Receipt } from 'lucide-react';
import { toast } from 'sonner';

type MesaStatus = 'livre' | 'ocupada' | 'chamando' | 'pronto';

interface Mesa {
  id: string;
  numero: string;
  status: MesaStatus;
  cliente?: string;
  tempo?: string;
  pedidos?: number;
  valor?: number;
}

const MOCK_MESAS: Mesa[] = [
  { id: '1', numero: '10', status: 'ocupada', cliente: 'Gabriel', tempo: '45m', pedidos: 3, valor: 85.50 },
  { id: '2', numero: '11', status: 'chamando', cliente: 'Amanda', tempo: '12m', pedidos: 1, valor: 25.00 },
  { id: '3', numero: '12', status: 'livre' },
  { id: '4', numero: '14', status: 'pronto', cliente: 'Lucas', tempo: '30m', pedidos: 4, valor: 142.90 },
  { id: '5', numero: '15', status: 'ocupada', cliente: 'Marcos', tempo: '1h 10m', pedidos: 6, valor: 310.00 },
  { id: '6', numero: '16', status: 'livre' },
  { id: '7', numero: '17', status: 'chamando', cliente: 'Camila', tempo: '5m', pedidos: 0, valor: 0 },
  { id: '8', numero: '18', status: 'livre' },
];

export default function GarcomDashboard() {
  const [filtro, setFiltro] = useState<MesaStatus | 'todas'>('todas');
  const [mesas, setMesas] = useState<Mesa[]>(MOCK_MESAS);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);

  const mesasFiltradas = mesas.filter(m => filtro === 'todas' || m.status === filtro);

  const handleAtender = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMesas(prev => prev.map(m => m.id === id ? { ...m, status: 'ocupada' } : m));
    setMesaSelecionada(null);
    toast.success('Mesa atendida com sucesso!', {
      style: { background: '#10b981', color: 'white', border: 'none' }
    });
  };

  const handleEntregarPedido = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMesas(prev => prev.map(m => m.id === id ? { ...m, status: 'ocupada' } : m));
    setMesaSelecionada(null);
    toast.success('Pedido entregue!', {
      style: { background: '#10b981', color: 'white', border: 'none' }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-6">
      {/* HEADER ESPECÍFICO DO GARÇOM */}
      <header className="bg-slate-900 text-white pt-safe sticky top-0 z-10 shadow-md">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[#FFCC00] font-black text-2xl tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-titulo)' }}>
              QUIOSQ <span className="text-slate-900 bg-[#FFCC00] text-sm px-2 py-0.5 rounded-md">GARÇOM</span>
            </h1>
            <p className="text-slate-300 text-sm font-medium mt-1">Olá, João • Setor Praia</p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center relative shadow-sm border border-slate-700">
            <BellRing className="text-[#FFCC00] w-6 h-6" />
            {mesas.filter(m => m.status === 'chamando').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900 border-solid">
                {mesas.filter(m => m.status === 'chamando').length}
              </span>
            )}
          </div>
        </div>
        
        {/* FILTROS RÁPIDOS */}
        <div className="flex gap-2 px-5 pb-5 overflow-x-auto hide-scrollbar mt-2">
          <button 
            onClick={() => setFiltro('todas')}
            className={\`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all \${filtro === 'todas' ? 'bg-[#FFCC00] text-slate-900' : 'bg-slate-800 text-slate-300'}\`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFiltro('chamando')}
            className={\`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 \${filtro === 'chamando' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'}\`}
          >
            {filtro !== 'chamando' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
            Chamados
          </button>
          <button 
            onClick={() => setFiltro('pronto')}
            className={\`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 \${filtro === 'pronto' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'}\`}
          >
            {filtro !== 'pronto' && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
            Retirar Pedido
          </button>
          <button 
            onClick={() => setFiltro('ocupada')}
            className={\`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 \${filtro === 'ocupada' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300'}\`}
          >
            Ocupadas
          </button>
        </div>
      </header>

      {/* GRID DE MESAS */}
      <main className="flex-1 p-4 sm:p-5 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {mesasFiltradas.map((mesa) => (
            <button 
              key={mesa.id}
              onClick={() => mesa.status !== 'livre' && setMesaSelecionada(mesa)}
              className={\`relative p-4 sm:p-5 rounded-2xl flex flex-col items-start text-left transition-transform active:scale-95 border-2 \${mesa.status === 'livre' ? 'bg-transparent border-dashed border-slate-300 text-slate-400 cursor-default' : 'cursor-pointer'} \${mesa.status === 'ocupada' ? 'bg-white border-slate-100 shadow-sm text-slate-800' : ''} \${mesa.status === 'chamando' ? 'bg-red-50 border-red-500 shadow-md text-red-950 animate-in zoom-in duration-300' : ''} \${mesa.status === 'pronto' ? 'bg-slate-900 border-slate-900 shadow-md text-white' : ''}\`}
            >
              {/* Notificação/Badge Pulse para Chamados */}
              {(mesa.status === 'chamando' || mesa.status === 'pronto') && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className={\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \${mesa.status === 'chamando' ? 'bg-red-400' : 'bg-blue-400'}\`}></span>
                  <span className={\`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid \${mesa.status === 'chamando' ? 'bg-red-500' : 'bg-blue-500'}\`}></span>
                </span>
              )}

              <div className="flex items-center justify-between w-full mb-3">
                <span className="font-black text-2xl sm:text-3xl tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>{mesa.numero}</span>
                
                {mesa.status === 'livre' && <Coffee className="w-6 h-6 opacity-40" />}
                {mesa.status === 'ocupada' && <Users className="w-6 h-6 text-slate-400" />}
                {mesa.status === 'chamando' && <AlertCircle className="w-7 h-7 text-red-600 animate-pulse" />}
                {mesa.status === 'pronto' && <ChefHat className="w-7 h-7 text-[#FFCC00]" />}
              </div>

              {mesa.status !== 'livre' ? (
                <>
                  <p className={\`font-bold text-sm line-clamp-1 \${mesa.status === 'chamando' ? 'text-red-900' : 'text-slate-600'} \${mesa.status === 'pronto' ? 'text-slate-300' : ''}\`}>
                    {mesa.cliente}
                  </p>
                  <div className={\`flex items-center justify-between w-full mt-2 \${mesa.status === 'pronto' ? 'text-slate-400' : 'text-slate-500'}\`}>
                    <div className={\`flex items-center gap-1 text-xs font-semibold \${mesa.status === 'chamando' ? 'text-red-700/80 animate-pulse' : ''}\`}>
                      <Clock className="w-3.5 h-3.5" />
                      {mesa.tempo}
                    </div>
                  </div>
                  
                  {mesa.status === 'chamando' && (
                    <div 
                      onClick={(e) => handleAtender(mesa.id, e)}
                      className="mt-4 w-full bg-red-600 text-white text-[11px] font-extrabold uppercase py-2 rounded-xl text-center tracking-wider shadow-sm hover:bg-red-700"
                    >
                      Atender
                    </div>
                  )}
                  {mesa.status === 'pronto' && (
                    <div 
                      onClick={(e) => handleEntregarPedido(mesa.id, e)}
                      className="mt-4 w-full bg-[#FFCC00] text-slate-900 text-[11px] font-extrabold uppercase py-2 rounded-xl text-center tracking-wider shadow-sm hover:bg-[#e6b800]"
                    >
                      Entregar
                    </div>
                  )}
                </>
              ) : (
                <p className="font-bold text-sm mt-auto opacity-70">Livre</p>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* DRAWER DA MESA SELECIONADA */}
      {mesaSelecionada && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMesaSelecionada(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-5 animate-slide-in sm:max-w-md sm:mx-auto sm:h-[100dvh] sm:right-0 sm:left-auto sm:rounded-none">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-1" style={{ fontFamily: 'var(--font-titulo)' }}>
                  <span className="w-2 h-7 bg-[#FFCC00] rounded-full inline-block"></span>
                  Mesa {mesaSelecionada.numero}
                </h2>
                <p className="text-slate-500 font-medium">Atendendo: {mesaSelecionada.cliente}</p>
              </div>
              <button 
                onClick={() => setMesaSelecionada(null)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                style={{ flexShrink: 0 }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <Receipt className="w-5 h-5" />
                  <span className="font-semibold">Total da Comanda</span>
                </div>
                <span className="font-black text-lg text-slate-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mesaSelecionada.valor || 0)}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <ChefHat className="w-5 h-5" />
                  <span className="font-semibold">Pedidos Abertos</span>
                </div>
                <span className="font-black text-lg text-slate-900">{mesaSelecionada.pedidos} itens</span>
              </div>
            </div>

            {mesaSelecionada.status === 'chamando' && (
              <button 
                onClick={(e) => handleAtender(mesaSelecionada.id, e)}
                className="w-full bg-red-600 text-white font-extrabold p-4 rounded-2xl uppercase tracking-wider active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <CheckCircle2 className="w-6 h-6" />
                Confirmar Atendimento
              </button>
            )}

            {mesaSelecionada.status === 'pronto' && (
              <button 
                onClick={(e) => handleEntregarPedido(mesaSelecionada.id, e)}
                className="w-full bg-[#FFCC00] text-slate-900 font-extrabold p-4 rounded-2xl uppercase tracking-wider active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-[#FFCC00]/30"
              >
                <ChefHat className="w-6 h-6" />
                Confirmar Entrega
              </button>
            )}

          </div>
        </>
      )}
    </div>
  );
}
`;

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', FIX_CODE, 'utf8');
