import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ChevronDown, Plus } from 'lucide-react';

const AdminFormModal = ({ admin, onClose, onSave }) => {
  const esEdicion = !!admin;

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      nombre: admin?.nombre || '',
      apellido: admin?.apellido || '',
      usuario: admin?.usuario || '',
      sucursal: admin?.sucursal || '',
      salario: admin?.salario || '',
      password: '', // campo de contraseña (en el form se llama password)
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

  const handleFileChange = (e, fieldName, previewField) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue(previewField, reader.result);
      reader.readAsDataURL(file);
      setValue(fieldName, file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    const safe = (val) => (val !== undefined && val !== null ? val : '');

    formData.append('nombre', safe(data.nombre));
    formData.append('apellido', safe(data.apellido));
    formData.append('usuario', safe(data.usuario));
    formData.append('sucursal', safe(data.sucursal));
    formData.append('salario', safe(data.salario));

    // Contraseña: se envía como 'password' (el backend lo espera así ahora)
    if (!esEdicion) {
      if (!data.password || data.password.trim() === '') {
        console.error('❌ Error: contraseña vacía en creación');
        return;
      }
      formData.append('password', data.password); // <-- ahora 'password'
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

    onSave(formData, esEdicion, admin?._id);
  };

  return (
    <div className="p-10 bg-white max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Nombre *</label>
              <input {...register('nombre', { required: 'El nombre es obligatorio' })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Sucursal *</label>
              <Controller
                name="sucursal"
                control={control}
                rules={{ required: 'Seleccione una sucursal' }}
                render={({ field }) => (
                  <div className="relative">
                    <select {...field} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl appearance-none bg-white">
                      <option value="">Seleccionar sucursal</option>
                      <option>San Salvador</option>
                      <option>Santa Tecla</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                )}
              />
              {errors.sucursal && <p className="text-red-500 text-xs">{errors.sucursal.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Apellidos *</label>
              <input {...register('apellido', { required: 'Los apellidos son obligatorios' })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" />
              {errors.apellido && <p className="text-red-500 text-xs">{errors.apellido.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Usuario *</label>
              <input {...register('usuario', { required: 'El usuario es obligatorio' })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" />
              {errors.usuario && <p className="text-red-500 text-xs">{errors.usuario.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Contraseña {!esEdicion && '*'}</label>
              <input type="password" {...register('password', { required: !esEdicion ? 'La contraseña es obligatoria' : false })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              {esEdicion && <p className="text-xs text-gray-400 mt-1">Dejar vacío para mantener la actual</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Salario *</label>
              <input type="number" step="0.01" {...register('salario', { required: 'El salario es obligatorio', min: 0 })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" />
              {errors.salario && <p className="text-red-500 text-xs">{errors.salario.message}</p>}
            </div>
          </div>
        </div>

        {/* Imágenes DUI y perfil */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-4">
              Imágenes de DUI {esEdicion && <span className="text-gray-400 font-normal">(no editable)</span>}
            </label>
            <div className="flex gap-4">
              <div onClick={!esEdicion ? () => duiFrontalFileRef.current.click() : undefined} className={`flex-1 border-2 border-dashed rounded-2xl aspect-[1.6/1] flex items-center justify-center overflow-hidden ${!esEdicion ? 'cursor-pointer' : ''}`}>
                {!esEdicion && <input type="file" ref={duiFrontalFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'duiFrontalFile', 'duiFrontalPreview')} />}
                {watch('duiFrontalPreview') ? <img src={watch('duiFrontalPreview')} className="w-full h-full object-cover" /> : <span className="font-bold">Frontal</span>}
              </div>
              <div onClick={!esEdicion ? () => duiTraseraFileRef.current.click() : undefined} className={`flex-1 border-2 border-dashed rounded-2xl aspect-[1.6/1] flex items-center justify-center overflow-hidden ${!esEdicion ? 'cursor-pointer' : ''}`}>
                {!esEdicion && <input type="file" ref={duiTraseraFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'duiTraseraFile', 'duiTraseraPreview')} />}
                {watch('duiTraseraPreview') ? <img src={watch('duiTraseraPreview')} className="w-full h-full object-cover" /> : <span className="font-bold">Trasera</span>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-4 text-right">Foto de perfil</label>
            <div className="flex justify-end">
              <div onClick={() => fotoPerfilFileRef.current.click()} className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden">
                <input type="file" ref={fotoPerfilFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'fotoPerfilFile', 'fotoPerfilPreview')} />
                {watch('fotoPerfilPreview') ? <img src={watch('fotoPerfilPreview')} className="w-full h-full object-cover" /> : <Plus size={32} className="text-gray-400" />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-12">
          <button type="button" onClick={onClose} className="px-10 py-3 bg-[#7eb0d5] text-white font-bold rounded-2xl hover:bg-blue-400">Cancelar</button>
          <button type="submit" className="px-10 py-3 bg-[#2b5a8c] text-white font-bold rounded-2xl hover:bg-[#1e4166]">Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormModal;