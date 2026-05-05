import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Clock, AlertCircle, Palmtree } from 'lucide-react';

interface ItemPedido {
  id: string;
  nome: string;
  quantidade: number;
  observacao?: string;
  adicionais?: { nome: string; quantidade: number }[];
}

interface PedidoCozinha {
  id: string;
  mesa: number;
  cliente: string;
  itens: ItemPedido[];
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
  tempoMinutos: number;
}

export default function CozinhaDashboard() {
  // Dados MOCK para começarmos a visualizar
  const [pedidos, setPedidos] = useState<PedidoCozinha[]>([
    {
      id: '1001',
      mesa: 12,
      cliente: 'João',
      status: 'pendente',
      tempoMinutos: 5,
      itens: [
        { id: '1', nome: 'Porção de Camarão', quantidade: 1, observacao: 'Sem limão' },
        { id: '2', nome: 'Isca de Peixe', quantidade: 2 }
      ]
    },
    {
      id: '1002',
      mesa: 8,
      cliente: 'Maria',
      status: 'preparando',
      tempoMinutos: 15,
      itens: [
        { id: '3', nome: 'Batata Frita', quantidade: 1, adicionais: [{ nome: 'Cheddar', quantidade: 3 }, { nome: 'Bacon em cubos', quantidade: 1 }] },
        { id: '4', nome: 'Pastel de Carne', quantidade: 6, observacao: 'Bem frito' }
      ]
    },
    {
      id: '1003',
      mesa: 3,
      cliente: 'Carlos (Conta 2)',
      status: 'pendente',
      tempoMinutos: 25,
      itens: [
        { id: '5', nome: 'Casquinha de Siri', quantidade: 3 }
      ]
    }
  ]);

  const alterarStatus = (id: string, novoStatus: 'pendente' | 'preparando' | 'pronto' | 'entregue') => {
    setPedidos(pedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans selection:bg-[#FFCC00] selection:text-black">
      {/* HEADER DA COZINHA (Estilo Zé Delivery: Clean, Branco, Contraste Forte) */}
      <header className="bg-white text-gray-900 px-6 py-4 shadow-sm border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo Branding QuiosQ */}
          <div className="w-12 h-12 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-sm border border-yellow-400">
            <Palmtree className="text-black w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-3xl tracking-tighter text-gray-900 leading-none flex items-baseline gap-1">
              QuiosQ <span className="text-[#FFCC00] text-4xl leading-none">.</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase mt-1 tracking-widest">KDS • Painel da Cozinha</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="font-bold text-gray-700 text-sm">{pedidos.filter(p => p.status === 'pendente').length} Pendentes</span>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-200">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]"></div>
            <span className="font-bold text-yellow-800 text-sm">{pedidos.filter(p => p.status === 'preparando').length} Em Preparo</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-full flex items-center gap-2 border border-green-200">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
            <span className="font-bold text-green-800 text-sm">{pedidos.filter(p => p.status === 'pronto').length} No Balcão</span>
          </div>
        </div>
      </header>

      {/* BOARD KANBAN DA COZINHA */}
      <main className="flex-1 p-6 overflow-x-auto overflow-y-hidden hide-scrollbar bg-gray-100">
        <div className="flex gap-6 h-full items-start min-w-max">
          
          {/* COLUNA 1: PENDENTES (A FAZER) */}
          <div className="w-[340px] flex flex-col h-full bg-gray-200/50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
              <h3 className="font-black text-gray-800 text-lg tracking-tight uppercase">Entrada / Novos</h3>
              <span className="bg-gray-900 text-white text-xs font-extrabold px-2.5 py-1 rounded-md">
                {pedidos.filter(p => p.status === 'pendente').length}
              </span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 hide-scrollbar">
              {pedidos
                .filter(p => p.status === 'pendente')
                .sort((a, b) => b.tempoMinutos - a.tempoMinutos) // FIFO: Mais antigos primeiro
                .map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col hover:border-gray-300 transition-colors">
                    {/* Header do Card */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded text-[11px] tracking-wider">
                          #{pedido.id}
                        </span>
                        <div className={`flex items-center gap-1 font-bold text-xs ${pedido.tempoMinutos > 20 ? 'text-red-500' : 'text-gray-500'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {pedido.tempoMinutos} min
                        </div>
                      </div>
                      <h2 className="text-[22px] font-black text-gray-900 leading-none tracking-tight">MESA {pedido.mesa}</h2>
                      <p className="text-gray-500 font-medium text-xs mt-1 truncate">{pedido.cliente}</p>
                    </div>

                    {/* Itens do Card */}
                    <div className="p-4">
                      <ul className="flex flex-col gap-3">
                        {pedido.itens.map((item, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <div className="bg-gray-100 text-gray-900 w-7 h-7 rounded shrink-0 flex items-center justify-center font-bold text-sm">
                              {item.quantidade}x
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className="text-gray-900 font-bold text-sm leading-tight">{item.nome}</p>
                              
                              {item.adicionais && item.adicionais.length > 0 && (
                                <div className="mt-1.5 flex flex-col gap-1">
                                  {item.adicionais.map((add, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-extrabold text-green-800 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded w-fit uppercase tracking-wide">
                                      <span className="text-green-500 font-black text-sm leading-none">+</span> {add.quantidade > 1 ? `${add.quantidade}x ` : ''}{add.nome}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {item.observacao && (
                                <div className="mt-1.5 flex items-start gap-1.5 bg-yellow-100/80 border-l-4 border-red-500 p-2 pt-1.5 pb-1.5 rounded-r-md w-full">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-[2px]" />
                                  <p className="text-red-700 text-[11px] font-black uppercase tracking-wide leading-tight">{item.observacao}</p>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ação do Card */}
                    <div className="p-4 pt-0">
                      <button 
                        onClick={() => alterarStatus(pedido.id, 'preparando')}
                        className="w-full bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black uppercase py-3 rounded-lg transition-all active:scale-95 text-xs tracking-wider"
                      >
                        Iniciar Preparo →
                      </button>
                    </div>
                  </div>
              ))}
              {pedidos.filter(p => p.status === 'pendente').length === 0 && (
                <div className="text-center text-gray-400 font-medium py-10 text-sm">Nenhum pedido na fila.</div>
              )}
            </div>
          </div>

          {/* COLUNA 2: EM PREPARO (NA CHAPA) */}
          <div className="w-[340px] flex flex-col h-full bg-yellow-50/50 rounded-2xl border border-yellow-200/60 overflow-hidden">
            <div className="p-4 bg-[#FFCC00] border-b border-yellow-300 flex items-center justify-between shadow-sm z-10">
              <h3 className="font-black text-black text-lg tracking-tight uppercase">Na Chapa / Finalizando</h3>
              <span className="bg-black text-[#FFCC00] text-xs font-extrabold px-2.5 py-1 rounded-md">
                {pedidos.filter(p => p.status === 'preparando').length}
              </span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 hide-scrollbar">
              {pedidos
                .filter(p => p.status === 'preparando')
                .sort((a, b) => b.tempoMinutos - a.tempoMinutos) // FIFO: Mais antigos primeiro
                .map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-yellow-200 flex flex-col">
                    {/* Header do Card */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-[#FFCC00]/20 text-yellow-800 font-bold px-2 py-0.5 rounded text-[11px] tracking-wider">
                          #{pedido.id}
                        </span>
                        <div className={`flex items-center gap-1 font-bold text-xs ${pedido.tempoMinutos > 20 ? 'text-red-500' : 'text-gray-500'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {pedido.tempoMinutos} min
                        </div>
                      </div>
                      <h2 className="text-[22px] font-black text-gray-900 leading-none tracking-tight">MESA {pedido.mesa}</h2>
                      <p className="text-gray-500 font-medium text-xs mt-1 truncate">{pedido.cliente}</p>
                    </div>

                    {/* Itens do Card */}
                    <div className="p-4">
                      <ul className="flex flex-col gap-3">
                        {pedido.itens.map((item, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <div className="bg-yellow-50 border border-yellow-100 text-yellow-900 w-7 h-7 rounded shrink-0 flex items-center justify-center font-bold text-sm">
                              {item.quantidade}x
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className="text-gray-900 font-bold text-sm leading-tight">{item.nome}</p>
                              
                              {item.adicionais && item.adicionais.length > 0 && (
                                <div className="mt-1.5 flex flex-col gap-1">
                                  {item.adicionais.map((add, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-extrabold text-green-800 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded w-fit uppercase tracking-wide">
                                      <span className="text-green-500 font-black text-sm leading-none">+</span> {add.quantidade > 1 ? `${add.quantidade}x ` : ''}{add.nome}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {item.observacao && (
                                <div className="mt-1.5 flex items-start gap-1.5 bg-yellow-100/80 border-l-4 border-red-500 p-2 pt-1.5 pb-1.5 rounded-r-md w-full">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-[2px]" />
                                  <p className="text-red-700 text-[11px] font-black uppercase tracking-wide leading-tight">{item.observacao}</p>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ação do Card */}
                    <div className="p-4 pt-0 flex flex-col gap-2">
                      <button 
                        onClick={() => alterarStatus(pedido.id, 'pronto')}
                        className="w-full bg-[#10b981] hover:bg-[#0da070] text-white font-black uppercase py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-xs tracking-wider shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Colocar no Balcão →
                      </button>
                      
                      {/* Botão de Desfazer (Voltar etapa) */}
                      <button 
                        onClick={() => alterarStatus(pedido.id, 'pendente')}
                        className="w-full text-yellow-700/60 hover:text-yellow-700 hover:bg-yellow-100 font-bold uppercase py-2 rounded-lg transition-all active:scale-95 text-[10px] tracking-wider"
                      >
                        ← Ops, voltar (Desfazer)
                      </button>
                    </div>
                  </div>
              ))}
              {pedidos.filter(p => p.status === 'preparando').length === 0 && (
                <div className="text-center text-gray-400 font-medium py-10 text-sm">Nenhum pedido na chapa.</div>
              )}
            </div>
          </div>

          {/* COLUNA 3: PRONTOS / NO BALCÃO (Aguardando Garçom) */}
          <div className="w-[340px] flex flex-col h-full bg-green-50/30 rounded-2xl border border-green-200/50 overflow-hidden">
            <div className="p-4 bg-[#10b981] border-b border-green-500 flex items-center justify-between shadow-sm z-10">
              <h3 className="font-black text-white text-lg tracking-tight uppercase">No Balcão (Prontos)</h3>
              <span className="bg-green-900 text-white text-xs font-extrabold px-2.5 py-1 rounded-md">
                {pedidos.filter(p => p.status === 'pronto').length}
              </span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 hide-scrollbar">
              {pedidos
                .filter(p => p.status === 'pronto')
                .map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-green-200 flex flex-col opacity-80 hover:opacity-100 transition-opacity">
                    {/* Header do Card */}
                    <div className="p-4 border-b border-gray-100 bg-green-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[11px] tracking-wider">
                          #{pedido.id}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-xs text-green-600 animate-pulse">
                          🔔 Chamando Garçom
                        </div>
                      </div>
                      <h2 className="text-[22px] font-black text-gray-900 leading-none tracking-tight">MESA {pedido.mesa}</h2>
                    </div>

                    {/* Itens simplificados */}
                    <div className="p-3">
                      <p className="text-gray-500 text-xs font-bold px-1 mb-2 uppercase">ITENS:</p>
                      <ul className="flex flex-col gap-1 px-1">
                        {pedido.itens.map((item, idx) => (
                          <li key={idx} className="flex gap-2 items-center text-sm">
                            <span className="font-bold text-gray-800">{item.quantidade}x</span>
                            <span className="text-gray-600 truncate">{item.nome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* O que limpa a tela de verdade */}
                    <div className="p-4 pt-2 flex flex-col gap-2">
                       <button 
                        onClick={() => alterarStatus(pedido.id, 'entregue')}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-xs tracking-wider"
                      >
                        Garçom Retirou (Zerar)
                      </button>
                      <button 
                        onClick={() => alterarStatus(pedido.id, 'preparando')}
                        className="w-full text-green-600/60 hover:text-green-700 hover:bg-green-50 font-bold uppercase py-2 rounded-lg transition-all active:scale-95 text-[10px] tracking-wider"
                      >
                        ← Voltar pra Chapa
                      </button>
                    </div>
                  </div>
              ))}
              {pedidos.filter(p => p.status === 'pronto').length === 0 && (
                <div className="text-center text-gray-400 font-medium py-10 text-sm">Balcão vazio.</div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}