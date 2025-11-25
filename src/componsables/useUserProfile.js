import { onMounted, ref } from "vue";
import { fetchUserProfileById } from "../services/user-profiles";

export default function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
        photo_url: null,
    });
    const loading = ref(false);

    onMounted(async () => {
        try {
            loading.value = true;
            // Buscamos al usuario por el id que recibimos en el parámetro 
            // de ruta.
            user.value = await fetchUserProfileById(id);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    });

    return {
        user,
        loading,
    }
}