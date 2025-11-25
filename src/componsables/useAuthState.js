import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthState } from "../services/auth";

export default function useAuthState() {
    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
        photo_url: null,
    });
    let unsubscribeFromAuth = () => {};

    // Guardamos la función que cancela la suscripción.
    onMounted(() => unsubscribeFromAuth = subscribeToAuthState(userData => user.value = userData));

    onUnmounted(() => unsubscribeFromAuth());

    return {
        user,
    }
}