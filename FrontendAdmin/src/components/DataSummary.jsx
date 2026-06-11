const DataSummary = () => {
  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Resumen de datos</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Todo', 'Mes', 'Semana', 'Hoy'].map((filter) => (
            <button key={filter} className={`px-4 sm:px-5 py-1.5 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${
              filter === 'Todo' ? 'bg-[#7ba4dd] text-white border-[#7ba4dd]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}>
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#a8cbe3] rounded-2xl p-6 relative overflow-hidden h-36 flex flex-col justify-center">
          <p className="text-[#3a6288] text-xs sm:text-sm font-semibold italic">Monto de Ventas Totales</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">$ 9,834.80</h3>
          <div className="absolute -bottom-10 -right-4 w-32 h-32 bg-white/20 rounded-full"></div>
        </div>
        <div className="bg-[#a8cbe3] rounded-2xl p-6 relative overflow-hidden h-36 flex flex-col justify-center">
          <p className="text-[#3a6288] text-xs sm:text-sm font-semibold italic">Monto de Compras Totales</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">$ 7,631.40</h3>
          <div className="absolute -bottom-10 -right-4 w-32 h-32 bg-white/20 rounded-full"></div>
        </div>
        <div className="bg-[#7ba4dd] rounded-2xl p-6 relative overflow-hidden h-36 flex flex-col justify-center">
          <p className="text-[#2b4c73] text-xs sm:text-sm font-semibold italic">Cantidad de Ventas</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">4,000 Ventas</h3>
          <div className="absolute -bottom-10 -right-4 w-32 h-32 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;