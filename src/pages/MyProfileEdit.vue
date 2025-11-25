<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthState, updateProfile } from '../services/auth';
import AppButton from '../components/AppButton.vue';
import AppLoading from '../components/AppLoading.vue';

const loading = ref(false);
const userForm = ref({
    display_name: null,
    bio: null,
    career: null,
});

async function handleSubmit() {
    try {
        if(loading.value) return;

        await updateProfile({
            display_name: userForm.value.display_name,
            bio: userForm.value.bio,
            career: userForm.value.career,
        });

        // TODO: Mostrar mensaje de feedback.
    } catch (error) {
        // TODO...
    }
    loading.value = false;
}

let unsubscribeFromAuth = () => {};

// Cargamos los datos iniciales del perfil.
onMounted(() => unsubscribeFromAuth = subscribeToAuthState(userData => userForm.value = {
    display_name: userData.display_name,
    bio: userData.bio,
    career: userData.career,
}));

onUnmounted(() => unsubscribeFromAuth());
</script>

<template>
    <AppH1>Editar mi perfil</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-1">Biografía</label>
            <textarea
                id="bio"
                class="w-100 px-2 py-1 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="loading"
                v-model="userForm.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-1">Nombre</label>
            <input
                type="text"
                id="display_name"
                class="w-100 px-2 py-1 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="loading"
                v-model="userForm.display_name"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-1">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-100 px-2 py-1 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="loading"
                v-model="userForm.career"
            >
        </div>
        <AppButton type="submit">
            <template v-if="!loading">
                Actualizar
            </template>
            <AppLoading v-else />
        </AppButton>
    </form>
</template>