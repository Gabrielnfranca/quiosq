
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useOrdersDrawer } from '@/stores/ordersDrawer';
import { Order } from '@/types';
import { X, Calendar, Receipt, RotateCcw, PackageOpen, LayoutList, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

export function OrdersDrawer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, toggleOrders } = useOrdersDrawer();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [user, isOpen]);

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
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    const variants: Record<string, { label: string; color: string; bg: string }> = {
      pending: { label: 'Pendente', color: 'text-amber-700', bg: 'bg-amber-100' },
      preparing: { label: 'Preparando', color: 'text-blue-700', bg: 'bg-blue-100' },
      delivering: { label: 'A Caminho', color: 'text-purple-700', bg: 'bg-purple-100' },
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={toggleOrders}
      />
      <div className="fixed right-0 top-0 z-[70] h-[100dvh] w-full max-w-md animate-slide-in bg-slate-50 shadow-2xl sm:w-[400px] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFCC00] rounded-full flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>Meus Pedidos</h2>
          </div>
          <button 
            onClick={toggleOrders} 
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFCC00] border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 h-full">
              <div className="w-24 h-24 bg-slate-200/50 rounded-full flex items-center justify-center mb-6">
                <LayoutList className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-2xl font-black text-slate-800 tracking-tight uppercase" style={{ fontFamily: 'var(--font-titulo)' }}>Nenhum pedido</h3>
              <p className="text-slate-500 font-medium max-w-[250px] mb-8">
                Você ainda não fez nenhum pedido conosco.
              </p>
              <Button 
                onClick={() => {
                  toggleOrders();
                  navigate('/');
                }} 
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
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusDisplay.bg} ${statusDisplay.color}`}>
                        {statusDisplay.label}
                      </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 mt-2 pt-4 pl-1">
                      <div className="flex flex-col gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {item.quantity}x
                            </div>
                            <span className="text-sm font-medium text-slate-700 flex-1 line-clamp-1">{item.name}</span>
                            <span className="text-sm font-bold text-slate-600">
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 pl-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Receipt className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">{getPaymentMethodLabel(order.payment_method)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
                        <span className="text-lg font-black text-[#FFCC00] tracking-tight">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
