using System.Reflection;

namespace Services.Helpers
{
    public class ReflectionHelper
    {
        public static Dictionary<string, object> FromModelToDictionary(object model)
        {
            var diccionario = new Dictionary<string, object>();

            // Obtener todas las propiedades del modelo
            var propiedades = model.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var propiedad in propiedades)
            {
                // Obtener el valor de la propiedad
                var valor = propiedad.GetValue(model);

                // Si el valor no es nulo, agregarlo al diccionario
                if (valor != null)
                {
                    diccionario[propiedad.Name.ToLower()] = valor; // Usar el nombre de la propiedad en minúsculas
                }
            }

            return diccionario;
        }
    }
}
