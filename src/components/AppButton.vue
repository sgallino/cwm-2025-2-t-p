<script setup>
import { computed } from 'vue';
import AppLoading from './AppLoading.vue';

/*
# Declarando propiedades
Si queremos aceptar ciertas propiedades, en la Composition API tenemos
que usar la "macro" defineProps().
defineProps() recibe un argumento que es la lista de propiedades que
aceptamos. Puede ser un array o un objeto.
Retorna el objeto con las propiedades recibidas.

Cualquier propiedad que hayamos definido va a poder ser accedida desde
el template.

Nota: Una "macro" en Vue, si bien se escribe como si fuera una función,
en realidad no lo es. Es una estructura que reconoce el "compilador"
de Vue y que luego transforma.
Como es una indicación para el compilador y no una verdadera función,
es que no lo tenemos que importar.
*/
// defineProps(['loading']); // Versión array
// Versión objeto
const props = defineProps({
    // loading: Boolean, // Aclaramos el tipo de dato de la propiedad.
    loading: {
        type: Boolean, // Aclaramos el tipo de dato.
        default: false, // Ponemos el valor por defecto.
    },
    variant: {
        type: String,
        default: 'primary',
    }
});

/*
# Usando nombres de clases dinámicos con Tailwind
Por cómo Tailwind parsea nuestro código (como si fuera texto plano) no
podemos armar los nombres de clases de manera dinámica. Tailwind no los
reconoce.
Una alternativa, es refactorizar nuestro código para que use las clases
con su nombre completo.
*/
const buttonColor = computed(() => {
    switch(props.variant) {
        case 'error':
            return 'bg-red-700 hover:bg-red-600 active:bg-red-800';
            
        case 'success':
            return 'bg-green-700 hover:bg-green-600 active:bg-green-800';
            
        case 'secondary':
            return 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800';
            
        case 'info':
            return 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700';
                
        case 'primary':
        default:
            return 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800';
    }
});
</script>

<template>
    <button 
        class="transition-colors px-4 py-2 rounded text-white"
        :class="buttonColor"
    >
        <AppLoading v-if="loading" />
        <slot v-else />
    </button>
</template>