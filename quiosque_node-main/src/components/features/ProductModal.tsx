import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types';
import { useCart } from '@/stores/cart';
import { toast } from 'sonner';

interface ProductModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// MOCK DE ADICIONAIS SÓ PRA VISUALIZAR A PROPOSTA
const MOCK_ADICIONAIS = [
  { id: 'a1', nome: 'Molho Extra', preco: 3.50 },
  { id: 'a2', nome: 'Batata Frita G', preco: 8.00 },
  { id: 'a3', nome: 'Bacon', preco: 5.00 },
];

export function ProductModal({ item, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [adicionaisQuantidades, setAdicionaisQuantidades] = useState<Record<string, number>>({});
  const { items, addItem, updateQuantity } = useCart();

  if (!item) return null;

  const handleIncrementAdicional = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAdicionaisQuantidades(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrementAdicional = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAdicionaisQuantidades(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const valorAdicionais = Object.entries(adicionaisQuantidades).reduce((total, [id, qt]) => {
    const adicional = MOCK_ADICIONAIS.find(a => a.id === id);
    return total + (adicional ? adicional.preco * qt : 0);
  }, 0);

  const valorTotalProduto = (item.price + valorAdicionais) * quantity;

  const getAdicionaisName = () => {
    const parts = Object.entries(adicionaisQuantidades).map(([id, qt]) => {
      const adic = MOCK_ADICIONAIS.find(a => a.id === id);
      return adic ? `${qt}x ${adic.nome}` : '';
    });
    return parts.length > 0 ? ` (+ ${parts.join(', ')})` : '';
  };

  const handleAddToCart = () => {
    const extrasStr = getAdicionaisName();
    const itemWithExtras = {
        ...item,
        id: extrasStr ? `${item.id}-${JSON.stringify(adicionaisQuantidades)}` : item.id,
        price: item.price + valorAdicionais,
        name: item.name + extrasStr
    };

    const existing = items.find(i => i.id === itemWithExtras.id);
    if (existing) {
        updateQuantity(itemWithExtras.id, existing.quantity + quantity);
    } else {
        for (let i = 0; i < quantity; i++) {
            addItem(itemWithExtras);
        }
    }
    
    toast.success(`${quantity}x ${item.name} adicionado à comanda!`, { style: { background: '#10b981', color: 'white', border: 'none' } });
    onClose();
    setTimeout(() => {
        setQuantity(1);
        setAdicionaisQuantidades({});
    }, 300);
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden gap-0 rounded-[2rem] border-0 shadow-2xl bg-white flex flex-col max-h-[90vh] font-sans">
        <div className="overflow-y-auto pb-24">
            <div className="relative h-64 sm:h-72 w-full bg-slate-100 sticky top-0 z-0">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="p-6 bg-white relative z-10 rounded-t-3xl -mt-6">
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-800">{item.name}</DialogTitle>
                <DialogDescription className="text-sm font-medium leading-relaxed text-slate-500">
                  {item.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3">
                <p className="text-2xl font-black text-slate-800">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 relative z-10 border-t border-slate-100">
              <div className="flex flex-col gap-1 mb-4">
                <h3 className="font-extrabold text-slate-800 tracking-tight">Deseja adicionar complementos?</h3>
                <p className="text-xs font-semibold text-slate-500">Aumente para adicionar as opções.</p>
              </div>

              <div className="flex flex-col gap-0 divide-y divide-slate-200">
                {MOCK_ADICIONAIS.map((adicional) => {
                  const qtt = adicionaisQuantidades[adicional.id] || 0;
                  return (
                  <div key={adicional.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-700">{adicional.nome}</h4>
                      <p className="text-xs font-bold text-slate-500">+ R$ {adicional.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center justify-end gap-3 min-w-[100px]">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 shrink-0 text-[#FFCC00] disabled:text-slate-300 disabled:border-slate-100 disabled:bg-slate-50 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg shadow-sm transition-colors" 
                         onClick={(e) => handleDecrementAdicional(adicional.id, e)} 
                         disabled={qtt === 0}
                       >
                         <Minus className="h-4 w-4" strokeWidth={3} />
                       </Button>
                       <span className="w-4 text-center font-black text-base text-slate-800">{qtt}</span>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 shrink-0 text-[#FFCC00] bg-white border border-slate-200 hover:bg-slate-100 rounded-lg shadow-sm transition-colors" 
                         onClick={(e) => handleIncrementAdicional(adicional.id, e)}
                       >
                         <Plus className="h-4 w-4" strokeWidth={3} />
                       </Button>
                    </div>
                  </div>
                )})}
              </div>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 px-6 flex items-center justify-between gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20">
          <div className="flex items-center gap-3 border-2 border-slate-200 rounded-xl p-1 bg-white">
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-[#FFCC00] hover:bg-slate-100 rounded-lg" onClick={handleDecrement} disabled={quantity <= 1}>
              <Minus className="h-5 w-5" strokeWidth={3} />
            </Button>
            <span className="w-6 text-center font-black text-xl text-slate-800">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-[#FFCC00] hover:bg-slate-100 rounded-lg" onClick={handleIncrement}>
              <Plus className="h-5 w-5" strokeWidth={3} />
            </Button>
          </div>
          
          <Button onClick={handleAddToCart} className="flex-1 h-14 bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 font-extrabold text-base rounded-xl transition-transform active:scale-95 shadow-sm">
            Adicionar - R$ {valorTotalProduto.toFixed(2).replace('.', ',')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}