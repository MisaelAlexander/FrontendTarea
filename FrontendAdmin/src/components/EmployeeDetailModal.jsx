import { X } from 'lucide-react';

const EmployeeDetailModal = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;
  return (
    <div className="relative bg-white">
      <div className="bg-[#4a69bd] p-8 pb-16 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full"><X size={24} /></button>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
            <img src={user.fotoPerfil || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.nombre} className="w-full h-full object-cover" />
          </div>
          <div className="text-white">
            <h2 className="text-3xl font-bold">{user.nombre} {user.apellido}</h2>
            <p className="text-white/80 text-lg">{user.tipo === 'vendedor' ? 'Vendedor' : 'Repartidor'}</p>
          </div>
        </div>
      </div>
      <div className="p-8 -mt-8 bg-white rounded-t-3xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-3"><span className="font-bold">Correo:</span> {user.usuario}@tecno.com</div>
          <div className="border rounded-xl p-3"><span className="font-bold">Usuario:</span> {user.usuario}</div>
          <div className="border rounded-xl p-3 flex justify-between"><span className="font-bold">Contraseña:</span> <button className="text-blue-600 text-xs border px-2 py-1 rounded">Copiar</button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-2">Fotos DUI</h3>
            <div className="space-y-2">
              {user.DUI?.map((img, idx) => (
                <div key={idx} className="border rounded-xl overflow-hidden aspect-[1.6/1]">
                  <img src={img.imagenDUI} className="w-full h-full object-cover" />
                </div>
              ))}
              {(!user.DUI || user.DUI.length === 0) && <p className="text-gray-400">No hay imágenes</p>}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Datos Personales</h3>
            <div className="space-y-3">
              <div className="border rounded-xl p-3"><span className="font-bold">DUI:</span> {user.dui || 'No registrado'}</div>
              <div className="border rounded-xl p-3"><span className="font-bold">Fecha Nac.:</span> {user.fechaNacimiento || 'No registrada'}</div>
              <div className="border rounded-xl p-3"><span className="font-bold">Salario:</span> ${user.salario}</div>
              <div className="border rounded-xl p-3"><span className="font-bold">Sucursal:</span> {user.sucursal}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button onClick={() => onEdit(user)} className="px-8 py-3 bg-[#4a69bd] text-white rounded-xl hover:bg-blue-700">Actualizar</button>
          <button onClick={() => onDelete(user._id, `${user.nombre} ${user.apellido}`, user.tipo)} className="px-8 py-3 bg-[#2d3a8c] text-white rounded-xl hover:bg-red-700">Eliminar</button>
          <button onClick={onClose} className="px-8 py-3 border border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;