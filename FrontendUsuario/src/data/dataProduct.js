const productsData = [
  {
    id: 1,
    title: "Audífonos Skeipods Argom e56",
    price: 23.00,
    stock: 45,
    category: "Auriculares",
    description: "Audífonos inalámbricos de alta calidad con cancelación de ruido pasiva, batería de larga duración y diseño ergonómico para mayor comodidad durante todo el día.",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=300&h=300",
    colors: ['#000000', '#ffffff'],
    reviews: [
      { id: 1, user: "Juan Perez", text: "Excelente sonido por el precio. Muy recomendados.", rating: 5 }
    ]
  },
  {
    id: 2,
    title: "Samsung Galaxy A56",
    price: 710.00,
    stock: 90,
    category: "Telefonos",
    description: "Teléfono Samsung Galaxy A56, 12GB RAM, 256GB almacenamiento, cámara 8MP.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=300&h=300",
    colors: ['#dc2626', '#ffffff', '#60a5fa'],
    reviews: [
      { id: 1, user: "Maria Lopez", text: "El producto funciona bien y tiene muchas funciones útiles.", rating: 5 },
      { id: 2, user: "Diego Cortez", text: "Me ha parecido increíble", rating: 5, isMine: true }
    ]
  },
  {
    id: 3,
    title: "Laptop Acer Lite",
    price: 719.00,
    stock: 12,
    category: "Laptops",
    description: "Laptop ideal para estudiantes y profesionales. Pantalla Full HD, procesador eficiente y diseño ultraligero.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=300&h=300",
    colors: ['#d1d5db', '#1f2937'],
    reviews: []
  },
  {
    id: 4,
    title: "Tarjeta Gráfica RTX 4070",
    price: 896.00,
    stock: 5,
    category: "Componentes",
    description: "Potencia gráfica de última generación para gaming en 1440p y 4K con trazado de rayos y DLSS 3.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300&h=300",
    colors: ['#000000'],
    reviews: []
  }
];

export default productsData;