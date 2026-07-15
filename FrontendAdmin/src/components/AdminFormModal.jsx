import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ChevronDown, Plus } from 'lucide-react';

const AdminFormModal = ({ admin, onClose, onSave }) => {
  const esEdicion = !!admin;

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      nombre: admin?.nombre || '',
      apellido: admin?.apellido || '',
      correo: admin?.correo || '',
      usuario: admin?.usuario || '',
      sucursal: admin?.sucursal || '',
      salario: admin?.salario || '',
      password: '',
      fotoPerfilPreview: admin?.fotoPerfil || null,
      duiFrontalPreview: admin?.DUI?.[0]?.imagenDUI || null,
      duiTraseraPreview: admin?.DUI?.[1]?.imagenDUI || null,
      fotoPerfilFile: null,
      duiFrontalFile: null,
      duiTraseraFile: null,
    },
    mode: 'onChange',
  });

  const fotoPerfilFileRef = useRef(null);
  const duiFrontalFileRef = useRef(null);
  const duiTraseraFileRef = useRef(null);

  // Validación de archivos con tipo y tamaño
  const handleFileChange = (e, fieldName, previewField) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        alert('Formato no válido. Usa JPG, PNG o WEBP.');
        return;
      }
      if (file.size > maxSize) {
        alert('La imagen excede 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setValue(previewField, reader.result);
      reader.readAsDataURL(file);
      setValue(fieldName, file);
      // Revalidar DUI si aplica
      if (fieldName === 'duiFrontalFile' || fieldName === 'duiTraseraFile') {
        setValue('duiCompleto', !!(watch('duiFrontalFile') || file) && !!(watch('duiTraseraFile') || (fieldName === 'duiTraseraFile' ? file : watch('duiTraseraFile'))));
      }
    }
  };

  // Validación personalizada para DUI (solo en creación)
  const validateDUI = () => {
    if (!esEdicion) {
      const frontal = watch('duiFrontalFile');
      const trasera = watch('duiTraseraFile');
      return (frontal && trasera) || 'Debes subir ambas caras del DUI (frontal y trasera)';
    }
    return true;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    const safe = (val) => (val !== undefined && val !== null ? val : '');

    formData.append('nombre', safe(data.nombre));
    formData.append('apellido', safe(data.apellido));
    formData.append('correo', safe(data.correo));
    formData.append('usuario', safe(data.usuario));
    formData.append('sucursal', safe(data.sucursal));
    formData.append('salario', safe(data.salario));

    if (!esEdicion) {
      if (!data.password || data.password.trim() === '') {
        console.error('❌ Error: contraseña vacía en creación');
        return;
      }
      formData.append('password', data.password);
    } else {
      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password);
      }
    }

    if (data.fotoPerfilFile) formData.append('fotoPerfil', data.fotoPerfilFile);
    if (!esEdicion) {
      if (data.duiFrontalFile) formData.append('imagenesDUI', data.duiFrontalFile);
      if (data.duiTraseraFile) formData.append('imagenesDUI', data.duiTraseraFile);
    }

    await onSave(formData, esEdicion, admin?._id);
  };

  return (
    <div className="p-10 bg-white max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Nombre *</label>
              <input
                {...register('nombre', {
                  required: 'El nombre es obligatorio',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  maxLength: { value: 50, message: 'Máximo 50 caracteres' }
                })}
                className={`w-full px-4 py-3 border-2 rounded-2xl ${
                  errors.nombre ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Sucursal *</label>
              <Controller
                name="sucursal"
                control={control}
                rules={{ required: 'Seleccione una sucursal' }}
                render={({ field }) => (
                  <div className="relative">
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border-2 rounded-2xl appearance-none bg-white ${
                        errors.sucursal ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                    >
                      <option value="">Seleccionar sucursal</option>
                      <option>San Salvador</option>
                      <option>Santa Tecla</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                )}
              />
              {errors.sucursal && <p className="text-red-500 text-xs mt-1">{errors.sucursal.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Correo electrónico *</label>
              <input
                type="email"
                {...register('correo', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Correo electrónico inválido'
                  }
                })}
                className={`w-full px-4 py-3 border-2 rounded-2xl ${
                  errors.correo ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Apellidos *</label>
              <input
                {...register('apellido', {
                  required: 'Los apellidos son obligatorios',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  maxLength: { value: 50, message: 'Máximo 50 caracteres' }
                })}
                className={`w-full px-4 py-3 border-2 rounded-2xl ${
                  errors.apellido ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Usuario *</label>
              <input
                {...register('usuario', {
                  required: 'El usuario es obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                  pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Solo letras, números y guión bajo' }
                })}
                className={`w-full px-4 py-3 border-2 rounded-2xl ${
                  errors.usuario ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.usuario && <p className="text-red-500 text-xs mt-1">{errors.usuario.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Contraseña {!esEdicion && '*'}</label>
              <input
                type="password"
                {...register('password', {
                  required: !esEdicion ? 'La contraseña es obligatoria' : false,
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
                className={`w-full px-4 py-3 border-2 rounded-2xl ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              {esEdicion && <p className="text-xs text-gray-400 mt-1">Dejar vacío para mantener la actual</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Salario *</label>
              <input
                type="number"
                step="0.01"
                {...register('salario', {
                  required: 'El salario es obligatorio',
                  min: { value: 0, message: 'No puede ser negativo' },
                  max: { value: 100000, message: 'Valor demasiado alto' },
                  valueAsNumber: true
                })}
                className={`w-full px-4 py-3 border-2 rounded-2xl ${
                  errors.salario ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.salario && <p className="text-red-500 text-xs mt-1">{errors.salario.message}</p>}
            </div>
          </div>
        </div>

        {/* Imágenes DUI y perfil */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-4">
              Imágenes de DUI {!esEdicion && <span className="text-red-500">*</span>}
              {esEdicion && <span className="text-gray-400 font-normal ml-1">(no editable)</span>}
            </label>
            <div className="flex gap-4">
              {/* Frontal */}
              <div
                onClick={!esEdicion ? () => duiFrontalFileRef.current.click() : undefined}
                className={`flex-1 border-2 border-dashed rounded-2xl aspect-[1.6/1] flex items-center justify-center overflow-hidden transition-colors ${
                  !esEdicion ? 'cursor-pointer hover:border-blue-400' : ''
                } ${
                  errors.duiCompleto && !esEdicion ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              >
                {!esEdicion && (
                  <input type="file" ref={duiFrontalFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'duiFrontalFile', 'duiFrontalPreview')} />
                )}
                {watch('duiFrontalPreview') ? (
                  <img src={watch('duiFrontalPreview')} className="w-full h-full object-cover" alt="DUI frontal" />
                ) : (
                  <span className="font-bold text-gray-500">Frontal</span>
                )}
              </div>

              {/* Trasera */}
              <div
                onClick={!esEdicion ? () => duiTraseraFileRef.current.click() : undefined}
                className={`flex-1 border-2 border-dashed rounded-2xl aspect-[1.6/1] flex items-center justify-center overflow-hidden transition-colors ${
                  !esEdicion ? 'cursor-pointer hover:border-blue-400' : ''
                } ${
                  errors.duiCompleto && !esEdicion ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              >
                {!esEdicion && (
                  <input type="file" ref={duiTraseraFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'duiTraseraFile', 'duiTraseraPreview')} />
                )}
                {watch('duiTraseraPreview') ? (
                  <img src={watch('duiTraseraPreview')} className="w-full h-full object-cover" alt="DUI trasera" />
                ) : (
                  <span className="font-bold text-gray-500">Trasera</span>
                )}
              </div>
            </div>
            {/* Validación de DUI oculta */}
            {!esEdicion && (
              <input
                type="hidden"
                {...register('duiCompleto', { validate: validateDUI })}
              />
            )}
            {errors.duiCompleto && !esEdicion && (
              <p className="text-red-500 text-xs mt-2">{errors.duiCompleto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-4 text-right">Foto de perfil</label>
            <div className="flex justify-end">
              <div
                onClick={() => fotoPerfilFileRef.current.click()}
                className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors"
              >
                <input type="file" ref={fotoPerfilFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'fotoPerfilFile', 'fotoPerfilPreview')} />
                {watch('fotoPerfilPreview') ? (
                  <img src={watch('fotoPerfilPreview')} className="w-full h-full object-cover" alt="Perfil" />
                ) : (
                  <Plus size={32} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-12">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-3 bg-[#7eb0d5] text-white font-bold rounded-2xl hover:bg-blue-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-[#2b5a8c] text-white font-bold rounded-2xl hover:bg-[#1e4166] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormModal;