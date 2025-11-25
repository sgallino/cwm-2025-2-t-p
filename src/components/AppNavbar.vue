<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, subscribeToAuthState } from '../services/auth';

// defineProps({
//     user: {
//         type: Object,
//     },
// })

// Obtenemos el router a través del composable useRouter.
const router = useRouter();

// Datos del usuario autenticado.
const user = ref({
    id: null,
    email: null,
});

onMounted(() => {
    // Nos suscribimos al estado de autenticación.
    subscribeToAuthState(newUserData => user.value = newUserData);
});

function handleLogout() {
    logout();

    // Redireccionamos al login.
    router.push('/ingresar');
}
</script>

<template>
    <!-- 
    # Usando Tailwind
    Como hablamos, Tailwind es un framework de clases de utilidad.
    Esto significa que cada clase que tiene el framework contiene
    solo un valor de un estilo (salvo algunas excepciones).
    Por ejemplo, cambiar el color de la tipografía, agregar un padding,
    etc.

    Las clases suelen tener 2 posibles formatos:
    a. La mayoría de las clases se componen de 2 partes:
        <estilo>-<valor>
    Por ejemplo:
            .p-4                    padding: 1rem;
            .border-0               border: 0;
            .gap-8                  gap: 2rem;
            .text-red-700           color: <unrojo>;
    
    b. Algunos estilos, como display o text-decoration, tienen clases
    con solo el nombre del valor. Por ejemplo:
            .flex                   display: flex;
            .underline              text-decoration: underline;
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-200">
        <a class="text-xl" href="#">DV Social</a>

        <ul class="flex gap-4">
            <li>
                <RouterLink to="/">Home</RouterLink>
            </li>
            <template v-if="user.id === null">
                <li>
                    <RouterLink to="/ingresar">Ingresar</RouterLink>
                </li>
                <li>
                    <RouterLink to="/crear-cuenta">Crear cuenta</RouterLink>
                </li>
            </template>
            <template v-else>
                <li>
                    <RouterLink to="/chat">Chat</RouterLink>
                </li>
                <li>
                    <RouterLink to="/mi-perfil">Mi perfil</RouterLink>
                </li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit">{{ user.email }} (Cerrar sesión)</button>
                    </form>
                </li>
            </template>
        </ul>
    </nav>
</template>