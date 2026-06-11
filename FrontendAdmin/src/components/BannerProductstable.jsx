// BannerProductsTable.jsx
import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import bannerProducts from '../data/banner.js'; // Ajusta la ruta según tu estructura

const BannerProductsTable = () => {
  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Productos en el banner</h2>
        <button className="bg-[#a8cbe3] text-black font-semibold px-6 sm:px-10 py-2.5 rounded-xl shadow-sm hover:bg-[#96bace] transition-colors border border-gray-300 w-full sm:w-auto">
          Agregar
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
            {bannerProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 sm:py-3 px-3 sm:px-6 text-center">
                  <img
                    src={product.photo}
                    alt={product.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain mx-auto mix-blend-multiply rounded"
                  />
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">
                  {product.name}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-600 truncate max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm">
                  {product.description}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-6 font-medium text-gray-800 text-xs sm:text-sm">
                  {product.priceDiscount}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">
                  {product.discount}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-6">
                  <div className="flex justify-center items-center gap-1 sm:gap-2">
                    <button className="bg-[#5b8cff] text-white p-1.5 sm:p-2.5 rounded-lg hover:bg-blue-600">
                      <Upload size={16} className="sm:w-[18px]" />
                    </button>
                    <button className="bg-[#3548c7] text-white p-1.5 sm:p-2.5 rounded-lg hover:bg-blue-800">
                      <Trash2 size={16} className="sm:w-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerProductsTable;