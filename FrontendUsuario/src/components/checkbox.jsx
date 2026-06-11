// Componente de Checkbox personalizado
// Este componente renderiza un checkbox con una etiqueta personalizada y estilos básicos.
export default function Checkbox({ label, checked, onChange, className =""})
{
    // El componente recibe las siguientes elementos:
    // label: El texto que se mostrará junto al checkbox.
    // checked: Un booleano que indica si el checkbox está marcado o no.
    // onChange: Una función que se ejecutará cuando el estado del checkbox cambie.
    // className: Clases CSS adicionales para personalizar el estilo del componente.
    return (
        // El componente se estructura como una etiqueta <label> 
        // que contiene un <input> de tipo checkbox y un <span> para el texto de la etiqueta.
        <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{label}</span>
        </label>
    )
}