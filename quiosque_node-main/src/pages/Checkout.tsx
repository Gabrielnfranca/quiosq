import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/stores/cart';
import { useTenant } from '@/stores/tenant';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Trash2, 
  Minus, 
  Plus, 
  MapPin, 
  MessageSquare,
  Wallet,
  CreditCard,
  Receipt,
  Ticket
} from 'lucide-react';

export default function Checkout() {
  const { items, getTotal, clearCart, updateQuantity, removeItem, addItem } = useCart();
  const { quiosqueId, mesaId, garcomNome } = useTenant();
  const navigate = useNavigate();
  
  // Mock de recomendaÃƒÂ§ÃƒÂµes (upsell) com imagens gratuitas do Unsplash
  const recommendedItems = [
    { id: 'rec-1', name: 'Ãgua Mineral Sem Gás 500ml', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=200' },
    { id: 'rec-2', name: 'Gelo Escama Saco 5kg', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1542289656-076395b05809?auto=format&fit=crop&q=80&w=200' },
    { id: 'rec-3', name: 'Amendoim Japonês Dori 145g', price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1572889600109-1707010e9fcc?auto=format&fit=crop&q=80&w=200' },
    { id: 'rec-4', name: 'Refrigerante Coca-Cola Lata 350ml', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200' },
  ];
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // velocidade do arraste
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = 0.00;
  const serviceFee = 0.00;
  const finalTotal = getTotal() + deliveryFee + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiosqueId) {
      toast.error('IdentificaÃ§Ã£o do quiosque nÃ£o encontrada. Retorne ao menu.');
      return;
    }

    if (!paymentMethod) {
      toast.error('Selecione uma forma de pagamento.');
      return;
    }
    
    setLoading(true);

    try {
      const orderPayload = {
        quiosqueId: quiosqueId,
        mesaId: mesaId || undefined,
        garcomNome: garcomNome || 'Auto-Atendimento',
        cliente: 'Cliente', 
        observacoes: observacoes,
        paymentMethod: paymentMethod === 'pix' ? 'PIX' : 
                       paymentMethod === 'credit' ? 'CartÃ£o de CrÃ©dito' : 
                       paymentMethod === 'debit' ? 'CartÃ£o de DÃ©bito' : 'Dinheiro',
        itens: items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch('http://localhost:8080/api/v1/cardapio/pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar pedido');
      }

      await res.json();

      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const Divider = () => <div className="h-2 bg-gray-100 w-full" />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center justify-center h-14 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <button onClick={() => navigate('/')} className="absolute left-4 p-2 -ml-2 text-gray-900 active:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="font-bold text-gray-900 text-[13px] tracking-widest uppercase">Comanda</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Receipt className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="mb-2 text-xl font-bold text-gray-900">Sua comanda está vazia</h2>
          <Button onClick={() => navigate('/')} className="mt-8 bg-[#FFCC00] hover:bg-[#F2C200] text-black font-semibold rounded-lg px-8 py-6 w-full max-w-xs text-base transition-colors">
            Adicionar produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white flex items-center justify-center h-14 px-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
        <button type="button" onClick={() => navigate('/')} className="absolute left-4 p-2 -ml-2 text-gray-900 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="font-bold text-gray-900 text-[13px] tracking-widest uppercase">Comanda</h1>
      </header>

      <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col max-w-2xl mx-auto">
        
        {/* Lista de Produtos (Estilo Zé) */}
        <div className="px-4 py-2">
          {items.map((item) => (
            <div key={item.id} className="py-5 border-b border-gray-100 last:border-0 flex gap-4">
              
{/* Cart Product Image or Placeholder */}
                <div className="w-[72px] h-[72px] bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  ) : (
                    <Receipt className="text-gray-300 w-8 h-8" />
                  )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <p className="text-gray-900 font-medium text-[15px] leading-snug pr-4">{item.name}</p>
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 p-1 -mr-1 -mt-1 active:bg-gray-100 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-gray-900 text-base">R$ {item.price.toFixed(2)}</span>
                  
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-gray-300 rounded-xl h-9 overflow-hidden">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="px-3 h-full flex items-center justify-center text-gray-500 active:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 h-full flex items-center justify-center text-gray-900 active:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-6 flex justify-center">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="text-gray-500 font-medium text-[15px] w-full py-2 mb-2"
          >
            Adicionar mais produtos
          </button>
        </div>

        <Divider />

        {/* Carrossel de RecomendaÃƒÂ§ÃƒÂµes (Upsell) */}
        <div className="pt-5 pb-6">
          <div className="px-4 mb-3">
            <h3 className="font-bold text-gray-900 text-[15px]">Aproveite e leve também</h3>
          </div>
          <div 
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto gap-4 px-4 pb-2 snap-x snap-mandatory hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {recommendedItems.map((rec) => (
              <div 
                key={rec.id} 
                className="snap-start flex-shrink-0 w-[140px] flex flex-col pt-2 select-none"
              >
                <div className="w-[140px] h-[140px] bg-slate-50 rounded-xl flex items-center justify-center border border-gray-100 mb-3 relative overflow-hidden pointer-events-none">
                  {/* Imagem Real */}
                  <img src={rec.imageUrl} alt={rec.name} className="object-cover w-full h-full pointer-events-none" draggable={false} />
                  
                  {/* Plus Icon at bottom-right for quick add */}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({ id: rec.id, name: rec.name, price: rec.price, description: '', category: 'Recomendados', image: rec.imageUrl });
                      toast.success(`${rec.name} adicionado!`);
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-primary active:bg-gray-50 transition-colors pointer-events-auto cursor-pointer"
                  >
                    <Plus className="h-5 w-5 text-[#FFCC00]" />
                  </button>
                </div>
                <p className="text-gray-900 font-medium text-[13px] leading-snug line-clamp-2 h-10 mb-1 pointer-events-none">
                  {rec.name}
                </p>
                <span className="font-bold text-gray-900 text-[14px] pointer-events-none">
                  R$ {rec.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Local do Pedido */}
        <div className="p-4 py-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-[15px] mb-1">Receber em</p>
              <p className="text-gray-500 text-sm leading-snug">
                {mesaId ? `Mesa ${mesaId} - Quiosque ${quiosqueId}` : `Retirada no BalcÃ£o - Quiosque ${quiosqueId}`}
              </p>
            </div>
            <MapPin className="h-6 w-6 text-gray-400" />
        </div>

        <Divider />

        {/* Cupons (Mock similar ao ZÃ© Compensa) */}
        <div className="p-4 py-5 flex items-center gap-3 cursor-pointer active:bg-gray-50">
          <Ticket className="h-6 w-6 text-gray-300" />
          <span className="text-gray-500 font-medium text-[15px]">Adicionar cupom de desconto</span>
        </div>

        <Divider />

        {/* ObservaÃ§Ãµes */}
        <div className="p-4 py-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-gray-300" />
            <span className="text-gray-900 font-medium text-[15px]">ObservaÃ§Ãµes:</span>
          </div>
          <Textarea
            id="observacoes"
            placeholder="Ex: O interfone estÃ¡ quebrado, favor ligar quando chegar."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value.substring(0, 150))}
            className="bg-white border-gray-200 focus:border-gray-400 focus:ring-0 rounded-xl py-3 px-4 resize-none h-[88px] text-sm w-full shadow-sm"
          />
          <div className="text-right text-xs text-gray-400 mt-2">
            {observacoes.length}/150
          </div>
        </div>

        <Divider />

        {/* Pagamento */}
        <div className="p-4 py-5">
           <h3 className="font-bold text-gray-900 text-[15px] mb-4">Escolha a forma de pagamento</h3>
           <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              
              <Label
                htmlFor="pix"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer transition-colors [&:has([data-state=checked])]:border-[#FFCC00] [&:has([data-state=checked])]:bg-[#FFCC00]/5"
              >
                <div className="flex items-center gap-4">
                  <Wallet className="h-6 w-6 text-[#00B464]" />
                  <span className="font-medium text-gray-900 text-[15px]">Pix direto no balcÃ£o</span>
                </div>
                <RadioGroupItem value="pix" id="pix" className="w-5 h-5 text-[#FFCC00] border-gray-300 focus:ring-[#FFCC00]" />
              </Label>

              <Label
                htmlFor="credit"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer transition-colors [&:has([data-state=checked])]:border-[#FFCC00] [&:has([data-state=checked])]:bg-[#FFCC00]/5"
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-gray-700" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 text-[15px]">CartÃ£o de CrÃ©dito</span>
                    <span className="text-xs text-gray-500 mt-0.5">O garÃ§om leva a maquininha</span>
                  </div>
                </div>
                <RadioGroupItem value="credit" id="credit" className="w-5 h-5 text-[#FFCC00] border-gray-300 focus:ring-[#FFCC00]" />
              </Label>

               <Label
                htmlFor="debit"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer transition-colors [&:has([data-state=checked])]:border-[#FFCC00] [&:has([data-state=checked])]:bg-[#FFCC00]/5"
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-gray-700" />
                  <span className="font-medium text-gray-900 text-[15px]">CartÃ£o de DÃ©bito</span>
                </div>
                <RadioGroupItem value="debit" id="debit" className="w-5 h-5 text-[#FFCC00] border-gray-300 focus:ring-[#FFCC00]" />
              </Label>

           </RadioGroup>
        </div>

        <Divider />

        {/* Resumo Financeiro */}
        <div className="p-4 pt-6 space-y-2.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{totalItems} produto{totalItems > 1 ? 's' : ''}</span>
            <span>R$ {getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Entrega agendada</span>
            <span>GrÃ¡tis</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Taxa do quiosque</span>
            <span>R$ 0,00</span>
          </div>
          
          <div className="flex justify-between items-center pt-4 pb-6 font-bold text-gray-900 text-[17px]">
            <span>Total a pagar</span>
            <span>R$ {finalTotal.toFixed(2)}</span>
          </div>
        </div>

      </form>

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Button
            form="checkout-form"
            type="submit"
            disabled={loading || !paymentMethod}
            className="flex-1 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-bold text-[15px] rounded-xl py-[26px] disabled:opacity-50 transition-colors shadow-[0_2px_4px_rgba(255,204,0,0.2)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </span>
            ) : (
              <span>Confirmar Pagamento</span>
            )}
          </Button>
        </div>
      </div>

    </div>
  );
}
