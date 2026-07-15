import { useState, useEffect } from 'react';
import { getPromociones, createPromocion, updatePromocion, deletePromocion } from './promocinesApi';
import { getAllProductos } from './productsApi';

/**
 * Hook para la página Promociones del admin.
 * Maneja: CRUD de promociones, lista de productos, cálculo de estado.
 */
export function usePromocionesAdmin() {
  // Estado: lista de promociones formateadas para el frontend
  const [promotions, setPromotions] = useState([]);
  // Estado: lista de productos disponibles
  const [productList, setProductList] = useState([]);
  // Estado: modal activo ('form' o null)
  const [activeModal, setActiveModal] = useState(null);
  // Estado: promoción seleccionada para editar
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  // Estado: alerta
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  // Estado: confirmación de eliminación
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  /** Muestra una alerta */
  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  /** Oculta la alerta */
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

  /**
   * Calcula el estado de una promoción según las fechas.
   * @param {Date} inicio - Fecha de inicio
   * @param {Date} fin - Fecha de fin
   * @returns {string} 'Activa', 'Vencida' o 'Próxima'
   */
  const calcularEstado = (inicio, fin) => {
    const hoy = new Date();
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    if (hoy >= inicioDate && hoy <= finDate) return 'Activa';
    if (hoy > finDate) return 'Vencida';
    return 'Próxima';
  };

  /** Carga promociones y productos desde la API */
  const fetchData = async () => {
    try {
      const [promos, productos] = await Promise.all([
        getPromociones(),
        getAllProductos()
      ]);
      // Transforma promociones para el frontend
      const promosFront = promos.map(p => ({
        id: p._id,
        nombre: p.nombre || `Promo ${p._id.slice(-4)}`,
        productos: p.IDproductos?.map(item => item.productos?.nombre || 'Sin nombre') || [],
        fechaInicio: p.fechaInicio?.slice(0, 10) || '',
        fechaFin: p.fechaFinalizacion?.slice(0, 10) || '',
        descuento: p.descuento,
        estado: calcularEstado(p.fechaInicio, p.fechaFinalizacion),
        rawProductos: p.IDproductos || [] // IDs originales para editar
      }));
      setPromotions(promosFront);
      setProductList(productos.map(prod => ({ id: prod._id, nombre: prod.nombre })));
    } catch (error) {
      showAlert('error', 'Error al cargar datos');
    }
  };

  // Efecto: carga datos al montar
  useEffect(() => { fetchData(); }, []);

  /** Abre modal para agregar nueva promoción */
  const openAddModal = () => {
    setSelectedPromotion(null);
    setActiveModal('form');
  };

  /** Abre modal para editar promoción existente */
  const openEditModal = (promo) => {
    setSelectedPromotion(promo);
    setActiveModal('form');
  };

  /** Abre modal de detalles (usa el mismo form) */
  const openDetailsModal = (promo) => {
    setSelectedPromotion(promo);
    setActiveModal('form');
  };

  /**
   * Guarda promoción (crea o actualiza).
   * Transforma los datos al formato del backend.
   */
  const handleSave = async (promoData) => {
    const payload = {
      nombre: promoData.nombre,
      IDproductos: promoData.productos.map(id => ({ productos: id })),
      descuento: promoData.descuento,
      fechaInicio: promoData.fechaInicio,
      fechaFinalizacion: promoData.fechaFin
    };

    try {
      if (selectedPromotion) {
        await updatePromocion(selectedPromotion.id, payload);
        showAlert('success', 'Promoción actualizada');
      } else {
        await createPromocion(payload);
        showAlert('success', 'Promoción creada');
      }
      fetchData();
      setActiveModal(null);
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Error al guardar');
    }
  };

  /** Solicita confirmación para eliminar */
  const requestDelete = (id, name) => setConfirmDelete({ open: true, id, name });

  /** Confirma y ejecuta la eliminación */
  const confirmDeletePromotion = async () => {
    try {
      await deletePromocion(confirmDelete.id);
      showAlert('success', `Promoción "${confirmDelete.name}" eliminada`);
      fetchData();
    } catch (error) {
      showAlert('error', 'Error al eliminar');
    } finally {
      setConfirmDelete({ open: false, id: null, name: '' });
    }
  };

  return {
    promotions,
    productList,
    activeModal,
    setActiveModal,
    selectedPromotion,
    setSelectedPromotion,
    alert,
    confirmDelete,
    setConfirmDelete,
    showAlert,
    hideAlert,
    fetchData,
    openAddModal,
    openEditModal,
    openDetailsModal,
    handleSave,
    requestDelete,
    confirmDeletePromotion,
  };
}
