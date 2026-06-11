const pedidosData = [
  { 
    id: 1, 
    date: '2026-02-02', 
    status: 'Completo', 
    total: 3253.00, 
    type: 'Tienda',
    details: {
      tipoPedido: "En linea",
      tipoPago: "Tarjeta",
      comprador: "Juan Perez Carlos Guillen",
      sucursal: "Metrocentro",
      descuento: 0.00,
      productos: [
        { nombre: "Audifonos Skeipods Argom e56", cantidad: 1, monto: 23.00 },
        { nombre: "Telefono Galaxy A56", cantidad: 2, monto: 1792.00 },
        { nombre: "Laptop Acer Lite", cantidad: 2, monto: 1438.00 }
      ]
    }
  },
  { 
    id: 2, 
    date: '2026-02-23', 
    status: 'Por Retirar', 
    total: 896.00, 
    type: 'Tienda',
    details: {
      tipoPedido: "En linea",
      tipoPago: "Transferencia",
      comprador: "Maria Lopez",
      sucursal: "Metrocentro",
      descuento: 0.00,
      productos: [
        { nombre: "Telefono Galaxy A56", cantidad: 1, monto: 896.00 }
      ]
    }
  },
  { 
    id: 3, 
    date: '2026-02-12', 
    status: 'Por Enviar', 
    total: 669.00, 
    type: 'Envio',
    details: {
      tipoPedido: "En linea",
      tipoPago: "Tarjeta",
      comprador: "Carlos Martinez",
      sucursal: "N/A",
      descuento: 50.00,
      productos: [
        { nombre: "Laptop Acer Lite", cantidad: 1, monto: 719.00 }
      ]
    }
  }
];

export default pedidosData;