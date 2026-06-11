// Componente de texto reutilizable
// Este componente se puede usar para mostrar texto con estilos consistentes en toda la aplicación.
export default function Text({ children, className = "", as = "p" }) {
  // El prop "as" permite especificar el tipo de elemento HTML 
  // que se renderizará (por ejemplo, "p", "span", "h1", etc.).
  const Component = as;
  // Se combinan las clases de estilo predeterminadas con cualquier clase adicional 
  // proporcionada a través del prop "className".
  return (
    // Se renderiza el componente con el tipo de elemento especificado y las clases de estilo.
    <Component className={`text-gray-600 ${className}`}>
      {children}
    </Component>
  );
}