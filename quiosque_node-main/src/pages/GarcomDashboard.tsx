import { useState } from 'react';
import { BellRing, CheckCircle2, Clock, Users, Coffee, ChefHat, AlertCircle } from 'lucide-react';

type MesaStatus = 'livre' | 'ocupada' | 'chamando' | 'pronto';

interface Mesa {
  id: string;
  numero: string;
  status: MesaStatus;
  cliente?: string;
  tempo?: string;
  notificacoes?: number;
}

const MOCK_MESAS: Mesa[] = [
  { id: '1', numero: '10', status: 'ocupada', cliente: 'Gabriel', tempo: '45m' },
  { id: '2', numero: '11', status: 'chamando', cliente: 'Amanda', tempo: '12m', notificacoes: 1 },
  { id: '3', numero: '12', status: 'livre' },
  { id: '4', numero: '14', status: 'pronto', cliente: 'Lucas', tempo: '30m' },
  { id: '5', numero: '15', status: 'ocupada', cliente: 'Marcos', tempo: '1h 10m' },
  { id: '6', numero: '16', status: 'livre' },
];

export default function GarcomDashboard() {
  const [filtro, setFiltro] = useState<MesaStatus | 'todas'>('todas');

  const mesasFiltradas = MOCK_MESAS.filter(m => filtro === 'todas' || m.status === filtro);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER ESPECÍFICO DO GARÇOM */}
      <header className="bg-slate-900 text-white pt-safe">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[#FFCC00] font-black text-2xl tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>
              QUIOSQ <span className="text-white text-lg px-2">GARÇOM</span>
            </h1>
            <p className="text-slate-300 text-sm font-semibold mt-0.5">Olá, João • Setor Praia</p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center relative shadow-sm border border-slate-700">
            <BellRing className="text-[#FFCC00] w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900">
              2
            </span>
          </div>
        </div>
        
        {/* FILTROS RÁPIDOS */}
        <div className="flex gap-2 px-5 pb-5 overflow-x-auto hide-scrollbar mt-2">
          <button 
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filtro === 'todas' ? 'bg-[#FFCC00] text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Todas as Mesas
          </button>
          <button 
            onClick={() => setFiltro('chamando')}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'chamando' ? 'bg-[#FFCC00] text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Chamados
          </button>
          <button 
            onClick={() => setFiltro('pronto')}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'pronto' ? 'bg-[#FFCC00] text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Retirar Pedido
          </button>
        </div>
      </header>

      {/* GRID DE MESAS */}
      <main className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {mesasFiltradas.map((mesa) => (
            <button 
              key={mesa.id}
              className={`
                relative p-4 rounded-2xl flex flex-col items-start text-left transition-transform active:scale-95 border-2
                ${mesa.status === 'livre' ? 'bg-transparent border-dashed border-slate-300 text-slate-400' : ''}
                ${mesa.status === 'ocupada' ? 'bg-white border-slate-100 shadow-sm text-slate-800' : ''}
                ${mesa.status === 'chamando' ? 'bg-[#FFCC00] border-[#FFCC00] shadow-md text-slate-900 animate-in zoom-in duration-300' : ''}
                ${mesa.status === 'pronto' ? 'bg-slate-800 border-slate-800 shadow-md text-white' : ''}
              `}
            >
              {/* Notificação/Badge Pulse para Chamados */}
              {(mesa.status === 'chamando' || mesa.status === 'pronto') && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === 'chamando' ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white ${mesa.status === 'chamando' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                </span>
              )}

              <div className="flex items-center justify-between w-full mb-3">
                <span className="font-black text-2xl tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>{mesa.numero}</span>
                
                {mesa.status === 'livre' && <Coffee className="w-5 h-5 opacity-40" />}
                {mesa.status === 'ocupada' && <Users className="w-5 h-5 text-slate-400" />}
                {mesa.status === 'chamando' && <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />}
                {mesa.status === 'pronto' && <ChefHat className="w-6 h-6 text-[#FFCC00]" />}
              </div>

              {mesa.status !== 'livre' ? (
                <>
                  <p className={`font-bold text-sm line-clamp-1 ${mesa.status === 'pronto' ? 'text-slate-200' : 'text-slate-600'} ${mesa.status === 'chamando' && 'text-slate-800'}`}>
                    {mesa.cliente}
                  </p>
                  <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${mesa.status === 'pronto' ? 'text-[#FFCC00]' : 'text-slate-400'} ${mesa.status === 'chamando' && 'text-red-700'}`}>
                    <Clock className="w-3 h-3" />
                    {mesa.tempo}
                  </div>
                  
                  {mesa.status === 'chamando' && (
                    <div className="mt-3 w-full bg-red-600 text-white text-[10px] font-extrabold uppercase py-1.5 rounded-lg text-center tracking-wider">
                      Atender Mesa
                    </div>
                  )}
                  {mesa.status === 'pronto' && (
                    <div className="mt-3 w-full bg-[#FFCC00] text-slate-900 text-[10px] font-extrabold uppercase py-1.5 rounded-lg text-center tracking-wider">
                      Buscar Pedido
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
    </div>
  );
}
