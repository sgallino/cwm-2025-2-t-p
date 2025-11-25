// Este es el archivo default de configuración de Vite.
// Como sucede con todos los archivos de configuración, tenemos que
// exportar como default un objeto.

// En este caso específico, queremos usar el plugin de Vue para Vite.
// El plugin lo instalamos con el siguiente comando:
//  npm i --save-dev @vitejs/plugin-vue@6
// ¿Qué es el flag "--save-dev" (o "-D")?
// Indica que queremos que el paquete se instale como una dev dependency
// (dependencia de desarrollo).
// ¿En qué se diferencia una dependency común de una dev dependency?
// Las "dev dependencies" son aquellas que solo se necesitan para 
// correr el proyecto en entornos de desarrollo o testing, pero no
// son necesarios en un entorno de producción.
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default {
    // Usamos la propiedad "plugins" para indicar los plugins que
    // queremos sumar a Vite. Recibe un array de plugins, que suelen
    // ser representados como funciones.
    plugins: [vue(), tailwindcss(),],
}