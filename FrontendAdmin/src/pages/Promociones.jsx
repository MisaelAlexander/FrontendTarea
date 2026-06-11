import { useState, useEffect } from 'react';
import TablePromotions from '../components/TablePromotions';
import Modal from '../components/Modal';
import PromotionModal from '../components/PromotionModal';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import { getPromociones, createPromocion, updatePromocion, deletePromocion } from '../hooks/promocinesApi';
import { getAllProductos } from '../hooks/productsApi';

function Promociones() {
  const [promotions, setPromotions] = useState([]);
  const [productList, setProductList] = useState([]); // Array de { _id, nombre }
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

  // Cargar promociones y productos
  const fetchData = async () => {
    try {
      const [promos, productos] = await Promise.all([
        getPromociones(),
        getAllProductos()
      ]);
      // Transformar promociones para el frontend: extraer nombres de productos
      const promosFront = promos.map(p => ({
        id: p._id,
        nombre: p.nombre || `Promo ${p._id.slice(-4)}`,
        productos: p.IDproductos?.map(item => item.productos?.nombre || 'Sin nombre') || [],
        fechaInicio: p.fechaInicio?.slice(0, 10) || '',
        fechaFin: p.fechaFinalizacion?.slice(0, 10) || '',
        descuento: p.descuento,
        estado: calcularEstado(p.fechaInicio, p.fechaFinalizacion),
        // Guardamos los IDs originales para enviar al editar
        rawProductos: p.IDproductos || []
      }));
      setPromotions(promosFront);
      setProductList(productos.map(prod => ({ id: prod._id, nombre: prod.nombre })));
    } catch (error) {
      showAlert('error', 'Error al cargar datos');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const calcularEstado = (inicio, fin) => {
    const hoy = new Date();
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    if (hoy >= inicioDate && hoy <= finDate) return 'Activa';
    if (hoy > finDate) return 'Vencida';
    return 'Próxima';
  };

  const openAddModal = () => {
    setSelectedPromotion(null);
    setActiveModal('form');
  };

  const openEditModal = (promo) => {
    setSelectedPromotion(promo);
    setActiveModal('form');
  };

  const openDetailsModal = (promo) => {
    setSelectedPromotion(promo);
    setActiveModal('form'); // Puedes crear un modal de detalles aparte
  };

  const handleSave = async (promoData) => {
    // promoData viene del modal: { nombre, productos (IDs), fechaInicio, fechaFin, descuento }
    const payload = {
      nombre: promoData.nombre,
      IDproductos: promoData.productos.map(id => ({ productos: id })), // Formato del backend
      descuento: promoData.descuento,
      fechaInicio: promoData.fechaInicio,
      fechaFinalizacion: promoData.fechaFin
    };

    try {
      if (selectedPromotion) {
        // Editar
        await updatePromocion(selectedPromotion.id, payload);
        showAlert('success', 'Promoción actualizada');
      } else {
        // Crear
        await createPromocion(payload);
        showAlert('success', 'Promoción creada');
      }
      fetchData();
      setActiveModal(null);
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Error al guardar');
    }
  };

  const requestDelete = (id, name) => setConfirmDelete({ open: true, id, name });
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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Promociones</h2>
        <TablePromotions
          promotions={promotions}
          onEdit={openEditModal}
          onDelete={requestDelete}
          onViewDetails={openDetailsModal}
          onAddNew={openAddModal}
        />
      </main>

      <Alert type={alert.type} message={alert.message} isVisible={alert.visible} onClose={hideAlert} duration={3000} />

      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null, name: '' })}
        onConfirm={confirmDeletePromotion}
        title="Confirmar eliminación"
        message={`¿Eliminar la promoción "${confirmDelete.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      <Modal isOpen={activeModal === 'form'} onClose={() => setActiveModal(null)} maxWidth="max-w-3xl">
        <PromotionModal
          promotion={selectedPromotion}
          products={productList} // Ahora es array de { id, nombre }
          onSave={handleSave}
          onClose={() => setActiveModal(null)}
        />
      </Modal>
    </div>
  );
}

export default Promociones;