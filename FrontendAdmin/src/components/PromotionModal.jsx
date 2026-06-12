import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, X, Tag, Info } from 'lucide-react';

const PromotionModal = ({ promotion, products, onSave, onClose }) => {
  const esEdicion = !!promotion;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      nombre: promotion?.nombre || '',
      productos: promotion?.rawProductos?.map(item => item.productos?._id || item.productos) || [],
      fechaInicio: promotion?.fechaInicio || '',
      fechaFin: promotion?.fechaFin || '',
      descuento: promotion?.descuento || '',
    },
    mode: 'onChange'
  });

  const productosSeleccionados = watch('productos', []);
  const [productoActual, setProductoActual] = useState('');

  useEffect(() => {
    if (promotion) {
      setValue('nombre', promotion.nombre);
      setValue('productos', promotion.rawProductos?.map(item => item.productos?._id || item.productos) || []);
      setValue('fechaInicio', promotion.fechaInicio);
      setValue('fechaFin', promotion.fechaFin);
      setValue('descuento', promotion.descuento || '');
    }
  }, [promotion, setValue]);

  const agregarProducto = () => {
    if (productoActual && !productosSeleccionados.includes(productoActual)) {
      const nuevosProductos = [...productosSeleccionados, productoActual];
      setValue('productos', nuevosProductos, { shouldValidate: true });
      setProductoActual('');
    }
  };

  const eliminarProducto = (idProducto) => {
    const nuevosProductos = productosSeleccionados.filter(id => id !== idProducto);
    setValue('productos', nuevosProductos, { shouldValidate: true });
  };

  // Validación personalizada de fechas
  const validateDates = (fechaFin, formValues) => {
    const fechaInicio = formValues?.fechaInicio;
    if (!fechaInicio || !fechaFin) return true;
    return new Date(fechaFin) > new Date(fechaInicio) || 'La fecha de fin debe ser posterior a la fecha de inicio';
  };

  const onSubmit = async (data) => {
    // El estado se calcula automáticamente en base a las fechas, no se envía
    const nuevaPromocion = {
      id: promotion?.id,
      nombre: data.nombre,
      productos: data.productos,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      descuento: data.descuento ? Number(data.descuento) : undefined
    };

    await onSave(nuevaPromocion);
    onClose();
  };

  const getProductName = (id) => {
    const prod = products.find(p => p.id === id);
    return prod ? prod.nombre : id;
  };

  return (
    <div className="p-8 bg-white max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Nombre de la promoción *</label>
            <input
              type="text"
              {...register('nombre', { 
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 100, message: 'Máximo 100 caracteres' }
              })}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
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
              {...register('descuento', { 
                min: { value: 0, message: 'No puede ser negativo' },
                max: { value: 100, message: 'No puede superar el 100%' },
                valueAsNumber: true,
                validate: value => !value || (value >= 0 && value <= 100) || 'Valor entre 0 y 100'
              })}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none ${
                errors.descuento ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. 15"
            />
            {errors.descuento && <p className="text-red-500 text-xs mt-1">{errors.descuento.message}</p>}
          </div>

          {/* Selector de productos */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Productos *</label>
            <div className="flex gap-2">
              <select
                value={productoActual}
                onChange={(e) => setProductoActual(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="">Seleccionar producto...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
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
            {/* Validación de productos: al menos uno */}
            <input
              type="hidden"
              {...register('productos', { 
                validate: value => value && value.length > 0 || 'Debes seleccionar al menos un producto'
              })}
            />
            {errors.productos && <p className="text-red-500 text-xs mt-1">{errors.productos.message}</p>}
          </div>

          {/* Fecha inicio */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de inicio *</label>
            <div className="relative">
              <input
                type="date"
                {...register('fechaInicio', { 
                  required: 'La fecha de inicio es obligatoria',
                  validate: {
                    notFuture: value => new Date(value) <= new Date() || 'No puede ser una fecha futura (opcional, comenta si no aplica)',
                    // Puedes quitar la línea anterior si permites fechas futuras
                  }
                })}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none ${
                  errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                }`}
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
                {...register('fechaFin', { 
                  required: 'La fecha de finalización es obligatoria',
                  validate: (value, formValues) => {
                    if (!value) return true;
                    const inicio = formValues.fechaInicio;
                    if (!inicio) return true;
                    return new Date(value) > new Date(inicio) || 'La fecha de fin debe ser posterior a la fecha de inicio';
                  }
                })}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none ${
                  errors.fechaFin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin.message}</p>}
          </div>
        </div>

        {/* Mensaje sobre el estado automático */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            El <strong>estado</strong> de la promoción se asigna automáticamente según las fechas indicadas:
            <br />
            <span className="inline-block mt-1">
              <span className="font-medium">Activa</span> si la fecha actual está dentro del rango,
              <span className="font-medium"> Próxima</span> si aún no ha comenzado, y
              <span className="font-medium"> Vencida</span> si ya finalizó.
            </span>
          </p>
        </div>

        {/* Lista de productos seleccionados */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Productos en promoción</label>
          <div className={`min-h-[100px] p-4 border-2 border-dashed rounded-xl bg-gray-50/50 flex flex-wrap gap-2 ${
            errors.productos ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
          }`}>
            {productosSeleccionados.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center text-gray-400 py-4">
                <Tag size={28} />
                <p className="text-xs mt-1">Agrega productos desde la lista</p>
              </div>
            ) : (
              productosSeleccionados.map(id => (
                <div key={id} className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span className="text-blue-600">#</span> {getProductName(id)}
                  <button
                    type="button"
                    onClick={() => eliminarProducto(id)}
                    className="text-red-500 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          {errors.productos && (
            <p className="text-red-500 text-xs mt-2">{errors.productos.message}</p>
          )}
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#2b5a8c] text-white font-bold rounded-xl hover:bg-[#1e4166] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar Promoción')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionModal;