// src/pages/Promociones.jsx
import { useState, useMemo } from 'react';
import TablePromotions from '../components/TablePromotions';
import Modal from '../components/Modal';
import PromotionModal from '../components/PromotionModal';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import initialPromotions from '../data/promotions';

// Lista de productos disponibles (podrías importarla desde inventario)
const availableProducts = [
  "Samsung Galaxy A56",
  "iPhone 15 Pro",
  "Xiaomi Redmi Note 13",
  "Laptop HP Pavilion",
  "Audífonos Sony WH-1000XM5",
  "Monitor LG 27\"",
  "Tarjeta Gráfica RTX 4070",
  "Teclado Mecánico RGB"
];

function Promociones() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [activeModal, setActiveModal] = useState(null); // 'form', 'details'
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

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
    setActiveModal('details'); // Puedes crear un modal de detalles si quieres
    // Por simplicidad, usaremos el mismo formulario en modo lectura o un modal simple
    // Pero aquí redirigimos a edición (opcional)
    setActiveModal('form');
  };

  const handleSave = (newPromotion) => {
    if (selectedPromotion) {
      // Editar
      setPromotions(promotions.map(p => p.id === selectedPromotion.id ? newPromotion : p));
      showAlert('success', `Promoción "${newPromotion.nombre}" actualizada`);
    } else {
      // Agregar
      setPromotions([newPromotion, ...promotions]);
      showAlert('success', `Promoción "${newPromotion.nombre}" creada`);
    }
    setActiveModal(null);
  };

  const requestDelete = (id, name) => setConfirmDelete({ open: true, id, name });
  const confirmDeletePromotion = () => {
    setPromotions(promotions.filter(p => p.id !== confirmDelete.id));
    showAlert('success', `Promoción "${confirmDelete.name}" eliminada`);
    setConfirmDelete({ open: false, id: null, name: '' });
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

      {/* Alertas */}
      <Alert type={alert.type} message={alert.message} isVisible={alert.visible} onClose={hideAlert} duration={3000} />

      {/* Confirmación de eliminación */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null, name: '' })}
        onConfirm={confirmDeletePromotion}
        title="Confirmar eliminación"
        message={`¿Eliminar la promoción "${confirmDelete.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de formulario */}
      <Modal isOpen={activeModal === 'form'} onClose={() => setActiveModal(null)} maxWidth="max-w-3xl">
        <PromotionModal
          promotion={selectedPromotion}
          products={availableProducts}
          onSave={handleSave}
          onClose={() => setActiveModal(null)}
        />
      </Modal>
    </div>
  );
}

export default Promociones;