// Componente de título reutilizable
// Este componente se puede usar para mostrar títulos en diferentes partes de la aplicación
export default function Title({ children, className = "" }) 
{
  // children: el contenido del título
  // className: clases CSS adicionales para personalizar el estilo del título
  // Renderiza un elemento h1 con estilos predeterminados 
  // y clases adicionales si se proporcionan
  return (
    // El título se muestra con un tamaño de fuente grande, negrita y color gris oscuro
    <h1 className={`text-3xl font-bold text-gray-800 ${className}`}>
      {children}
    </h1>
  );
}