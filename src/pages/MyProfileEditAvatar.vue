<script setup>
import { onUnmounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import { updateProfileAvatar } from '../services/auth';
import AppButton from '../components/AppButton.vue';
import AppLoading from '../components/AppLoading.vue';

const loading = ref(false);
const imageData = ref({
    file: null,
    preview: null,
});

async function handleSubmit() {
    try {
        if(loading.value) return;

        await updateProfileAvatar(imageData.value.file);
    } catch (error) {
        // TODO...
        throw error;
    }
    loading.value = false;
}

/*
    Como pasa en HTML, las callbacks que se asocian a eventos nativos
    reciben el objeto Event nativo de JS.
*/
async function handleFileChange(event) {
    /*
        # Manejando los archivos seleccionados
        Los inputs de tipo "file" tienen una propiedad llamada "files".
        Esta propiedad contiene un FileList, que sería básicamente un
        array de objetos File.
        A su vez, un objeto File representa un objeto, y tiene varias
        propiedades con datos del mismo (como su nombre, peso, tipo
        MIME, entre algunos otros).
        Si el input de tipo "file" no tiene el atributo "multiple" para
        permitir seleccionar múltiples imágenes, entonces el FileList
        puede tener, como máximo, un solo archivo. Por lo que podemos
        hardcodear esa posición.
    */

    imageData.value.file = event.target.files[0] ?? null;
    // console.log("Archivo seleccionado: ", imageData.value.file);

    // console.log('[MyProfileEditAvatar] ', imageData.value.file);

    if(imageData.value.preview !== null) {
        URL.revokeObjectURL(imageData.value.preview);
        imageData.value.preview = null;
    }

    if(!imageData.value.file) return;

    // Creamos una preview del archivo.
    // Para esto, vamos a usar al método URL.createObjectURL.
    // createObjectURL recibe un Blob o File con el contenido de algún
    // archivo y:
    // - Levanta el contenido de ese archivo en memoria.
    // - Asocia / guarda ese archivo en el "document" de la página.
    // - Crea una URL local que permite fácilmente referenciar ese 
    //  archivo.
    // createObjectURL es una manera muy simple de poder levantar un
    // archivo en memoria para usarlo.
    // Hay solo una cosa con la hay que tener mucho cuidado: Liberar
    // la memoria.
    // Como el createObjectURL queda asociado al "document", va a seguir
    // indefinidamente ocupando espacio en memoria. Hasta que:
    // - Nos vayamos de la página / refresquemos.
    // - Revoquemos manualmente el objeto.
    // En sitios web "tradicionales" (lo que hoy se le dice MPA - Multi
    // Page Applications) esto no es un problema.
    // Pero en webs hechas tipo SPA, donde el usuario no refresca la
    // página casi nunca, esto si no se lo controla puede generar 
    // "memory leaks" / "filtraciones de memoria".
    // Para evitarlo, vamos a simplemente en el unmounted() liberar
    // el curso.
    imageData.value.preview = URL.createObjectURL(imageData.value.file);
}

onUnmounted(() => {
    if(imageData.value.preview) {
        // Limpiamos el recurso de la memoria.
        URL.revokeObjectURL(imageData.value.preview);
    }
});

// let unsubscribeFromAuth = () => {};

// // Cargamos los datos iniciales del perfil.
// onMounted(() => unsubscribeFromAuth = subscribeToAuthState(userData => userForm.value = {
//     display_name: userData.display_name,
//     bio: userData.bio,
//     career: userData.career,
// }));

// onUnmounted(() => unsubscribeFromAuth());
</script>

<template>
    <AppH1>Editar mi foto de perfil</AppH1>

    <div class="flex gap-4">
        <form 
            action="#"
            class="w-1/2"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="avatar" class="block mb-1">Foto</label>
                <input
                    type="file"
                    id="avatar"
                    class="w-100 px-2 py-1 border border-gray-400 rounded"
                    @change="handleFileChange"
                >
            </div>
            <AppButton type="submit">
                <template v-if="!loading">
                    Actualizar mi foto
                </template>
                <AppLoading v-else />
            </AppButton>
        </form>
        <div class="w-1/2">
            <h2 class="mb-4">Previsualización de la imagen</h2>
            <img
                v-if="imageData.preview !== null"
                :src="imageData.preview"
                alt=""
            >
            <p v-else>Seleccioná una imagen</p>
        </div>
    </div>
</template>