import { useState, useEffect, useCallback } from 'react';
import {
  getVendedores, createVendedor, updateVendedor, deleteVendedor,
  getRepartidores, createRepartidor, updateRepartidor, deleteRepartidor
} from './empleadosApi';
import {
  getAdministradores, createAdministrador, updateAdministrador, deleteAdministrador
} from './adminApi';

/**
 * Hook para la página Empleados.
 * Maneja: CRUD de vendedores, repartidores y administradores.
 */
export function useEmpleados() {
  // Estado: lista de empleados (todos los tipos combinados)
  const [empleados, setEmpleados] = useState([]);
  // Estado: modal activo ('form', 'details' o null)
  const [activeModal, setActiveModal] = useState(null);
  // Estado: empleado seleccionado para editar/ver detalles
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  // Estado: tipo de empleado a crear ('vendedor', 'repartidor', 'administrador')
  const [newEmployeeType, setNewEmployeeType] = useState('vendedor');
  // Estado: término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Estado: alerta
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  // Estado: confirmación de eliminación
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '', rol: '' });

  /** Muestra una alerta */
  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  /** Oculta la alerta */
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

  /**
   * Carga todos los empleados (vendedores, repartidores, administradores).
   * Filtra por búsqueda si hay término.
   */
  const fetchEmpleados = useCallback(async () => {
    try {
      const [vendedores, repartidores, administradores] = await Promise.all([
        getVendedores(),
        getRepartidores(),
        getAdministradores()
      ]);
      // Agrega tipo a cada empleado
      const vendedoresConTipo = vendedores.map(v => ({ ...v, tipo: 'vendedor' }));
      const repartidoresConTipo = repartidores.map(r => ({ ...r, tipo: 'repartidor' }));
      const administradoresConTipo = administradores.map(a => ({ ...a, tipo: 'administrador' }));

      let todos = [...vendedoresConTipo, ...repartidoresConTipo, ...administradoresConTipo];
      // Filtra por búsqueda
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

  // Efecto: carga empleados al montar y cuando cambia la búsqueda
  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  /** Abre formulario para nuevo empleado con el tipo predefinido */
  const openAdd = (tipo) => {
    setSelectedEmpleado(null);
    setNewEmployeeType(tipo);
    setActiveModal('form');
  };

  /** Abre formulario para editar empleado existente */
  const openEdit = (emp) => {
    setSelectedEmpleado(emp);
    setActiveModal('form');
  };

  /** Abre modal de detalles del empleado */
  const openDetails = (emp) => {
    setSelectedEmpleado(emp);
    setActiveModal('details');
  };

  /**
   * Guarda empleado (crea o actualiza).
   * @param {FormData} formData - Datos del formulario
   * @param {boolean} esEdicion - Si es edición o creación
   * @param {string} id - ID del empleado (solo edición)
   * @param {string} rol - Tipo de empleado
   */
  const handleSave = async (formData, esEdicion, id, rol) => {
    try {
      if (esEdicion) {
        if (rol === 'vendedor') await updateVendedor(id, formData);
        else if (rol === 'repartidor') await updateRepartidor(id, formData);
        else if (rol === 'administrador') await updateAdministrador(id, formData);
        showAlert('success', 'Empleado actualizado');
      } else {
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

  /** Solicita confirmación para eliminar */
  const requestDelete = (id, name, rol) => {
    setConfirmDelete({ open: true, id, name, rol });
  };

  /** Confirma y ejecuta la eliminación */
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

  return {
    empleados,
    activeModal,
    setActiveModal,
    selectedEmpleado,
    setSelectedEmpleado,
    newEmployeeType,
    setNewEmployeeType,
    searchTerm,
    setSearchTerm,
    alert,
    confirmDelete,
    setConfirmDelete,
    showAlert,
    hideAlert,
    fetchEmpleados,
    openAdd,
    openEdit,
    openDetails,
    handleSave,
    requestDelete,
    confirmDeleteEmployee,
  };
}
