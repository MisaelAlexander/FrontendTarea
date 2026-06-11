// src/components/UserDetailModal.jsx
import { X, Copy } from 'lucide-react';

const UserDetailModal = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Podrías mostrar una alerta
  };

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden">
      <div className="bg-[#4a69bd] p-6 pb-12 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full">
          <X size={22} />
        </button>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
            <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.nombre} className="w-full h-full object-cover" />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{user.nombre}</h2>
            <p className="text-white/80 font-medium">{user.rol}</p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-10 space-y-6">
        <div>
          <h3 className="text-sm font-bold mb-3 text-gray-700">Información de cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-xl bg-gray-50">
              <span className="font-bold text-sm min-w-[60px]">Correo</span>
              <span className="text-sm text-gray-600 truncate">{user.correo || `${user.usuario}@tecno.com`}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-xl bg-gray-50">
              <span className="font-bold text-sm min-w-[60px]">Usuario</span>
              <span className="text-sm text-gray-600">{user.usuario}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2 border rounded-xl bg-gray-50">
              <span className="font-bold text-sm">Contraseña</span>
              <button onClick={() => handleCopy('********')} className="text-[10px] font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50">Copiar</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Fotos del DUI</h3>
            <div className="space-y-3">
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden aspect-[1.6/1] bg-gray-50 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold">Frontal</div>
                <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400" className="w-full h-full object-cover opacity-80" alt="" />
              </div>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden aspect-[1.6/1] bg-gray-50 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold">Reverso</div>
                <div className="w-full h-full bg-gray-100"></div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Datos Personales</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <span className="font-bold text-sm w-20">DUI</span>
                <span className="text-sm text-gray-600 font-mono">{user.dui}</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <span className="font-bold text-sm w-28">Fecha de Nac.</span>
                <span className="text-sm text-gray-600">{user.fecha}</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <span className="font-bold text-sm w-20">Salario</span>
                <span className="text-sm font-bold text-gray-700">${user.salario || '700.00'}</span>
              </div>
              {user.sucursal && (
                <div className="flex items-center gap-3 p-3 border rounded-xl">
                  <span className="font-bold text-sm w-20">Sucursal</span>
                  <span className="text-sm text-gray-600">{user.sucursal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-6 py-2 border border-blue-400 text-blue-600 rounded-xl font-bold hover:bg-blue-50">Cerrar</button>
          <button onClick={() => onDelete(user.id, user.nombre)} className="px-6 py-2 bg-[#2d3a8c] text-white rounded-xl font-bold hover:bg-red-700">Eliminar</button>
          <button onClick={() => onEdit(user)} className="px-6 py-2 bg-[#4a69bd] text-white rounded-xl font-bold hover:bg-blue-700">Actualizar</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;