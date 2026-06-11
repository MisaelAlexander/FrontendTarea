// src/components/PromotionModal.jsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ChevronDown, Calendar, X, Tag } from 'lucide-react';

const PromotionModal = ({ promotion, products, onSave, onClose }) => {
  const esEdicion = !!promotion;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      nombre: promotion?.nombre || '',
      productos: promotion?.productos || [],
      fechaInicio: promotion?.fechaInicio || '',
      fechaFin: promotion?.fechaFin || '',
      descuento: promotion?.descuento || '',
      estado: promotion?.estado || 'Próxima'
    },
    mode: 'onChange'
  });

  const productosSeleccionados = watch('productos', []);
  const [productoActual, setProductoActual] = useState('');

  // Sincronizar si cambia la promoción desde afuera (edición)
  useEffect(() => {
    if (promotion) {
      setValue('nombre', promotion.nombre);
      setValue('productos', promotion.productos || []);
      setValue('fechaInicio', promotion.fechaInicio);
      setValue('fechaFin', promotion.fechaFin);
      setValue('descuento', promotion.descuento || '');
      setValue('estado', promotion.estado || 'Próxima');
    }
  }, [promotion, setValue]);

  const agregarProducto = () => {
    if (productoActual && !productosSeleccionados.includes(productoActual)) {
      setValue('productos', [...productosSeleccionados, productoActual]);
      setProductoActual('');
    }
  };

  const eliminarProducto = (producto) => {
    setValue('productos', productosSeleccionados.filter(p => p !== producto));
  };

  const onSubmit = (data) => {
    if (!data.nombre || !data.fechaInicio || !data.fechaFin || data.productos.length === 0) {
      alert('Completa todos los campos y agrega al menos un producto');
      return;
    }

    // Calcular estado automático según fechas
    const hoy = new Date();
    const inicio = new Date(data.fechaInicio);
    const fin = new Date(data.fechaFin);
    let estado = 'Próxima';
    if (hoy >= inicio && hoy <= fin) estado = 'Activa';
    else if (hoy > fin) estado = 'Vencida';
    else if (hoy < inicio) estado = 'Próxima';

    const nuevaPromocion = {
      id: promotion?.id || Date.now(),
      nombre: data.nombre,
      productos: data.productos,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      descuento: data.descuento ? Number(data.descuento) : undefined,
      estado
    };

    onSave(nuevaPromocion);
    onClose();
  };

  return (
    <div className="p-8 bg-white max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Nombre de la promoción *</label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              placeholder="Ej. Ofertas de Verano"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Descuento */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Descuento (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('descuento', { min: { value: 0, message: 'No puede ser negativo' } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              placeholder="Ej. 15"
            />
            {errors.descuento && <p className="text-red-500 text-xs mt-1">{errors.descuento.message}</p>}
          </div>

          {/* Selector de productos */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Producto *</label>
            <div className="flex gap-2">
              <select
                value={productoActual}
                onChange={(e) => setProductoActual(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="">Seleccionar producto...</option>
                {products.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={agregarProducto}
                className="px-4 py-2 bg-[#a3c9e6] text-black font-bold rounded-xl hover:bg-[#8eb6d4] transition-colors"
              >
                Agregar
              </button>
            </div>
            <p className="text-xs text-gray-400">Puedes agregar varios productos a esta promoción</p>
            {errors.productos && <p className="text-red-500 text-xs">{errors.productos.message}</p>}
          </div>

          {/* Fecha inicio */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de inicio *</label>
            <div className="relative">
              <input
                type="date"
                {...register('fechaInicio', { required: 'La fecha de inicio es obligatoria' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio.message}</p>}
          </div>

          {/* Fecha fin */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de finalización *</label>
            <div className="relative">
              <input
                type="date"
                {...register('fechaFin', { required: 'La fecha de finalización es obligatoria' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin.message}</p>}
          </div>

          {/* Estado (solo lectura) */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Estado (automático)</label>
            <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-600">
              {watch('estado')}
            </div>
          </div>
        </div>

        {/* Lista de productos seleccionados */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Productos en promoción</label>
          <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex flex-wrap gap-2">
            {productosSeleccionados.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center text-gray-400 py-4">
                <Tag size={28} />
                <p className="text-xs mt-1">Agrega productos desde la lista</p>
              </div>
            ) : (
              productosSeleccionados.map(prod => (
                <div key={prod} className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span className="text-blue-600">#</span> {prod}
                  <button
                    type="button"
                    onClick={() => eliminarProducto(prod)}
                    className="text-red-500 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2b5a8c] text-white font-bold rounded-xl hover:bg-[#1e4166] transition-colors shadow-md"
          >
            {esEdicion ? 'Actualizar' : 'Guardar Promoción'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionModal;