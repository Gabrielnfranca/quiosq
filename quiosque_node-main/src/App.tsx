import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QrCode } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuth } from './stores/auth';
import { useTenant } from './stores/tenant';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

function TenantResolver() {
  const { quiosqueId, mesaId } = useParams();
  const [searchParams] = useSearchParams();
  const garcomNome = searchParams.get('garcom');
  const { setTenant } = useTenant();

  useEffect(() => {
    if (quiosqueId && mesaId) {
      setTenant(quiosqueId, mesaId, garcomNome);
    }
  }, [quiosqueId, mesaId, garcomNome, setTenant]);

  return <Navigate to="/" replace />;
}
import { User } from '@supabase/supabase-js';
import { AuthUser } from './types';

function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    username: user.user_metadata?.username || user.email!.split('@')[0],
  };
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { quiosqueId, mesaId } = useTenant();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!quiosqueId || !mesaId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cyan-50 p-4 text-center">
        <div className="rounded-full bg-white p-6 shadow-xl mb-4">
          <QrCode className="h-16 w-16 text-cyan-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Escaneie o QR Code</h1>
        <p className="mt-2 text-gray-600 max-w-md">Para acessar o cardápio e fazer pedidos, você precisa escanear o QR Code que está na sua mesa ou guarda-sol.</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { login, logout, setLoading } = useAuth();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) login(mapSupabaseUser(session.user));
      if (mounted) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        login(mapSupabaseUser(session.user));
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        logout();
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        login(mapSupabaseUser(session.user));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [login, logout, setLoading]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/q/:quiosqueId/m/:mesaId" element={<TenantResolver />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
