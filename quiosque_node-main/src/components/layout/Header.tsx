import { Menu, ShoppingCart, UtensilsCrossed, User, LogOut, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/stores/cart';
import { useAuth } from '@/stores/auth';
import { useTenant } from '@/stores/tenant';
import { authService } from '@/lib/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export function Header() {
  const { items, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const { mesaId, quiosqueId } = useTenant();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      // Exibe a mesa no header apenas após scrollar 120px para baixo (quando o banner principal some)
      setIsScrolled(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatQuiosqueName = (id: string | null) => {
    if (!id) return '';
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleMyOrders = () => {
    setOpen(false);
    navigate('/orders');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-md">
             <UtensilsCrossed className="h-5 w-5 text-[#FFCC00]" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase" style={{ fontFamily: 'var(--font-titulo)' }}>QuiosQ</h1>
            
          </div>
          
          <div className={`transition-all duration-300 ease-in-out ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 w-0 overflow-hidden'}`}>
            {mesaId && (
              <Badge variant="secondary" className="ml-2 bg-[#FFCC00] text-slate-900 border-transparent shadow-sm px-2 py-0.5 text-xs font-black uppercase tracking-widest rounded-lg">
                Mesa {mesaId}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* REMOVIDO: Ícone do carrinho do top header, pois teremos a targeta amarela de Sacola vindo por baixo depois. */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all">
                <Menu className="h-5 w-5 stroke-[2.5]" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-50 border-l border-slate-100 w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left mb-6 mt-2">
                <SheetTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>
                  Minha Conta
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFCC00] shrink-0">
                    <User className="h-7 w-7 text-slate-900" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="font-extrabold text-slate-800 truncate">{user?.username || 'Visitante'}</p>
                    <p className="text-sm font-medium text-slate-500 truncate">{user?.email || 'Faça login para ver'}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-2">
                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                    onClick={handleMyOrders}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 shrink-0">
                      <ClipboardList className="h-5 w-5 text-slate-700" strokeWidth={2} />
                    </div>
                    <span className="font-bold text-slate-700">Meus Pedidos</span>
                  </button>
                  
                  <div className="h-[1px] w-full bg-slate-100" />

                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-rose-50 active:bg-rose-100 transition-colors text-left group"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors shrink-0">
                      <LogOut className="h-5 w-5 text-rose-600" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-rose-600">Sair da Conta</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
