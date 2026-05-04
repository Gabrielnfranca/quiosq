import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/stores/cart';
import { useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, getTotal, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />
      <div className="fixed right-0 top-0 z-[70] h-[100dvh] w-full max-w-md animate-slide-in bg-slate-50 shadow-2xl sm:w-[400px] flex flex-col">
        
        {/* Cabeçalho da Sacola */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFCC00] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>Sua Sacola</h2>
          </div>
          <button 
            onClick={toggleCart} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors active:scale-95"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="h-24 w-24 bg-slate-200/50 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag className="h-10 w-10 text-slate-400" strokeWidth={2} />
              </div>
              <p className="text-2xl font-black text-slate-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>Sacola Vazia</p>
              <p className="text-base font-medium text-slate-500 mt-2 max-w-[250px]">
                Que tal adicionar algumas delícias para matar a fome?
              </p>
              <Button 
                onClick={toggleCart}
                className="mt-8 bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 font-bold px-8 h-12 rounded-xl transition-transform active:scale-95 shadow-sm"
              >
                Voltar ao Cardápio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-3xl bg-white p-3 shadow-sm border border-slate-100 relative"
                >
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-800 leading-tight line-clamp-2 text-sm">{item.name}</h3>
                      <button
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        onClick={() => removeItem(item.id)}
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-base text-slate-900 font-black">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                      
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button
                          className="h-7 w-7 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 active:scale-95 transition-all"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" strokeWidth={3} />
                        </button>
                        <span className="w-4 text-center text-sm font-black text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          className="h-7 w-7 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 active:scale-95 transition-all"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com Botão de Pagamento */}
        {items.length > 0 && (
          <div className="bg-white border-t border-slate-100 px-5 pt-4 pb-safe shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
            <div className="mb-4">
              <div className="flex items-center justify-between text-base font-bold text-slate-500 mb-1">
                <span>Subtotal</span>
                <span>R$ {getTotal().toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex items-center justify-between text-xl font-black text-slate-900 mt-2">
                <span>Total a Pagar</span>
                <span className="text-2xl tracking-tight">R$ {getTotal().toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 font-black uppercase tracking-wide transition-all h-[60px] rounded-2xl shadow-md flex items-center justify-between px-6 active:scale-[0.98] mb-4"
            >
              <span className="text-lg">Ir para Pagamento</span>
              <div className="w-8 h-8 bg-slate-900/10 rounded-full flex items-center justify-center">
                 <ArrowRight className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
