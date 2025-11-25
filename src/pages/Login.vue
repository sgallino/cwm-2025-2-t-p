<script setup>
import { inject, ref } from 'vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { GLOBAL_FEEDBACK_PROVIDE_KEY } from '../symbols/provide-keys';

const router = useRouter();

// Vamos a pedir que se nos inyecte la dependencia del feedback global.
// Esto lo logramos con la función inject() de Vue, que recibe la clave
// de la dependencia que quiere.
// const { feedback: globalFeedback } = inject('global-feedback');
// const { updateFeedback: updateGlobalFeedback } = inject('global-feedback');
const { updateFeedback: updateGlobalFeedback } = inject(GLOBAL_FEEDBACK_PROVIDE_KEY);

const { user, loading, feedback, handleSubmit } = useLoginForm(router);

function useLoginForm(router) {
    const loading = ref(false);
    const user = ref({
        email: '',
        password: '',
    });
    const feedback = ref({
        message: null,
        type: 'success',
    });

    // defineEmits() es una macro de Vue, que nos permite declarar qué
    // eventos el componente puede emitir.
    // Retorna una función que nos sirve para emitir los eventos.
    // const emit = defineEmits(['login']);

    // Para pasar datos del componente hijo al componente padre podemos usar
    // eventos.
    async function handleSubmit() {
        try {
            // Si ya está procesando, entonces salteamos el código.
            if(loading.value) return;

            loading.value = true;
            await login(user.value.email, user.value.password);

            // globalFeedback.value = {
            //     message: '¡Hola de nuevo!',
            //     type: 'success',
            // }
            updateGlobalFeedback({
                message: '¡Hola de nuevo!',
                type: 'success',
            });
            
            router.push('/mi-perfil');
        } catch (error) {
            feedback.value = {
                message: 'Las credenciales ingresadas no coinciden con nuestros registros.',
                type: 'error',
            }
            // throw error;
        }

        loading.value = false;
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Ingresar a mi cuenta</AppH1>

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

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input
                type="email"
                id="email"
                class="w-100 px-2 py-1 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="loading"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-1">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-100 px-2 py-1 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="loading"
                v-model="user.password"
            >
        </div>
        <!-- 
        # Propiedades con Vue
        Las "propiedades" (props) son la manera en que podemos pasarles 
        valores (como si fueran los argumentos de una función) a un
        componente.
        La forma en que se pasan es como si fueran atributos de la 
        etiqueta del componente.
        Por defecto, las propiedades solo aceptan texto (strings) como
        valor. Si queremos poder pasar otras cosas (boolean, objects,
        arrays, etc) necesitamos bindearlas con el "v-bind".

        Generalmente, solo solemos pasar propiedades que el componente
        espere recibir. Cuáles son esas propiedades, se definen dentro
        de cada componente.
        -->
        <AppButton 
            type="submit"
            :loading="loading"
        >
            Ingresar
        </AppButton>
    </form>
</template>