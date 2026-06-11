import { Search, Plus, Upload, Trash2, Users, UserX } from 'lucide-react';

const TableEmployees = ({ employees, onEdit, onDelete, onViewDetails, onAddNew, searchTerm, setSearchTerm }) => {
  const isEmpty = employees.length === 0;
  const noData = employees.length === 0 && !searchTerm;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
          />
        </div>
        <button onClick={onAddNew} className="flex items-center gap-2 px-8 py-3 bg-[#a3c9e6] hover:bg-[#8eb6d4] text-black font-bold rounded-xl transition-all shadow-sm">
          <Plus size={20} /> Agregar
        </button>
      </div>

      <div className="overflow-hidden border border-gray-300 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-base">
              <thead className="sticky top-0 z-10 bg-[#b4d4e8] shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-800">Nombre</th>
                  <th className="px-6 py-4 font-bold text-gray-800 text-center">Usuario</th>
                  <th className="px-6 py-4 font-bold text-gray-800 text-center">Rol</th>
                  <th className="px-6 py-4 font-bold text-gray-800 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isEmpty ? (
                  <tr>
                    <td colSpan="4" className="text-center py-16">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                        {noData ? (
                          <>
                            <Users size={56} strokeWidth={1.5} />
                            <p className="text-xl font-medium">No hay empleados registrados</p>
                            <p className="text-base">Haz clic en "Agregar" para comenzar</p>
                          </>
                        ) : (
                          <>
                            <UserX size={56} strokeWidth={1.5} />
                            <p className="text-xl font-medium">No se encontraron empleados</p>
                            <p className="text-base">Prueba con otros términos de búsqueda</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 border-r border-gray-200/50 font-medium whitespace-nowrap">{emp.nombre} {emp.apellido}</td>
                      <td className="px-6 py-4 border-r border-gray-200/50 text-center text-gray-600 whitespace-nowrap">{emp.usuario}</td>
                      <td className="px-6 py-4 border-r border-gray-200/50 text-center text-gray-600 capitalize whitespace-nowrap">{emp.tipo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => onEdit(emp)} className="p-2 bg-[#5c8eff] text-white rounded-lg hover:bg-blue-600 transition-colors" title="Editar"><Upload size={18} /></button>
                          <button onClick={() => onDelete(emp._id, `${emp.nombre} ${emp.apellido}`, emp.tipo)} className="p-2 bg-[#2d3a8c] text-white rounded-lg hover:bg-red-800 transition-colors" title="Eliminar"><Trash2 size={18} /></button>
                          <button onClick={() => onViewDetails(emp)} className="bg-[#5c8eff] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">Ver más</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableEmployees;