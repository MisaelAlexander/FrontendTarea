import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import EmployeeFormModal from '../components/EmployeeFormModal';
import AdminFormModal from '../components/AdminFormModal';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import TableEmployees from '../components/TableEmployees';
import {
  getVendedores, createVendedor, updateVendedor, deleteVendedor,
  getRepartidores, createRepartidor, updateRepartidor, deleteRepartidor
} from '../hooks/empleadosApi';
import {
  getAdministradores, createAdministrador, updateAdministrador, deleteAdministrador
} from '../hooks/adminApi';

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'form', 'details'
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [newEmployeeType, setNewEmployeeType] = useState('vendedor'); // tipo para creación
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '', rol: '' });

  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

  const fetchEmpleados = useCallback(async () => {
    try {
      const [vendedores, repartidores, administradores] = await Promise.all([
        getVendedores(),
        getRepartidores(),
        getAdministradores()
      ]);
      const vendedoresConTipo = vendedores.map(v => ({ ...v, tipo: 'vendedor' }));
      const repartidoresConTipo = repartidores.map(r => ({ ...r, tipo: 'repartidor' }));
      const administradoresConTipo = administradores.map(a => ({ ...a, tipo: 'administrador' }));

      let todos = [...vendedoresConTipo, ...repartidoresConTipo, ...administradoresConTipo];
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        todos = todos.filter(e =>
          e.nombre?.toLowerCase().includes(term) ||
          e.apellido?.toLowerCase().includes(term) ||
          e.usuario?.toLowerCase().includes(term)
        );
      }
      setEmpleados(todos);
    } catch (error) {
      showAlert('error', 'Error al cargar empleados');
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  // Abre formulario para nuevo empleado con el tipo predefinido
  const openAdd = (tipo) => {
    setSelectedEmpleado(null);
    setNewEmployeeType(tipo);
    setActiveModal('form');
  };

  const openEdit = (emp) => {
    setSelectedEmpleado(emp);
    setActiveModal('form');
  };

  const openDetails = (emp) => {
    setSelectedEmpleado(emp);
    setActiveModal('details');
  };

  const handleSave = async (formData, esEdicion, id, rol) => {
    try {
      if (esEdicion) {
        if (rol === 'vendedor') await updateVendedor(id, formData);
        else if (rol === 'repartidor') await updateRepartidor(id, formData);
        else if (rol === 'administrador') await updateAdministrador(id, formData);
        showAlert('success', 'Empleado actualizado');
      } else {
        // rol viene del modal o del estado newEmployeeType
        const tipo = rol || newEmployeeType;
        if (tipo === 'vendedor') await createVendedor(formData);
        else if (tipo === 'repartidor') await createRepartidor(formData);
        else if (tipo === 'administrador') await createAdministrador(formData);
        showAlert('success', 'Empleado creado');
      }
      fetchEmpleados();
      setActiveModal(null);
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Error al guardar');
    }
  };

  const requestDelete = (id, name, rol) => {
    setConfirmDelete({ open: true, id, name, rol });
  };

  const confirmDeleteEmployee = async () => {
    const { id, name, rol } = confirmDelete;
    try {
      if (rol === 'vendedor') await deleteVendedor(id);
      else if (rol === 'repartidor') await deleteRepartidor(id);
      else if (rol === 'administrador') await deleteAdministrador(id);
      showAlert('success', `Empleado ${name} eliminado`);
      fetchEmpleados();
    } catch (error) {
      showAlert('error', 'Error al eliminar');
    } finally {
      setConfirmDelete({ open: false, id: null, name: '', rol: '' });
      if (activeModal === 'details') setActiveModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-4xl font-black capitalize">Empleados</h2>
          <div className="flex gap-2">
            <button
              onClick={() => openAdd('vendedor')}
              className="px-4 py-2 bg-[#a3c9e6] text-black font-bold rounded-xl hover:bg-[#8eb6d4] transition-colors"
            >
              + Vendedor
            </button>
            <button
              onClick={() => openAdd('repartidor')}
              className="px-4 py-2 bg-[#a3c9e6] text-black font-bold rounded-xl hover:bg-[#8eb6d4] transition-colors"
            >
              + Repartidor
            </button>
            <button
              onClick={() => openAdd('administrador')}
              className="px-4 py-2 bg-[#a3c9e6] text-black font-bold rounded-xl hover:bg-[#8eb6d4] transition-colors"
            >
              + Administrador
            </button>
          </div>
        </div>
        <TableEmployees
          employees={empleados}
          onEdit={openEdit}
          onDelete={requestDelete}
          onViewDetails={openDetails}
          onAddNew={() => openAdd('vendedor')} // se mantiene compatibilidad, aunque ahora usamos botones separados
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </main>

      {/* Modal de formulario */}
      <Modal isOpen={activeModal === 'form'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        {selectedEmpleado?.tipo === 'administrador' || newEmployeeType === 'administrador' ? (
          <AdminFormModal
            admin={selectedEmpleado}
            onClose={() => setActiveModal(null)}
            onSave={(formData, esEdicion, id) => handleSave(formData, esEdicion, id, 'administrador')}
          />
        ) : (
          <EmployeeFormModal
            user={selectedEmpleado}
            onClose={() => setActiveModal(null)}
            onSave={(formData, esEdicion, id) => handleSave(formData, esEdicion, id, selectedEmpleado?.tipo || newEmployeeType)}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal === 'details'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <EmployeeDetailModal
          user={selectedEmpleado}
          onClose={() => setActiveModal(null)}
          onEdit={openEdit}
          onDelete={requestDelete}
        />
      </Modal>

      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null, name: '', rol: '' })}
        onConfirm={confirmDeleteEmployee}
        title="Confirmar eliminación"
        message={`¿Eliminar a ${confirmDelete.name}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
      <Alert isVisible={alert.visible} type={alert.type} message={alert.message} onClose={hideAlert} />
    </div>
  );
}

export default Empleados;