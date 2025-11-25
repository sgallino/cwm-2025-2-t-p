<script setup>
import AppFooter from './AppFooter.vue';
import AppNavbar from './AppNavbar.vue';

// defineProps() es una "macro" de Vue.
// Nos permite declarar las propiedades que este componente acepta
// recibir.
// Podemos especificarlo de dos maneras:
// 1. Usando un array, pasando el nombre de cada propiedad como un 
//  string.
//  Ej: defineProps(['mi-propiedad', 'otra', 'propiedad']);
// 2. Usando un objeto, donde la clave es el nombre de la propiedad.
//  El objeto nos permite pasar valores para ser más precisos con lo que
//  la prop debe cumplir.
//  Podemos aclarar el tipo de dato que la propiedad acepta:
//  Ej: defineProps({miPropiedad: String, otra: Boolean, propiedad: Number});
//  O, más versátil aún, podemos pasar un objeto de configuración.
//  Ej: defineProps({
//      miPropiedad: {
//          type: String,
//          required: false,
//          default: 'Hola',
//      }
//  });
// defineProps({
//     user: Object,
// });
</script>

<template>
    <AppNavbar />
    <main class="container p-4 mx-auto">
        <slot />
    </main>
    <AppFooter />
</template>