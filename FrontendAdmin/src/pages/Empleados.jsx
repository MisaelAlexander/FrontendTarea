import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import EmployeeFormModal from '../components/EmployeeFormModal';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import TableEmployees from '../components/TableEmployees';
import {
  getVendedores, createVendedor, updateVendedor, deleteVendedor,
  getRepartidores, createRepartidor, updateRepartidor, deleteRepartidor
} from '../hooks/empleadosApi';

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '', rol: '' });

  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

  const fetchEmpleados = useCallback(async () => {
    try {
      const [vendedores, repartidores] = await Promise.all([
        getVendedores(),
        getRepartidores()
      ]);
      const vendedoresConTipo = vendedores.map(v => ({ ...v, tipo: 'vendedor' }));
      const repartidoresConTipo = repartidores.map(r => ({ ...r, tipo: 'repartidor' }));
      let todos = [...vendedoresConTipo, ...repartidoresConTipo];
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

  const openAdd = () => {
    setSelectedEmpleado(null);
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
    // formData ya está completo, lo enviamos directamente
    if (esEdicion) {
      if (rol === 'vendedor') await updateVendedor(id, formData);
      else await updateRepartidor(id, formData);
      showAlert('success', 'Empleado actualizado');
    } else {
      if (rol === 'vendedor') await createVendedor(formData);
      else await createRepartidor(formData);
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
      else await deleteRepartidor(id);
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
        <h2 className="text-4xl font-black capitalize mb-8">Empleados</h2>
        <TableEmployees
          employees={empleados}
          onEdit={openEdit}
          onDelete={requestDelete}
          onViewDetails={openDetails}
          onAddNew={openAdd}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </main>

      <Modal isOpen={activeModal === 'form'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <EmployeeFormModal user={selectedEmpleado} onClose={() => setActiveModal(null)} onSave={handleSave} />
      </Modal>

      <Modal isOpen={activeModal === 'details'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <EmployeeDetailModal user={selectedEmpleado} onClose={() => setActiveModal(null)} onEdit={openEdit} onDelete={requestDelete} />
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