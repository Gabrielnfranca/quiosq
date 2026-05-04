import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Order } from '@/types';
import { ChevronLeft, Calendar, Receipt, RotateCcw, PackageOpen, LayoutList } from 'lucide-react';
import { toast } from 'sonner';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      // Supressa o toast vermelho se for erro de conexão local/mock, 
      // e garante que a tela mostre o estado "Vazio" de forma limpa.
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    const variants: Record<string, { label: string; color: string; bg: string }> = {
      pending: { label: 'Pendente', color: 'text-amber-700', bg: 'bg-amber-100' },
      preparing: { label: 'Preparando', color: 'text-blue-700', bg: 'bg-blue-100' },
      delivering: { label: 'Pronto / A Caminho', color: 'text-purple-700', bg: 'bg-purple-100' },
      completed: { label: 'Concluído', color: 'text-emerald-700', bg: 'bg-emerald-100' },
      cancelled: { label: 'Cancelado', color: 'text-rose-700', bg: 'bg-rose-100' },
    };
    return variants[status] || variants.pending;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit: 'Cartão de Crédito',
      cash: 'Dinheiro',
      pix: 'PIX',
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFCC00] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      <Header />
      
      {/* Top Bar Fixa de Voltar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase" style={{ fontFamily: 'var(--font-titulo)' }}>Histórico</h1>
        <div className="w-10 h-10"></div> {/* Espaçamento invisível */}
      </div>

      <main className="container max-w-lg mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <LayoutList className="h-12 w-12 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-800 tracking-tight uppercase" style={{ fontFamily: 'var(--font-titulo)' }}>Nenhum pedido</h3>
            <p className="mb-8 text-slate-500 font-medium">
              Você ainda não fez nenhum pedido conosco. Que tal experimentar nossas delícias?
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 transition-all font-bold h-14 rounded-2xl shadow-sm text-lg active:scale-[0.98]"
            >
              Fazer Pedido
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
                  {/* Status Banner do Card */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${statusDisplay.bg.replace('bg-', 'bg-').replace('100', '400')}`} />
                  
                  <div className="flex items-start justify-between mb-4 pl-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-slate-800 text-lg uppercase tracking-tight">Pedido</h3>
                        <span className="text-slate-400 font-bold text-sm">#{order.id.slice(0, 5).toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusDisplay.bg} ${statusDisplay.color}`}>
                      {statusDisplay.label}
                    </div>
                  </div>

                  {/* Detalhes dos Produtos */}
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start text-sm">
                          <div className="flex items-start gap-2 max-w-[70%]">
                            <span className="font-black text-slate-800 px-1.5 bg-slate-200 rounded min-w-[24px] text-center inline-block">{item.quantity}x</span>
                            <span className="font-bold text-slate-700 leading-tight">{item.name}</span>
                          </div>
                          <span className="font-extrabold text-slate-800">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo Final do Card */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <Receipt className="w-4 h-4" />
                        Total Pago
                      </span>
                      <span className="text-xl font-black text-slate-900 tracking-tight">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4" />
                        Método
                      </span>
                      <span className="text-sm font-extrabold text-slate-700">
                        {getPaymentMethodLabel(order.payment_method)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botão de Repetir Pedido (Opcional visual) */}
                  <Button 
                    className="w-full mt-5 bg-white border-2 border-[#FFCC00] text-slate-800 hover:bg-[#FFCC00] rounded-xl h-12 font-bold transition-colors shadow-none"
                    onClick={() => navigate('/')}
                  >
                    Repetir Pedido
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
