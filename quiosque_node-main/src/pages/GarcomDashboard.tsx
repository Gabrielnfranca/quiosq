import { useState, useEffect, useRef } from 'react';
import { BellRing, CheckCircle2, Clock, Users, Coffee, ChefHat, AlertCircle, X, Receipt } from 'lucide-react';
import { toast } from 'sonner';

type MesaStatus = 'livre' | 'ocupada' | 'aguardando' | 'chamando' | 'pronto';

interface Mesa {
  id: string;
  numero: string;
  status: MesaStatus;
  clientes: { id: string, nome: string }[];
  tempo?: string;
  pedidos?: number;
  valor?: number;
  itens?: { nome: string; qtd: number; clienteId: string }[];
}

const MOCK_MESAS: Mesa[] = [
  { 
    id: '1', 
    numero: '10', 
    status: 'ocupada', 
    clientes: [{id: 'c1', nome: 'Gabriel'}], 
    tempo: '45m', 
    pedidos: 3, 
    valor: 85.50, 
    itens: [
      {qtd: 2, nome: 'Caipirinha', clienteId: 'c1'}, 
      {qtd: 1, nome: 'Porção de Fritas', clienteId: 'c1'}
    ] 
  },
  { 
    id: '2', 
    numero: '11', 
    status: 'chamando', 
    clientes: [{id: 'c2', nome: 'Amanda'}], 
    tempo: '12m', 
    pedidos: 1, 
    valor: 25.00 
  },
  { 
    id: '3', 
    numero: '12', 
    status: 'aguardando', 
    clientes: [{id: 'c3', nome: 'Rafael'}, {id: 'c4', nome: 'João'}, {id: 'c5', nome: 'Maria'}], 
    tempo: '5m', 
    pedidos: 5, 
    valor: 120.00, 
    itens: [
      {qtd: 1, nome: 'Isca de Peixe', clienteId: 'c3'}, 
      {qtd: 2, nome: 'Cerveja Heineken', clienteId: 'c4'}, 
      {qtd: 1, nome: 'Cerveja Heineken', clienteId: 'c5'}, 
      {qtd: 1, nome: 'Água sem Gás', clienteId: 'c5'}
    ] 
  },
  { id: '4', numero: '14', status: 'pronto', clientes: [{id: 'c6', nome: 'Lucas'}], tempo: '30m', pedidos: 4, valor: 142.90, itens: [{qtd: 2, nome: 'Chopp Pilsen', clienteId: 'c6'}, {qtd: 1, nome: 'Camarão Alho e Óleo', clienteId: 'c6'}] },
  { id: '5', numero: '15', status: 'aguardando', clientes: [{id: 'c7', nome: 'Marcos'}], tempo: '1h 10m', pedidos: 6, valor: 310.00, itens: [{qtd: 1, nome: 'Moqueca de Camarão', clienteId: 'c7'}, {qtd: 4, nome: 'Suco de Laranja', clienteId: 'c7'}] },
  { id: '6', numero: '16', status: 'livre', clientes: [] },
  { id: '7', numero: '17', status: 'chamando', clientes: [{id: 'c8', nome: 'Camila'}], tempo: '5m', pedidos: 0, valor: 0 },
  { id: '8', numero: '18', status: 'livre', clientes: [] },
];

export default function GarcomDashboard() {
  const [filtro, setFiltro] = useState<MesaStatus | 'todas'>('todas');
  const [mesas, setMesas] = useState<Mesa[]>(MOCK_MESAS);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);

  // Lógica para arraste (carousel) com o mouse no desktop
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Se o filtro for 'ocupada', vamos mostrar TODAS que não estão livres
  const mesasFiltradas = mesas.filter(m => {
    if (filtro === 'todas') return true;
    if (filtro === 'ocupada') return m.status !== 'livre'; // Ocupada engloba qualquer mesa com cliente (chamando, pronto, aguardando, etc)
    return m.status === filtro;
  });

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

  const abrirAvisoGerencia = () => {
    toast.custom((t) => (
      <div className="bg-white p-5 rounded-xl shadow-lg border border-blue-200 w-full max-w-sm mx-auto flex flex-col gap-3 animate-in slide-in-from-top-2">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 text-blue-600 w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="flex-1 pt-1 text-left">
            <h4 className="font-semibold text-slate-900 text-base">Comunicado Interno</h4>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
              Revisem os guarda-sóis, a maré está subindo rápido. Puxem as mesas da linha da água.
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button 
            onClick={() => toast.dismiss(t)} 
            className="bg-slate-900 text-white font-medium py-2.5 px-6 rounded-lg text-sm active:scale-95 transition-all hover:bg-slate-800"
          >
            Estou ciente
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity, // Fica na tela até ele clicar
      position: 'top-center' 
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
          
          {/* SINO DE NOTIFICAÇÕES GERAIS / GERÊNCIA */}
          <div 
            className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center relative shadow-sm border border-slate-700 cursor-pointer hover:bg-slate-700 transition"
            onClick={abrirAvisoGerencia}
          >
            <BellRing className="text-[#FFCC00] w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900 border-solid animate-bounce">
              1
            </span>
          </div>
        </div>
        
        {/* FILTROS RÁPIDOS */}
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`flex gap-2 px-5 pb-5 overflow-x-auto hide-scrollbar mt-2 cursor-grab ${isDragging ? 'cursor-grabbing select-none' : ''}`}
        >
          <button 
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${filtro === 'todas' ? 'bg-[#FFCC00] text-slate-900' : 'bg-slate-800 text-slate-300'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFiltro('chamando')}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'chamando' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            {filtro !== 'chamando' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
            Chamados
          </button>
          <button 
            onClick={() => setFiltro('pronto')}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'pronto' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            {filtro !== 'pronto' && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
            Prontos
          </button>
          <button 
            onClick={() => setFiltro('aguardando')}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'aguardando' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            {filtro !== 'aguardando' && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
            Em Produção
          </button>
          <button 
            onClick={() => setFiltro('ocupada')}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'ocupada' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300'}`}
          >
            Ocupadas (Todas)
          </button>
          <button 
            onClick={() => setFiltro('livre')}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${filtro === 'livre' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            {filtro !== 'livre' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            Livres
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
              className={`relative p-4 sm:p-5 rounded-2xl flex flex-col items-start text-left transition-transform active:scale-95 border-2 
                ${mesa.status === 'livre' ? 'bg-green-50/70 border-dashed border-green-300 text-green-800 cursor-default' : 'cursor-pointer'} 
                ${mesa.status === 'ocupada' ? 'bg-white border-slate-100 shadow-sm text-slate-800' : ''} 
                ${mesa.status === 'aguardando' ? 'bg-orange-50 border-orange-400 shadow-sm text-orange-950' : ''} 
                ${mesa.status === 'chamando' ? 'bg-red-50 border-red-500 shadow-md text-red-950 animate-in zoom-in duration-300' : ''} 
                ${mesa.status === 'pronto' ? 'bg-slate-900 border-slate-900 shadow-md text-white' : ''}`}
            >
              {/* Notificação/Badge Pulse para Chamados e Prontos */}
              {(mesa.status === 'chamando' || mesa.status === 'pronto' || mesa.status === 'aguardando') && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === 'chamando' ? 'bg-red-400' : mesa.status === 'aguardando' ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid ${mesa.status === 'chamando' ? 'bg-red-500' : mesa.status === 'aguardando' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                </span>
              )}

              <div className="flex items-center justify-between w-full mb-3">
                <span className="font-black text-2xl sm:text-3xl tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>{mesa.numero}</span>
                
                {mesa.status === 'livre' && <Coffee className="w-6 h-6 text-green-500/60" />}
                {mesa.status === 'ocupada' && <Users className="w-6 h-6 text-slate-400" />}
                {mesa.status === 'aguardando' && <Clock className="w-6 h-6 text-orange-500" />}
                {mesa.status === 'chamando' && <AlertCircle className="w-7 h-7 text-red-600 animate-pulse" />}
                {mesa.status === 'pronto' && <ChefHat className="w-7 h-7 text-[#FFCC00]" />}
              </div>

              {mesa.status !== 'livre' ? (
                <>
                  <p className={`font-bold text-sm line-clamp-1 ${mesa.status === 'chamando' ? 'text-red-900' : 'text-slate-600'} ${mesa.status === 'aguardando' ? 'text-orange-800' : ''} ${mesa.status === 'pronto' ? 'text-slate-300' : ''}`}>
                    {mesa.clientes.length > 1 
                      ? `${mesa.clientes[0].nome} e +${mesa.clientes.length - 1}` 
                      : mesa.clientes[0]?.nome}
                  </p>
                  <div className={`flex items-center justify-between w-full mt-2 ${mesa.status === 'pronto' ? 'text-slate-400' : mesa.status === 'aguardando' ? 'text-orange-700/70' : 'text-slate-500'}`}>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${mesa.status === 'chamando' ? 'text-red-700/80 animate-pulse' : ''}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {mesa.tempo}
                    </div>
                  </div>

                  {/* INDICADOR DE STATUS TEXTUAL PARA MESAS EM PRODUÇÃO */}
                  {mesa.status === 'aguardando' && (
                    <div className="mt-4 w-full bg-orange-500/10 text-orange-700 border border-orange-500/20 text-[11px] font-extrabold uppercase py-2 rounded-xl text-center tracking-wider">
                      Em Produção
                    </div>
                  )}
                  
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
                <p className="font-bold text-sm mt-auto text-green-700/80">Livre</p>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* DRAWER DA MESA SELECIONADA */}
      {mesaSelecionada && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMesaSelecionada(null)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-5 animate-slide-in sm:max-w-md sm:mx-auto sm:h-[100dvh] sm:right-0 sm:left-auto sm:rounded-none overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-1" style={{ fontFamily: 'var(--font-titulo)' }}>
                  <span className="w-2 h-7 bg-[#FFCC00] rounded-full inline-block"></span>
                  Mesa {mesaSelecionada.numero}
                </h2>
                <p className="text-slate-500 font-medium">
                  {mesaSelecionada.clientes.length > 1 ? `${mesaSelecionada.clientes.length} pessoas na mesa` : `Atendendo: ${mesaSelecionada.clientes[0]?.nome}`}
                </p>
              </div>
              <button onClick={() => setMesaSelecionada(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors" style={{ flexShrink: 0 }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              {/* LISTA COMPLETA DE ITENS NO DRAWER AGRUPADA POR CLIENTE */}
              {mesaSelecionada.itens && mesaSelecionada.itens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                    <ChefHat className="w-4 h-4" /> Comandas Individuais
                  </h3>
                  
                  <div className="space-y-4">
                    {mesaSelecionada.clientes.map(cliente => {
                      const itensDoCliente = mesaSelecionada.itens!.filter(i => i.clienteId === cliente.id);
                      if (itensDoCliente.length === 0) return null;
                      
                      return (
                        <div key={cliente.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-700 text-sm">{cliente.nome}</span>
                          </div>
                          <div className="p-2 space-y-1">
                            {itensDoCliente.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 rounded-xl">
                                <div className="bg-[#FFCC00]/20 text-slate-800 font-black text-xs w-7 h-7 flex items-center justify-center rounded-lg">
                                  {item.qtd}
                                </div>
                                <span className="font-medium text-slate-600 text-sm">{item.nome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  <span className="font-semibold">Itens Registrados</span>
                </div>
                <span className="font-black text-lg text-slate-900">
                  {mesaSelecionada.itens ? mesaSelecionada.itens.reduce((acc, item) => acc + item.qtd, 0) : mesaSelecionada.pedidos}
                </span>
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
