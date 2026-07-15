import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/Login';
import RegistroPage from './pages/Registro';
import Recuperar1Page from './pages/RecuperarContraseña';
import Recuperar2Page from './pages/RecuperarContraseña1';
import Recuperar3Page from './pages/RecuperarContraseña2';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Favoritos from './pages/Favoritos';
import Pedidos from './pages/Pedidos';
import Pagos from './pages/Pagos';
import Promociones from './pages/Promociones';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <ToastProvider>
            <Routes>
              {/* HOME - Usando Layout universal */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="contacto" element={<Contacto />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>

              {/* LOGIN/REGISTRO - Solo sin sesion */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegistroPage />} />
                <Route path="/recuperar-contraseña" element={<Recuperar1Page />} />
                <Route path="/codigo-correo" element={<Recuperar2Page />} />
                <Route path="/nueva-contraseña" element={<Recuperar3Page />} />
              </Route>

              {/* RUTAS PRIVADAS (requieren login) */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/promociones" element={<Promociones />} />
              </Route>

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
