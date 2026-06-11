import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import ProductTable from '../components/TableProducts';
import Modal from '../components/Modal';
import AdvancedColorPicker from '../components/AdvancedColorPicker';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, CloudUpload, Pipette, X } from 'lucide-react';
import {
  getAllProductos,
  searchProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '../hooks/productsApi';

function Inventario() {
  const [products, setProducts] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'add', 'edit', 'details'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);
  const saveButtonRef = useRef(null);

  // Alert y confirmación
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null, productName: '' });

  // react-hook-form con todos los campos, incluyendo imagen
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      sucursal: "",
      descuento: 0,
      colores: [],
      imagenesPreview: [],     // solo para previsualización
      nuevaImagen: null,       // archivo nuevo si se sube
      eliminarImagen: false,   // flag para eliminar la imagen existente
    }
  });

  // Observamos valores que se usan en el JSX
  const watchColores = watch("colores");
  const watchImagenesPreview = watch("imagenesPreview");
  const watchNuevaImagen = watch("nuevaImagen");
  const watchEliminarImagen = watch("eliminarImagen");

  // Cargar productos
  const fetchProducts = useCallback(async () => {
    try {
      let data;
      if (searchTerm.trim()) {
        data = await searchProductos(searchTerm);
      } else {
        data = await getAllProductos();
      }
      setProducts(data);
    } catch (error) {
      showAlert('error', error.message);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
  };

  const hideAlert = () => setAlert(prev => ({ ...prev, visible: false }));

  // Manejo de imagen nueva (reemplaza automáticamente la antigua)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setValue("nuevaImagen", file);
    setValue("imagenesPreview", [preview]);
    setValue("eliminarImagen", false); // si se sube nueva, se anula la eliminación
  };

  // Eliminar la imagen existente (sin subir nueva)
  const handleRemoveExistingImage = () => {
    setValue("nuevaImagen", null);
    setValue("imagenesPreview", []);
    setValue("eliminarImagen", true);
  };

  // Quitar la previsualización de la nueva imagen (sin afectar la existente)
  const removeSelectedImagePreview = () => {
    setValue("nuevaImagen", null);
    setValue("imagenesPreview", []);
    // No tocamos eliminarImagen aquí, porque si ya estaba en true se mantiene, si no, sigue false
  };

  // Colores
  const addColor = (color) => {
    const current = watchColores || [];
    if (!current.includes(color)) {
      setValue("colores", [...current, color], { shouldValidate: true });
    }
    setShowColorPicker(false);
  };

  const removeColor = (color) => {
    const current = watchColores || [];
    setValue("colores", current.filter(c => c !== color), { shouldValidate: true });
  };

  // Abrir modal para agregar
  const openAddModal = () => {
    reset({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      sucursal: "",
      descuento: 0,
      colores: [],
      imagenesPreview: [],
      nuevaImagen: null,
      eliminarImagen: false,
    });
    setActiveModal('add');
  };

  // Abrir modal para editar
  const openEditModal = (product) => {
    setSelectedProduct(product);
    reset({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      sucursal: product.sucursal || "",
      descuento: product.descuento || 0,
      colores: product.colores || [],
      imagenesPreview: [],
      nuevaImagen: null,
      eliminarImagen: false,
    });
    setActiveModal('edit');
  };

  // Guardar producto (POST o PUT)
  const saveProduct = async (formData) => {
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion || "");
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("sucursal", formData.sucursal);
    data.append("descuento", formData.descuento || 0);

    // Colores
    if (formData.colores && formData.colores.length > 0) {
      formData.colores.forEach(color => data.append("colores", color));
    }

    // Imágenes: prioridad a nueva imagen; si no, atender eliminarImagen
    if (formData.nuevaImagen) {
      data.append("imagenesProductos", formData.nuevaImagen);
    } else if (formData.eliminarImagen) {
      data.append("removeImages", "true");
    }
    // Si no hay nueva imagen ni eliminarImagen, no se envía nada sobre imágenes (se mantienen)

    try {
      if (activeModal === 'add') {
        const res = await createProducto(data);
        showAlert('success', `Producto "${res.producto.nombre}" creado`);
      } else if (activeModal === 'edit' && selectedProduct) {
        await updateProducto(selectedProduct._id, data);
        showAlert('success', `Producto "${formData.nombre}" actualizado`);
      }
      fetchProducts();
      setActiveModal(null);
      setSelectedProduct(null);
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  // Eliminar producto
  const requestDelete = (id, name) => {
    setConfirmDelete({ isOpen: true, productId: id, productName: name });
  };

  const confirmDeleteProduct = async () => {
    const { productId, productName } = confirmDelete;
    try {
      await deleteProducto(productId);
      showAlert('success', `Producto "${productName}" eliminado`);
      fetchProducts();
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setConfirmDelete({ isOpen: false, productId: null, productName: '' });
    }
  };

  // Ver detalles
  const viewDetails = (product) => {
    setSelectedProduct(product);
    setActiveModal('details');
  };

  // Interceptor del submit: solo el botón Guardar puede enviar
  const handleFormSubmit = (e) => {
    if (e.nativeEvent.submitter !== saveButtonRef.current) {
      e.preventDefault();
      console.warn('Envío bloqueado porque no fue el botón Guardar.');
      return;
    }
    handleSubmit(saveProduct)(e);
  };

  // Obtener la imagen actual del producto seleccionado (para mostrarla en edición)
  const currentProductImage = selectedProduct?.imagenesProductos?.[0];

  return (
    <div className="min-h-screen bg-[#fdfcff] font-sans flex flex-col selection:bg-blue-200">
      <main className="flex-grow w-full max-w-[1200px] mx-auto p-8 pt-10">
        {/* Buscador */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-8 py-3 bg-[#a3c9e6] hover:bg-[#8eb6d4] text-black font-bold rounded-2xl transition-all shadow-sm border border-gray-200"
          >
            <Plus size={20} /> Agregar Producto
          </button>
        </div>

        {/* Tabla de productos */}
        <ProductTable
          products={products}
          onEdit={openEditModal}
          onDelete={requestDelete}
          onViewDetails={viewDetails}
        />
      </main>

      {/* Alerta */}
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.visible}
        onClose={hideAlert}
        duration={3000}
      />

      {/* Confirmación eliminar */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, productId: null, productName: '' })}
        onConfirm={confirmDeleteProduct}
        title="Confirmar eliminación"
        message={`¿Seguro que deseas eliminar "${confirmDelete.productName}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* MODAL AGREGAR / EDITAR */}
      <Modal isOpen={activeModal === 'add' || activeModal === 'edit'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <form onSubmit={handleFormSubmit} className="p-10">
          <h3 className="text-2xl font-bold mb-6">
            {activeModal === 'add' ? 'Nuevo Producto' : 'Editar Producto'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Nombre *</label>
                <input
                  {...register("nombre", { required: "El nombre es obligatorio" })}
                  className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-sm"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Descripción</label>
                <textarea
                  rows="4"
                  {...register("descripcion")}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-center">Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio", {
                      required: "Precio requerido",
                      min: { value: 0.01, message: "Debe ser mayor a 0" },
                      valueAsNumber: true,
                    })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-center"
                  />
                  {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-center">Stock *</label>
                  <input
                    type="number"
                    {...register("stock", {
                      required: "Stock requerido",
                      min: { value: 0, message: "No puede ser negativo" },
                      valueAsNumber: true,
                    })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-center"
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sucursal *</label>
                <select
                  {...register("sucursal", { required: "Selecciona una sucursal" })}
                  className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-sm"
                >
                  <option value="">Seleccionar sucursal</option>
                  <option value="Merliot">Merliot</option>
                  <option value="Central">Central</option>
                  <option value="Norte">Norte</option>
                </select>
                {errors.sucursal && <p className="text-red-500 text-xs mt-1">{errors.sucursal.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Descuento (%)</label>
                <input
                  type="number"
                  {...register("descuento", {
                    min: 0,
                    max: 100,
                    valueAsNumber: true,
                  })}
                  className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-sm"
                />
              </div>

              {/* Selector de colores */}
              <div className="relative">
                <label className="block text-sm font-bold mb-2">Colores Disponibles</label>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-sm flex justify-between items-center bg-white hover:border-blue-400"
                >
                  <span className="text-gray-400">Pulsar para elegir color</span>
                  <Pipette size={18} className="text-blue-600" />
                </button>
                {showColorPicker && (
                  <AdvancedColorPicker onSelectColor={addColor} onClose={() => setShowColorPicker(false)} />
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  {(watchColores || []).map(c => (
                    <div key={c} className="group relative">
                      <div
                        className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg"
                        style={{ backgroundColor: c }}
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(c)}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(watchColores || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic">No hay colores seleccionados.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: imágenes */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-4">Imagen del Producto</label>

                {/* Mostrar imagen actual SOLO si estamos en edición, existe imagen, no hay nueva y no se pidió eliminar */}
                {activeModal === 'edit' && currentProductImage && !watchNuevaImagen && !watchEliminarImagen && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Imagen actual:</p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border shadow-sm group">
                        <img src={currentProductImage.imagen} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={handleRemoveExistingImage}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Haz clic en la «X» para eliminar la imagen, o sube una nueva para reemplazarla.
                    </p>
                  </div>
                )}

                {/* Mensaje cuando se ha marcado eliminar la imagen existente */}
                {watchEliminarImagen && (
                  <div className="mb-4 p-3 bg-red-50 rounded-xl text-sm text-red-600">
                    La imagen actual será eliminada al guardar.
                  </div>
                )}

                {/* Zona de subida de nueva imagen */}
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all"
                >
                  <CloudUpload size={60} className="text-gray-300 mb-4" />
                  <p className="text-sm font-bold text-gray-600">Subir una imagen</p>
                  <p className="text-[10px] text-gray-400 mt-2">JPG, PNG o WEBP (Máx. 5MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Previsualización de la nueva imagen seleccionada */}
                {watchImagenesPreview && watchImagenesPreview.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {watchImagenesPreview.map((preview, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border group shadow-sm">
                        <img src={preview} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={removeSelectedImagePreview}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-6">
            <button type="button" onClick={() => setActiveModal(null)} className="px-10 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200">
              Cancelar
            </button>
            <button
              ref={saveButtonRef}
              type="submit"
              className="px-14 py-4 bg-[#2d3a8c] text-white font-bold rounded-2xl shadow-lg hover:bg-[#1e275e] transition-all"
            >
              {activeModal === 'add' ? 'Registrar Producto' : 'Actualizar Producto'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DETALLES */}
      <Modal isOpen={activeModal === 'details'} onClose={() => setActiveModal(null)} maxWidth="max-w-4xl">
        {selectedProduct && (
          <div className="p-8 bg-[#f8f9fa]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-[2.5rem] p-8 flex items-center justify-center border shadow-xl min-h-[400px]">
                <img
                  src={selectedProduct.imagenesProductos?.[0]?.imagen || "https://via.placeholder.com/300"}
                  className="max-h-72 object-contain rounded-2xl"
                  alt={selectedProduct.nombre}
                />
              </div>
              <div className="bg-white rounded-[2.5rem] p-12 border shadow-xl">
                <h3 className="text-4xl font-black mb-1">{selectedProduct.nombre}</h3>
                <p className="text-4xl font-bold text-blue-600 mb-2">${selectedProduct.precio}</p>
                <p className="text-sm text-gray-500 mb-4">Sucursal: {selectedProduct.sucursal}</p>
                <p className="text-sm text-gray-500 mb-4">Descuento: {selectedProduct.descuento || 0}%</p>
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <p className="text-sm text-gray-600">{selectedProduct.descripcion}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase text-gray-800">Colores</p>
                  <div className="flex flex-wrap gap-4">
                    {(selectedProduct.colores || []).map(c => (
                      <div key={c} className="flex flex-col items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full border-4 border-white shadow-md"
                          style={{ backgroundColor: c }}
                        />
                        <span className="text-[9px] font-mono uppercase text-gray-400">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm">Stock: {selectedProduct.stock} uds.</p>
              </div>
            </div>
            <div className="flex justify-end bg-white p-6 rounded-[2rem] border shadow-sm">
              <button onClick={() => setActiveModal(null)} className="px-16 py-4 bg-[#2d3a8c] text-white rounded-2xl font-bold">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Inventario;