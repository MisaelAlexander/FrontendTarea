import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import Modal from './Modal';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../hooks/bannerApi';
import { getAllProductos } from '../hooks/productsApi';

const BannerProductsTable = () => {
  const [banners, setBanners] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fotoInputRef = useRef(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { idProducto: '' }
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      if (productos.length === 0) {
        const data = await getAllProductos();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    reset({ idProducto: '' });
    setFotoFile(null);
    setFotoPreview(null);
    fetchProductos();
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    reset({ idProducto: banner.idProducto?._id || '' });
    setFotoFile(null);
    setFotoPreview(banner.FotoFondo || null);
    fetchProductos();
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!data.idProducto) {
      alert('Selecciona un producto');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('idProducto', data.idProducto);
      if (fotoFile) {
        formData.append('FotoFondo', fotoFile);
      }

      if (editingBanner) {
        await updateBanner(editingBanner._id, formData);
      } else {
        await createBanner(formData);
      }
      fetchBanners();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este banner?')) {
      try {
        await deleteBanner(id);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Productos en el banner</h2>
        <button onClick={openAddModal} className="bg-[#a8cbe3] text-black font-semibold px-6 sm:px-10 py-2.5 rounded-xl shadow-sm hover:bg-[#96bace] transition-colors border border-gray-300 w-full sm:w-auto flex items-center gap-2">
          <Plus size={18} /> Agregar
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#a8cbe3] text-black">
            <tr>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-center w-20 sm:w-24">Foto</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Nombre del Producto</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Descripción</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Precio con Descuento</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Descuento</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-400">
                  No hay productos en el banner
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 sm:py-3 px-3 sm:px-6 text-center">
                    <img src={banner.FotoFondo || '/placeholder.png'} alt={banner.idProducto?.nombre} className="w-10 h-10 sm:w-12 sm:h-12 object-contain mx-auto rounded" />
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">{banner.idProducto?.nombre || 'Sin nombre'}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-600 truncate max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm">{banner.idProducto?.descripcion || ''}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-6 font-medium text-gray-800 text-xs sm:text-sm">${banner.idProducto?.precio || 0}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">--</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-6">
                    <div className="flex justify-center items-center gap-1 sm:gap-2">
                      <button onClick={() => openEditModal(banner)} className="bg-[#5b8cff] text-white p-1.5 sm:p-2.5 rounded-lg hover:bg-blue-600"><Upload size={16} /></button>
                      <button onClick={() => handleDelete(banner._id)} className="bg-[#3548c7] text-white p-1.5 sm:p-2.5 rounded-lg hover:bg-blue-800"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <h3 className="text-xl font-bold">{editingBanner ? 'Editar Banner' : 'Agregar Banner'}</h3>
          
          <div>
            <label className="block text-sm font-bold mb-1">Producto *</label>
            <select
              {...register('idProducto', { required: 'Selecciona un producto' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="">Seleccionar producto...</option>
              {productos.map((prod) => (
                <option key={prod._id} value={prod._id}>{prod.nombre}</option>
              ))}
            </select>
            {errors.idProducto && <p className="text-red-500 text-xs mt-1">{errors.idProducto.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Foto de Fondo</label>
            <div
              onClick={() => fotoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {fotoPreview ? (
                <img src={fotoPreview} className="h-32 object-contain rounded" alt="preview" />
              ) : (
                <ImageIcon size={40} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-500">{fotoPreview ? 'Cambiar imagen' : 'Subir imagen'}</span>
              <input
                type="file"
                ref={fotoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-[#2b5a8c] text-white font-bold rounded-xl hover:bg-[#1e4166] transition-colors shadow-md">
              {editingBanner ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BannerProductsTable;