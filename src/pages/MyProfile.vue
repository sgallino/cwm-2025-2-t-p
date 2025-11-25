<script setup>
import AppH1 from '../components/AppH1.vue';
import { getFileURL } from '../services/storage';
import useAuthState from '../componsables/useAuthState';

const { user } = useAuthState();

// Creamos un "composable" o "composition function".
// Los composables son funciones que se caracterizan por usar elementos
// de Vue (como ref o las funciones del ciclo de vida) en su interior.
// La idea es que cada responsabilidad que tenga nuestro componente 
// que englobada en un composable propio.
// Este composable debe retornar solo los datos que son necesarios 
// para usarse en el componente.
// Estos composables se ejecutan al comienzo del script.
// Como convención, los composables suelen tener el prefijo "use".
// Las ventajas de trabajar de esta forma son varias:
// 1. Organización. Queda agrupada toda la lógica de una responsabilidad
//  dentro de una sola función. Hace fácil saber qué es lo que está
//  asociado a la misma.
// 2. Reutilización de código. Los composables son funciones. Como tal,
//  si la funcionalidad que un composable ofrece la necesito en 
//  múltiples componentes diferentes, podemos llevarlo a un archivo
//  externo e importarlo.
// 3. Testing. Es más fácil testear la lógica si está organizada en
//  funciones.
</script>

<template>
    <div class="flex gap-4">
        <div>
            <div class="flex gap-4 items-end">
                <AppH1>Mi perfil</AppH1>
                <RouterLink to="/mi-perfil/editar" class="mb-4 text-blue-700 underline">Editar</RouterLink>
                <RouterLink to="/mi-perfil/editar/avatar" class="mb-4 text-blue-700 underline">Editar mi foto</RouterLink>
            </div>

            <div class="ms-4 my-6 text-gray-700 italic">{{ user.bio ?? 'Sin biografía...' }}</div>

            <dl>
                <dt class="font-bold">Email</dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt class="font-bold">Nombre</dt>
                <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="font-bold">Carrera</dt>
                <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
        <div>
            <img
                v-if="user.photo_url !== null"
                :src="getFileURL(user.photo_url)"
                alt=""
                class="max-w-25 rounded-full"
            />
        </div>
    </div>
</template>