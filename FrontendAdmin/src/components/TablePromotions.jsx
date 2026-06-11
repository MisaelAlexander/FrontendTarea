// src/components/TablePromotions.jsx
import { useState } from 'react';
import { Search, Plus, Upload, Trash2 } from 'lucide-react';

const TablePromotions = ({ promotions, onEdit, onDelete, onViewDetails, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPromotions = promotions.filter(promo =>
    promo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar promociones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
          />
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-6 py-2 bg-[#a3c9e6] hover:bg-[#8eb6d4] text-black font-bold rounded-xl transition-all shadow-sm"
        >
          <Plus size={18} /> Crear Promoción
        </button>
      </div>

      {/* Tabla con scroll */}
      <div className="overflow-hidden border border-gray-300 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#b4d4e8] shadow-sm">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-800 border-r border-gray-300/50 whitespace-nowrap">Nombre</th>
                  <th className="px-4 py-3 font-bold text-gray-800 border-r border-gray-300/50 whitespace-nowrap">Productos</th>
                  <th className="px-4 py-3 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Fecha Inicio</th>
                  <th className="px-4 py-3 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Fecha Fin</th>
                  <th className="px-4 py-3 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Estado</th>
                  <th className="px-4 py-3 font-bold text-gray-800 text-center whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPromotions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      No hay promociones registradas
                    </td>
                  </tr>
                ) : (
                  filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-200/50 font-medium whitespace-nowrap">{promo.nombre}</td>
                      <td className="px-4 py-3 border-r border-gray-200/50 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {promo.productos.slice(0, 2).map(p => (
                            <span key={p} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{p}</span>
                          ))}
                          {promo.productos.length > 2 && (
                            <span className="text-xs text-gray-400">+{promo.productos.length - 2}</span>
                          )}
                        </div>
                       </td>
                      <td className="px-4 py-3 border-r border-gray-200/50 text-center text-gray-600 whitespace-nowrap">{promo.fechaInicio}</td>
                      <td className="px-4 py-3 border-r border-gray-200/50 text-center text-gray-600 whitespace-nowrap">{promo.fechaFin}</td>
                      <td className="px-4 py-3 border-r border-gray-200/50 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          promo.estado === 'Activa' ? 'bg-green-100 text-green-700' :
                          promo.estado === 'Próxima' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {promo.estado}
                        </span>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => onEdit(promo)} className="p-1.5 bg-[#5c8eff] text-white rounded-lg hover:bg-blue-600 transition-colors" title="Editar">
                            <Upload size={16} />
                          </button>
                          <button onClick={() => onDelete(promo.id, promo.nombre)} className="p-1.5 bg-[#2d3a8c] text-white rounded-lg hover:bg-red-800 transition-colors" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                          <button onClick={() => onViewDetails(promo)} className="bg-[#5c8eff] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">
                            Ver más
                          </button>
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

export default TablePromotions;