/*
# Rutas para los imports de JS cuando trabajamos con npm
Cuando hacemos un import en un proyecto de npm (como los de Vite),
y escribimos la ruta sin indicar una carpeta de origen, automáticamente
se sobreentiende que estamos pidiendo un paquete de npm.

Por ejemplo, si escribimos:
  import { createApp } from 'vue';

Se entiende que "vue" tiene que ser un paquete instalado por npm.
Esto provoca que no podamos usar rutas relativas a partir de la carpeta
donde estamos sin el prefijo de "./". Por ejemplo:
  import App from './App.vue';

Si omitimos el "./":
  import App from 'App.vue';

Este código no funciona. Vite (y npm) van a interpretar que "App.vue" es
un paquete de npm. Como no existe, va a fallar.
*/
// import './bootstrap.min.css';
import './style.css';
import { createApp } from 'vue';
import router from './router/router';
import App from './App.vue';

const app = createApp(App);
app.use(router); // Registramos el router en la app.
app.mount('#app');