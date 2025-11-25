<script setup>
import { ref } from 'vue';
import { register } from '../services/auth';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';

const router = useRouter();

const { user, loading, handleSubmit } = useRegisterForm(router);

function useRegisterForm(router) {
    const user = ref({
        email: '',
        content: '',
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;
            
            await register(user.value.email, user.value.password);
            
            router.push('/mi-perfil');
        } catch (error) {
            // TODO: Manejar el error
            console.error("Error al crear la cuenta: ", error);
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}

</script>

<template>
    <AppH1>Crear una cuenta</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input
                type="email"
                id="email"
                class="w-100 px-2 py-1 border border-gray-400 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-1">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-100 px-2 py-1 border border-gray-400 rounded"
                v-model="user.password"
            >
        </div>
        <AppButton type="submit">Crear mi cuenta</AppButton>
    </form>
</template>