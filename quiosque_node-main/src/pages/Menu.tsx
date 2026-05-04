import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Package, UtensilsCrossed, ChefHat, Wine, IceCream, GlassWater, Home, Search, ScrollText, ClipboardList } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CategoryFilter } from '@/components/features/CategoryFilter';
import { MenuItemCard } from '@/components/features/MenuItemCard';
import { CartDrawer } from '@/components/features/CartDrawer';
import { OrdersDrawer } from '@/components/features/OrdersDrawer';
import { FloatingCartBanner } from '@/components/features/FloatingCartBanner';
import { MENU_ITEMS, CATEGORIES } from '@/constants/menu';
import { useTenant } from '@/stores/tenant';
import { useCart } from '@/stores/cart';
import { useOrdersDrawer } from '@/stores/ordersDrawer';

// Componente utilitário para permitir Arrasto com o MOUSE no PC
function DraggableCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUpOrLeave}
      onMouseUp={handleMouseUpOrLeave}
      onMouseMove={handleMouseMove}
      className={"flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide px-1 "}
      style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
    >
      {children}
    </div>
  );
}

// Estilos de Restaurante Premium (Fotos reais com Ícones Integrados)
const TOP_CATEGORIES = ['Entradas e Porções', 'Bebidas', 'Pratos Principais', 'Destilados & Drinks'];
const CATEGORY_STYLES: Record<string, { image: string, icon: any }> = {
  'Entradas e Porções': { image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600', icon: UtensilsCrossed },
  'Pratos Principais': { image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', icon: ChefHat },
  'Bebidas': { image: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Wine },
  'Sobremesas': { image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600', icon: IceCream },
  'Destilados & Drinks': { image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=600', icon: GlassWater },
};

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { toggleCart, items } = useCart();
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const prevItemsCount = useRef(0);

  useEffect(() => {
    const currentCount = items.reduce((acc, item) => acc + item.quantity, 0);
    if (currentCount > prevItemsCount.current) {
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 500);
    }
    prevItemsCount.current = currentCount;
  }, [items]);
  
  
  const { toggleOrders } = useOrdersDrawer();
          const { garcomNome, quiosqueId, mesaId } = useTenant();
  const navigate = useNavigate();

  const formatQuiosqueName = (id: string | null) => {
    if (!id) return '';
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredItems = (selectedCategory && selectedCategory !== 'Todos')
    ? MENU_ITEMS.filter((item) => item.category === selectedCategory && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : MENU_ITEMS.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 pt-6 pb-28 sm:pt-8 sm:pb-32">
        
        {/* BARRA DE PESQUISA (VAI MOSTRAR RESULTADOS NO LUGAR DA HOME OU DA CATEGORIA SE PREENCHIDA) */}
        {isSearchVisible && (
          <div className="mb-6 relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="search-input-home"
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent shadow-sm transition-all text-base"
            placeholder="O que você está procurando hoje?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

                  )}

          {/* BANNER DE BOAS-VINDAS CUSTOMIZADO (Esconde se estiver pesquisando) */}
        {!searchQuery && (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCC00] rounded-full translate-x-12 -translate-y-12 opacity-20"></div>
            <div className="absolute bottom-0 right-10 w-16 h-16 bg-[#FFCC00] rounded-full translate-y-8 opacity-40"></div>
            
            <div className="relative z-10 w-full">
              <p className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-1">Seja bem-vindo(a) ao</p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none mb-3" style={{ fontFamily: 'var(--font-titulo)' }}>
                {quiosqueId ? formatQuiosqueName(quiosqueId) : 'Nosso Restaurante'}
              </h1>
              
              <div className="flex items-center gap-2 mt-2">
                {mesaId && (
                  <div className="inline-flex items-center justify-center text-sm font-black text-slate-900 bg-[#FFCC00] px-3 py-1 rounded-lg">
                    📍 Mesa {mesaId}
                  </div>
                )}
                
                {garcomNome && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1 text-xs text-[#FFCC00] font-bold">
                    <span>Atendente:</span>
                    <strong className="uppercase text-white">{garcomNome}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ESTRUTURA DA HOME (ESTÁ PESQUISANDO OU SEM CATEGORIA) */}
        {searchQuery ? (
          <div className="pb-40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Resultados para "{searchQuery}"
              </h2>
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-100">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum item encontrado</h3>
                <p className="text-slate-500">Tente buscar por um termo diferente ou limpe a pesquisa.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 pb-40 mt-2">
            
            {/* GRID DE CATEGORIAS FOTOGRÁFICO - ESTILO RESTAURANTE PREMIUM */}
            <section>
              <h2 className="text-[1.65rem] sm:text-3xl font-black text-slate-800 uppercase mb-5 px-1 tracking-tight" style={{ fontFamily: "var(--font-titulo)" }}>VAI DE QUÊ HOJE?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-1">
                {TOP_CATEGORIES.map((cat) => {
                  const style = CATEGORY_STYLES[cat] || { image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop' };
                  return (
                    <div 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat)}
                      className="relative bg-slate-300 h-28 sm:h-36 lg:h-40 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200/50"
                    >
                      <img 
                        src={style.image} 
                        alt={cat} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                        <span className="text-white font-black text-[15px] sm:text-lg tracking-tight leading-tight block drop-shadow-md">{cat}</span>
                        <div className="h-1 w-8 bg-[#FFCC00] mt-1.5 rounded-full transition-all duration-300 group-hover:w-12"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PRATELEIRA 1: OFERTAS */}
            <section>
              <div className="flex items-center justify-between px-1 mb-4 pt-2">
                <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-titulo)" }}>
                  <span className="text-[#FFCC00] mr-1"></span><span className="w-1.5 h-[22px] bg-[#FFCC00] rounded-full mr-1.5 inline-block shrink-0"></span> Mais Vendidos
                </h2>
              </div>
              <DraggableCarousel>
                {MENU_ITEMS.slice(4, 9).map((item) => (
                  <div key={'promo-' + item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                    <MenuItemCard item={item} variant="icon" />
                  </div>
                ))}
              </DraggableCarousel>
            </section>

            {/* PRATELEIRA 2: COMBOS E KITS */}
            <section>
              <div className="flex items-center justify-between px-1 mb-4">
                <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-titulo)" }}>
                  <span className="w-1.5 h-[22px] bg-[#FFCC00] rounded-full mr-1.5 inline-block shrink-0"></span> Combos & Baldes
                </h2>
              </div>
              <DraggableCarousel>
                {MENU_ITEMS.slice(0, 5).map((item) => (
                  <div key={'destaque-' + item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                    <MenuItemCard item={item} variant="icon" />
                  </div>
                ))}
              </DraggableCarousel>
            </section>
            
            {/* PRATELEIRA 3: PARA COMPARTILHAR */}
            <section>
              <div className="flex items-center justify-between px-1 mb-4">
                <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-titulo)" }}>
                  <span className="w-1.5 h-[22px] bg-[#FFCC00] rounded-full mr-1.5 inline-block shrink-0"></span> Para Compartilhar
                </h2>
              </div>
              <DraggableCarousel>
                {MENU_ITEMS.slice(6, 11).map((item) => (
                  <div key={'compartilhar-' + item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                    <MenuItemCard item={item} variant="icon" />
                  </div>
                ))}
              </DraggableCarousel>
            </section>

              {/* PRATELEIRA 4: COMBO FAMILIA */}
              <section>
                <div className="flex items-center justify-between px-1 mb-4 border-b-2 border-slate-100 pb-2">
                  <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-titulo)" }}>
                    <span className="text-[#FFCC00] mr-1">|</span> Combo Família
                  </h2>
                </div>
                <DraggableCarousel>
                  {MENU_ITEMS.slice(1, 6).map((item) => (
                    <div key={'familia-' + item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                      <MenuItemCard item={item} variant="icon" />
                    </div>
                  ))}
                </DraggableCarousel>
              </section>

              {/* PRATELEIRA 5: BEBIDAS DESTILADAS */}
              <section>
                <div className="flex items-center justify-between px-1 mb-4 border-b-2 border-slate-100 pb-2">
                  <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-titulo)" }}>
                    <span className="text-[#FFCC00] mr-1">|</span> Bebidas Destiladas
                  </h2>
                </div>
                <DraggableCarousel>
                  {MENU_ITEMS.filter(i => i.category === 'Destilados & Drinks').map((item) => (
                    <div key={'destilados-' + item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                      <MenuItemCard item={item} variant="icon" />
                    </div>
                  ))}
                </DraggableCarousel>
              </section>

              {/* PRATELEIRA 6: BEBIDAS SEM ÁLCOOL */}
              <section>
                <div className="flex items-center justify-between px-1 mb-4 border-b-2 border-slate-100 pb-2">
                  <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-titulo)" }}>
                    <span className="w-1.5 h-[22px] bg-[#FFCC00] rounded-full mr-1.5 inline-block shrink-0"></span> Bebidas Sem Álcool
                  </h2>
                </div>
                <DraggableCarousel>
                  {MENU_ITEMS.filter(i => i.category === 'Bebidas').map((item) => (
                    <div key={'sem-alcool-' + item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                      <MenuItemCard item={item} variant="icon" />
                    </div>
                  ))}
                </DraggableCarousel>
              </section>

          </div>
        
        )}
      
      {/* CATEGORY DRAWER */}
      {selectedCategory && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCategory(null)}
          />
          <div className="fixed right-0 top-0 z-[70] h-[100dvh] w-full max-w-md animate-slide-in bg-slate-50 shadow-2xl sm:w-[400px] flex flex-col">
            <div className="relative z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-1" style={{ fontFamily: 'var(--font-titulo)' }}><span className="w-1.5 h-[22px] bg-[#FFCC00] rounded-full mr-1.5 inline-block shrink-0"></span> <span>{selectedCategory === 'Todos' ? 'Todos os Produtos' : selectedCategory}</span></h2>
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar relative flex flex-col">
              <div className="sticky -top-[1px] z-30 bg-slate-50 pt-4 pb-2 px-4 mb-4 -mx-1">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-2 px-4 pb-6">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} variant="button" />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      </main>

      <FloatingCartBanner />
      <CartDrawer />
      <OrdersDrawer />

      {/* BOTTOM NAVIGATION BAR (FIXED) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-6 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] h-[72px]">
        <div className="flex justify-between items-center max-w-sm mx-auto h-full pt-1 pb-2">
          
          <button 
            onClick={() => setIsSearchVisible(false)}
            className={`flex flex-col items-center justify-center transition-colors w-16 h-full relative ${!isSearchVisible ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1">
              <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" />
            </svg>
            <span className={`text-[11px] tracking-tight ${!isSearchVisible ? 'font-extrabold' : 'font-bold'}`}>Início</span>
            {!isSearchVisible && (
              <div className="absolute bottom-0 w-8 h-[3px] bg-[#FFCC00] rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => {
              setIsSearchVisible((prev) => !prev);
              setTimeout(() => document.getElementById('search-input-home')?.focus(), 100);
            }}
            className={`flex flex-col items-center justify-center transition-colors w-16 h-full relative ${isSearchVisible ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Search className="w-6 h-6 mb-1 stroke-[2]" />
            <span className={`text-[11px] tracking-tight ${isSearchVisible ? 'font-extrabold' : 'font-bold'}`}>Busca</span>
            {isSearchVisible && (
              <div className="absolute bottom-0 w-8 h-[3px] bg-[#FFCC00] rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => toggleCart()}
            className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 transition-colors w-16 h-full relative"
          >
            <div className={`relative mb-1 transition-transform duration-300 ${isCartBouncing ? 'scale-125 -translate-y-1' : ''}`}>
                <ScrollText className="w-6 h-6 stroke-[2]" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-[5px] py-[1px] rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-tight">Comanda</span>
          </button>
          
          <button 
            onClick={() => toggleOrders()}
            className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 transition-colors w-16 h-full relative"
          >
            <ClipboardList className="w-6 h-6 mb-1 stroke-[2]" />
            <span className="text-[11px] font-bold tracking-tight">Pedidos</span>
          </button>

        </div>
      </div>
    </div>
  );
}
