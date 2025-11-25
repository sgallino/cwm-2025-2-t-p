// Archivo de routing.
import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthState } from "../services/auth";
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import MyProfileEditAvatar from "../pages/MyProfileEditAvatar.vue";
import UserProfile from "../pages/UserProfile.vue";
import PrivateChat from "../pages/PrivateChat.vue";

// Definimos la lista de rutas.
// Esto se logra con un array de objetos "Route".
// Este objeto tiene, al menos, 2 propiedades:
// 1. path. La URL a partir de la raíz del sitio.
// 2. component. El componente que queremos asociar a esa ruta.
const routes = [
    { path: '/',                        component: Home, },
    { path: '/ingresar',                component: Login, },
    { path: '/crear-cuenta',            component: Register, },
    // Con ayuda del atributo "meta" marcamos las rutas que queremos
    // requieran estar autenticado.
    { path: '/chat',                    component: GlobalChat,  meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',               component: MyProfile,  meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar',        component: MyProfileEdit,  meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar/avatar', component: MyProfileEditAvatar,  meta: { requiresAuth: true, }, },
    { path: '/usuario/:id',             component: UserProfile,  meta: { requiresAuth: true, }, },
    { path: '/usuario/:id/chat',        component: PrivateChat,  meta: { requiresAuth: true, }, },
];

// createRouter crea el Router. Recibe un objeto con 2 propiedades:
// 1. routes. El array de rutas.
// 2. history. El objeto para el manejo de la historia de la aplicación.
// Para nuestros fines, existen dos posibilidades para el history:
// a. createWebHistory
// b. createWebHashHistory
// Lo que cambia es cómo marca la ruta en la URL.
// createWebHistory arma las URLs como si fueran rutas de archivos
// reales.
// Mientras que createWebHashHistory las armas usando un "#".
// La primera opción es mucho más amigable para SEO, y también en cierta
// medida para los usuarios. Pero requiere un servidor configurado en 
// Node con SSR (Server-Side Rendering) para que funcione.
// La segunda no tiene ningún requerimiento especial.
const router = createRouter({
    // Se expande a:
    //  routes: routes
    routes, 
    history: createWebHistory(),
});

// Nos suscribimos para obtener los datos del usuario autenticado.
let user = {
    id: null,
    email: null,
}
subscribeToAuthState(newUserData => user = newUserData);

// Usamos el guard global "beforeEach" para verificar si se requiere
// la autenticación, y en cuyo caso, chequear que esté autenticado.
// beforeEach recibe un callback que se ejecuta antes de cada 
// navegación de una ruta.
// Podemos en ese callback no hacer nada, en cuyo caso la navegación
// continúa, o cancelar, o redireccionar a otro lado.
// El callback recibe 2 parámetros:
// - to: Ruta destino.
// - from: Ruta origen.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        return {
            path: '/ingresar',
        }
    }
});

export default router;