import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Layout from './components/Layout'; 
import LoginPage from './pages/Login';
import RegistroPage from './pages/Registro';
import Recuperar1Page from './pages/RecuperarContraseña';
import Recuperar2Page from './pages/RecuperarContraseña1';
import Recuperar3Page from './pages/RecuperarContraseña2';
import Dashboard from './pages/Dashboard';
import Favoritos from './pages/Favoritos';
import Pedidos from './pages/Pedidos';
import Contacto from './pages/Contacto';
import CategoryPage from './pages/Categorypage';
import NotFound from './pages/NotFound'; 

function App() {
  return (
    <Router>
      <CartProvider>
        <SearchProvider>
          <Routes>
            {/* Rutas SIN layout (sin Navbar/Footer) */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/recuperar-contraseña" element={<Recuperar1Page />} />
            <Route path="/codigo-correo" element={<Recuperar2Page />} />
            <Route path="/nueva-contraseña" element={<Recuperar3Page />} />

            {/* Rutas CON layout (con Navbar y Footer) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/categoria/:categoryName" element={<CategoryPage />} />
            </Route>

            {/* Ruta 404 (sin layout) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SearchProvider>
      </CartProvider>
    </Router>
  );
}

export default App;