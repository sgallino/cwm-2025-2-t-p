<script setup>
import AppH1 from '../components/AppH1.vue';
import { useRoute } from 'vue-router';
import AppLoading from '../components/AppLoading.vue';
import { getFileURL } from '../services/storage';
import useUserProfile from '../componsables/useUserProfile';

const route = useRoute();

const { user, loading } = useUserProfile(route.params.id);
</script>

<template>
    <template v-if="!loading">
        <div class="flex gap-4">
            <div class="w-1/2">
                <div class="flex gap-4 items-end">
                    <AppH1>Perfil de {{ user.email }}</AppH1>
                </div>

                <div class="ms-4 my-6 text-gray-700 italic">{{ user.bio ?? 'Sin biografía...' }}</div>

                <dl class="mb-4">
                    <dt class="font-bold">Email</dt>
                    <dd class="mb-2">{{ user.email }}</dd>
                    <dt class="font-bold">Nombre</dt>
                    <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                    <dt class="font-bold">Carrera</dt>
                    <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
                </dl>
            </div>
            <div class="w-1/2">
                <img
                    v-if="user.photo_url !== null"
                    :src="getFileURL(user.photo_url)"
                    alt=""
                    class="max-w-25 rounded-full"
                />
            </div>
        </div>

        <hr class="mb-4">

        <RouterLink
            class="text-blue-700 underline"
            :to="`/usuario/${user.id}/chat`"
        >
            Iniciar conversación privada con {{ user.email }}
        </RouterLink>
    </template>
    <template v-else>
        <AppLoading />
    </template>
</template>