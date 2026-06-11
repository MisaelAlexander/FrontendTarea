import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LoginPage from './pages/Login.jsx';
import Recuperar1Page from './pages/RecuperarContraseña.jsx';
import Recuperar2Page from './pages/RecuperarContraseña1.jsx';
import Recuperar3Page from './pages/RecuperarContraseña2.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import Inventario from './pages/Inventario.jsx';
import Empleados from './pages/Empleados.jsx';
import Promociones from './pages/Promociones.jsx';

// Layout para páginas con navbar y footer
function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin navbar/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-contraseña" element={<Recuperar1Page />} />
        <Route path="/codigo-correo" element={<Recuperar2Page />} />
        <Route path="/nueva-contraseña" element={<Recuperar3Page />} />

        {/* Rutas protegidas con navbar y footer */}
        <Route path="/dashboard" element={
          <MainLayout><Dashboard /></MainLayout>
        } />
        <Route path="/inventario" element={
          <MainLayout><Inventario /></MainLayout>
        } />
        <Route path="/empleados" element={
          <MainLayout><Empleados /></MainLayout>
        } />
        <Route path="/promociones" element={
          <MainLayout><Promociones /></MainLayout>
        } />

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;