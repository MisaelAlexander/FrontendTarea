import { Edit, Trash2 } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="overflow-hidden border border-gray-300 rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#b4d4e8] shadow-sm">
              <tr>
                <th className="px-6 py-5 font-bold text-gray-800 border-r border-gray-300/50">Producto</th>
                <th className="px-6 py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center">ID</th>
                <th className="px-6 py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center">Sucursal</th>
                <th className="px-6 py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center">Stock</th>
                <th className="px-6 py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center">Precio</th>
                <th className="px-6 py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center">Descuento</th>
                <th className="px-6 py-5 font-bold text-gray-800 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No se encontraron productos</p>
                      <p className="text-sm">Prueba con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-300/50">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imagenesProductos?.[0]?.imagen || "https://via.placeholder.com/40"}
                          className="w-10 h-10 rounded-md object-cover border"
                          alt=""
                        />
                        <span className="font-medium">{product.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-300/50 text-center text-xs text-gray-600">
                      {product._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 border-r border-gray-300/50 text-center">{product.sucursal}</td>
                    <td className="px-6 py-4 border-r border-gray-300/50 text-center">{product.stock}</td>
                    <td className="px-6 py-4 border-r border-gray-300/50 text-center font-medium">${product.precio}</td>
                    <td className="px-6 py-4 border-r border-gray-300/50 text-center">{product.descuento || 0}%</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEdit(product)} className="p-2 bg-[#5c8eff] text-white rounded-lg hover:bg-blue-600" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => onDelete(product._id, product.nombre)} className="p-2 bg-[#2d3a8c] text-white rounded-lg hover:bg-red-800" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                        <button onClick={() => onViewDetails(product)} className="bg-[#5c8eff] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600">
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
  );
};

export default ProductTable;  