import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  getAllProductos,
  searchProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from './productsApi';

/**
 * Hook para la página Inventario.
 * Maneja: CRUD de productos, búsqueda, modales, alertas, imágenes, colores.
 */
export function useInventario() {
  // Estado: lista de productos
  const [products, setProducts] = useState([]);
  // Estado: modal activo ('add', 'edit', 'details' o null)
  const [activeModal, setActiveModal] = useState(null);
  // Estado: producto seleccionado para editar/ver detalles
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado: término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado: visibilidad del picker de colores
  const [showColorPicker, setShowColorPicker] = useState(false);
  // Referencia: input de archivos
  const fileInputRef = useRef(null);
  // Referencia: botón de guardar
  const saveButtonRef = useRef(null);

  // Estado: alerta (tipo, mensaje, visibilidad)
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  // Estado: confirmación de eliminación
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null, productName: '' });

  // Formulario con react-hook-form
  const { register, handleSubmit, reset, setValue, watch, trigger, formState: { errors, isSubmitting } } = useForm({
    mode: 'onChange',
    defaultValues: {
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
    }
  });

  // Valores observados del formulario
  const watchColores = watch("colores");
  const watchImagenesPreview = watch("imagenesPreview");
  const watchNuevaImagen = watch("nuevaImagen");
  const watchEliminarImagen = watch("eliminarImagen");

  /**
   * Carga productos desde la API.
   * Si hay búsqueda, filtra por nombre.
   */
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

  // Efecto: carga productos al montar y cuando cambia la búsqueda
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /** Muestra una alerta temporal */
  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
  };

  /** Oculta la alerta */
  const hideAlert = () => setAlert(prev => ({ ...prev, visible: false }));

  /**
   * Maneja la subida de una nueva imagen.
   * Valida tipo (JPG, PNG, WEBP) y tamaño (máx 5MB).
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      showAlert('error', 'Formato no válido. Usa JPG, PNG o WEBP.');
      return;
    }

    if (file.size > maxSize) {
      showAlert('error', 'La imagen excede 5MB.');
      return;
    }

    const preview = URL.createObjectURL(file);
    setValue("nuevaImagen", file);
    setValue("imagenesPreview", [preview]);
    setValue("eliminarImagen", false);
  };

  /** Elimina la imagen existente (sin subir nueva) */
  const handleRemoveExistingImage = () => {
    setValue("nuevaImagen", null);
    setValue("imagenesPreview", []);
    setValue("eliminarImagen", true);
  };

  /** Quita la previsualización de la nueva imagen */
  const removeSelectedImagePreview = () => {
    setValue("nuevaImagen", null);
    setValue("imagenesPreview", []);
  };

  /** Agrega un color a la lista */
  const addColor = (color) => {
    const current = watchColores || [];
    if (!current.includes(color)) {
      setValue("colores", [...current, color], { shouldValidate: true });
    }
    setShowColorPicker(false);
  };

  /** Elimina un color de la lista */
  const removeColor = (color) => {
    const current = watchColores || [];
    setValue("colores", current.filter(c => c !== color), { shouldValidate: true });
  };

  /** Abre modal para agregar nuevo producto */
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

  /** Abre modal para editar producto existente */
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

  /** Guarda producto (crea o actualiza) */
  const saveProduct = async (formData) => {
    const data = new FormData();
    data.append("nombre", formData.nombre.trim());
    data.append("descripcion", formData.descripcion?.trim() || "");
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("sucursal", formData.sucursal);
    data.append("descuento", formData.descuento || 0);

    if (formData.colores && formData.colores.length > 0) {
      formData.colores.forEach(color => data.append("colores", color));
    }

    if (activeModal === 'add' && !formData.nuevaImagen) {
      showAlert('error', 'Debes subir una imagen para el producto');
      return;
    }

    if (formData.nuevaImagen) {
      data.append("imagenesProductos", formData.nuevaImagen);
    } else if (formData.eliminarImagen) {
      data.append("removeImages", "true");
    }

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

  /** Solicita confirmación para eliminar */
  const requestDelete = (id, name) => {
    setConfirmDelete({ isOpen: true, productId: id, productName: name });
  };

  /** Confirma y ejecuta la eliminación */
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

  /** Abre modal de detalles del producto */
  const viewDetails = (product) => {
    setSelectedProduct(product);
    setActiveModal('details');
  };

  /** Interceptor del submit: solo el botón Guardar puede enviar */
  const handleFormSubmit = (e) => {
    if (e.nativeEvent.submitter !== saveButtonRef.current) {
      e.preventDefault();
      return;
    }
    handleSubmit(saveProduct)(e);
  };

  // Imagen actual del producto seleccionado
  const currentProductImage = selectedProduct?.imagenesProductos?.[0];

  return {
    products,
    activeModal,
    setActiveModal,
    selectedProduct,
    setSelectedProduct,
    searchTerm,
    setSearchTerm,
    showColorPicker,
    setShowColorPicker,
    fileInputRef,
    saveButtonRef,
    alert,
    confirmDelete,
    setConfirmDelete,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    errors,
    isSubmitting,
    watchColores,
    watchImagenesPreview,
    watchNuevaImagen,
    watchEliminarImagen,
    fetchProducts,
    showAlert,
    hideAlert,
    handleImageUpload,
    handleRemoveExistingImage,
    removeSelectedImagePreview,
    addColor,
    removeColor,
    openAddModal,
    openEditModal,
    saveProduct,
    requestDelete,
    confirmDeleteProduct,
    viewDetails,
    handleFormSubmit,
    currentProductImage,
  };
}
