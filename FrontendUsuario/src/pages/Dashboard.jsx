import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← falta importar
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import ProductCard from '../components/card';
import ProductDetailsModal from '../components/productdetailsModal';
import Carousel from '../components/carrusel';
import CategoryButton from '../components/categoryButton';
import productsData from '../data/dataProduct';
import { Smartphone, Laptop, Monitor, Headphones, Cpu, Usb } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate(); // ← agregar
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([1, 4]);
  const { addToCart, cartItems } = useCart();
  const { searchQuery } = useSearch();

  const toggleFavorite = (id) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const filteredProducts = productsData.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      (product.category && product.category.toLowerCase().includes(query))
    );
  });

  const handleCategoryClick = (categoryName) => {
    navigate(`/categoria/${categoryName}`);
  };

  return (
    <>
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cartItems} />
      <ProductDetailsModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      <Carousel />

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-[2%]">Categorías</h2>
        <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:justify-between justify-center px-[5%]">
          <CategoryButton icon={Smartphone} label="Teléfonos" onClick={() => handleCategoryClick("Telefonos")} />
          <CategoryButton icon={Laptop} label="Laptops" onClick={() => handleCategoryClick("Laptops")} />
          <CategoryButton icon={Monitor} label="Computadoras" onClick={() => handleCategoryClick("Computadoras")} />
          <CategoryButton icon={Headphones} label="Auriculares" onClick={() => handleCategoryClick("Auriculares")} />
          <CategoryButton icon={Cpu} label="Componentes" onClick={() => handleCategoryClick("Componentes")} />
          <CategoryButton icon={Usb} label="Accesorios" onClick={() => handleCategoryClick("Accesorios")} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-[2%]">Productos Destacados</h2>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 px-[5%]">
            No se encontraron productos para "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-[5%]">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={favoriteIds.includes(product.id)}
                onToggleLike={toggleFavorite}
                onAddToCart={addToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;