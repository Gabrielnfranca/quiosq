import { useCart } from '@/stores/cart';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingCartBanner() {
  const { items, getTotal, toggleCart, isOpen } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Se o carrinho estiver vazio ou a gaveta estiver aberta, nÃ£o mostra a barra
  if (itemCount === 0 || isOpen) return null;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 p-4 z-40 bg-gradient-to-t from-white via-white/95 to-transparent pb-8 pt-10">
      <Button 
        onClick={toggleCart}
        className="w-full max-w-md mx-auto flex items-center justify-between h-16 px-6 bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 border-0 rounded-[1.5rem] shadow-[0_10px_40px_rgba(255,204,0,0.4)] transition-transform active:scale-95"
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 text-[#FFCC00] font-black text-sm">
          {itemCount}
        </div>
        
        <span className="font-extrabold text-base tracking-wide uppercase">
          Minha Comanda
        </span>
        
        <span className="font-black text-lg">
          R$ {getTotal().toFixed(2).replace('.', ',')}
        </span>
      </Button>
    </div>
  );
}