import React, { useState } from 'react';
import DataSummary from '../components/DataSummary';
import OrdersTable from '../components/TableSales';
import BannerProductsTable from '../components/BannerProductsTable';
import CategoryFilter from '../components/CategoryFilter';
import TableSales from '../components/TableSales';
import LogoutButton from '../components/LogoutButton';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#fdfcff] font-sans flex flex-col selection:bg-blue-200">
      {/* Header con botón de cerrar sesión */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#2b5a8c]">Dashboard</h1>
        <LogoutButton />
      </header>

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        {currentView === 'dashboard' ? (
          <>
            <DataSummary />
            <OrdersTable />
            <BannerProductsTable />
          </>
        ) : (
          <>
            <CategoryFilter />
            <TableSales />
          </>
        )}
      </main>
    </div>
  );
};

export default App;