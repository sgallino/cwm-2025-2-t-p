<script setup>
import AppLayout from './components/AppLayout.vue';
import { onMounted, provide, ref } from 'vue';
import { subscribeToAuthState } from './services/auth';
import { GLOBAL_FEEDBACK_PROVIDE_KEY } from './symbols/provide-keys';

// Datos del usuario autenticado.
// const user = ref({
//     id: null,
//     email: null,
// });

// onMounted(() => {
//     // Nos suscribimos al estado de autenticación.
//     subscribeToAuthState(newUserData => user.value = newUserData);
// });

// function handleLogin(authUser) {
//     user.value = {
//         id: authUser.id,
//         email: authUser.email,
//     }
// }

// TODO: Optimizar detalles del feedback global (que se pueda cerrar,
// por ejemplo).
const feedback = ref({
    message: null,
    type: 'success',
});

function updateFeedback(data) {
    if(typeof data !== 'object') throw new Error('La data debe ser un objeto.');

    feedback.value = {
        ...feedback.value,
        ...data,
    }
}

// Creamos un "proveedor de dependencias" para compartir el estado 
// global de feedback.
// Para hacerlo, usamos la función provide() de Vue.
// Recibe 2 argumentos:
//  1. Clave identificatoria.
//  2. El valor a proveer. Típicamente, va a ser un objeto.
// Entre los valores del objeto se pueden compartir refs inclusive.
// Es importante aclarar que si bien podemos pasar un ref, se recomienda
// no hacerlo.
// La recomendación de no pasar valores reactivos y mutables, como un
// ref, es para:
//  - Evitar usos incorrectos.
//  - Simplificar la depuración de errores.
// En su lugar, la recomendación que se hace si necesitamos que los
// descendientes puedan manipular información es pasar una función.
// 
// Finalmente, una última, pero no menos importante, recomendación.
// Para las claves de los provide en vez de strings se prefiere utilizar
// un symbol.
// provide('global-feedback', {
provide(GLOBAL_FEEDBACK_PROVIDE_KEY, {
    // feedback,
    updateFeedback,
});
</script>

<template>
    <AppLayout>
        <div
            v-if="feedback.message !== null"
            class="p-4 mb-4 rounded"
            :class="{
                'bg-red-100': feedback.type == 'error',
                'bg-green-100': feedback.type == 'success',
            }"
        >
            {{ feedback.message }}
        </div>

        <!-- 
        RouterView es un componente que se registra globalmente cuando
        registramos un Vue Router en nuestra app.
        Sirve para indicar dónde debe renderizarse el componente que
        corresponde a la ruta.
        -->
        <RouterView />
        <!-- @login="handleLogin" -->
    </AppLayout>
</template>