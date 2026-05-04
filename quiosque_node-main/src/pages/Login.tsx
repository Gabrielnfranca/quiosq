import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/stores/auth';
import { useTenant } from '@/stores/tenant';
import { toast } from 'sonner';
import { QrCode, Store } from 'lucide-react';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { quiosqueId, mesaId, garcomNome } = useTenant();
  const navigate = useNavigate();

  const formatQuiosqueName = (id: string | null) => {
    if (!id) return '';
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!quiosqueId || !mesaId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center font-sans">
        <div className="rounded-full bg-white p-6 shadow-xl mb-4 border-4 border-[#FFCC00]">
          <QrCode className="h-16 w-16 text-slate-800" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Escaneie o QR Code</h1>
        <p className="mt-2 text-slate-600 max-w-md font-medium">Para acessar o cardápio e fazer pedidos, você precisa escanear o QR Code que está na sua mesa ou guarda-sol.</p>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Você precisa aceitar os Termos de Uso para continuar.');
      return;
    }

    setLoading(true);

    try {
      setTimeout(() => {
        login({
          id: Date.now().toString(),
          email: email,
          user_metadata: {
            username: name,
            phone: phone
          }
        });
        toast.success(`Bem-vindo(a), ${name}!`);
        navigate('/');
      }, 1000);
      
    } catch (error: any) {
      toast.error('Erro ao acessar o cardápio. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-[2rem] overflow-hidden bg-white">
        <div className="bg-[#FFCC00] pt-8 pb-6 px-6 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
                <div className="absolute top-20 -left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-lg transform rotate-3">
                    <Store className="h-8 w-8 text-[#FFCC00] -rotate-3" />
                </div>
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight uppercase" style={{ fontFamily: 'var(--font-titulo)' }}>
                    {quiosqueId ? formatQuiosqueName(quiosqueId) : 'QuiosQ'}
                </CardTitle>
                <div className="mt-4 flex flex-col items-center gap-2">
                    {mesaId && (
                        <span className="text-sm font-black bg-slate-900 text-white px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-md">
                        Mesa {mesaId}
                        </span>
                    )}
                    {garcomNome && (
                        <div className="flex items-center justify-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm text-slate-900 font-extrabold shadow-sm border border-slate-900/10">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            GARÇOM: {garcomNome}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <CardContent className="p-6 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight" style={{ fontFamily: 'var(--font-titulo)' }}>Faça seu pedido!</h2>
            <CardDescription className="text-sm mt-1 font-semibold text-slate-500">
                Pague sem filas direto do guarda-sol.
            </CardDescription>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Como quer ser chamado?</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: João"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-2 border-slate-200 focus-visible:border-[#FFCC00] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 bg-slate-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">E-mail para o recibo</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-2 border-slate-200 focus-visible:border-[#FFCC00] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 bg-slate-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 90000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12 border-2 border-slate-200 focus-visible:border-[#FFCC00] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 bg-slate-50"
              />
            </div>

            <div className="flex items-start space-x-3 pt-2 p-3 rounded-xl border-2 border-slate-100 bg-slate-50 mt-4">
              <Checkbox 
                id="terms" 
                checked={termsAccepted} 
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-0.5 border-2 border-slate-300 data-[state=checked]:bg-[#FFCC00] data-[state=checked]:text-slate-900 data-[state=checked]:border-[#FFCC00] rounded"
              />
              <div className="grid gap-1 leading-none">
                <Label htmlFor="terms" className="text-sm font-extrabold text-slate-800 cursor-pointer tracking-tight">
                  Aceito os Termos de Uso
                </Label>
                <p className="text-[0.7rem] text-slate-500 font-semibold leading-snug">
                  Concordo com os Termos de Serviço e com a cobrança da taxa de conveniência digital para pedidos pelo aplicativo.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-[#FFCC00] font-black text-lg rounded-xl shadow-md mt-6 transition-transform active:scale-95 tracking-wide" disabled={loading}>
              {loading ? 'ACESSANDO...' : 'VER CARDÁPIO'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}