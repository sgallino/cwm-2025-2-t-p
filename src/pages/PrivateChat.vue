<script setup>
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { getLastPrivateMessages, saveNewPrivateChatMessage, subscribeToNewPrivateChatMessages } from '../services/private-chat';
import useAuthState from '../componsables/useAuthState';
import useUserProfile from '../componsables/useUserProfile';

const route = useRoute();

const { user } = useAuthState();
const { user: otherUser, loading: loadingUser } = useUserProfile(route.params.id);
const { messages, loadingMessages } = usePrivateMessages(user, route.params.id);
const { newMessage, handleSubmit } = useNewPrivateMessageForm(user, route.params.id);

function usePrivateMessages(user, otherId) {
    // Asignación por valor vs por referencia.
    console.log("User recibido: ", user.value);

    const messages = ref([]);
    const loadingMessages = ref(false);
    
    // Creamos un templateRef para obtener el elemento del contenedor
    // de los mensajes del chat.
    // useTemplateRef() recibe un "id" de template ref como argumento.
    // Este "id" lo usamos como valor del atributo "ref" del elemento
    // de HTML que queremos obtener.
    // Se nos retorna una "ref" que contiene el elemento de HTML.
    const chatContainer = useTemplateRef('chat-container');

    let unsubscribeFromChat = () => {}

    onMounted(async () => {
        try {
            loadingMessages.value = true;
            messages.value = await getLastPrivateMessages(
                user.value.id,
                otherId,
            );
            loadingMessages.value = false;
            
            await nextTick();
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;

            unsubscribeFromChat = await subscribeToNewPrivateChatMessages(
                user.value.id,
                otherId,
                async newMessage => {
                    messages.value.push(newMessage);

                    await nextTick();
                    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
                }
            );
        } catch (error) {
            loadingMessages.value = false;
        }
    });

    onUnmounted(() => unsubscribeFromChat());

    return {
        messages,
        loadingMessages,
    }
}

function useNewPrivateMessageForm(user, otherId) {
    const newMessage = ref({
        content: '',
    });

    async function handleSubmit() {
        try {
            await saveNewPrivateChatMessage(
                user.value.id,
                otherId,
                newMessage.value.content,
            );

            newMessage.value.content = "";
        } catch (error) {
            // TODO...
        }
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Chat privado con {{ otherUser.email }}</AppH1>

    <section ref="chat-container" class="overflow-y-auto h-100 p-4 mb-4 border border-gray-300 rounded">
        <h2 class="sr-only">Lista de mensajes</h2>
        <ol class="flex flex-col items-start gap-4">
            <li
                v-for="message in messages"
                :key="message.id"
                class="p-3 rounded"
                :class="{
                    'bg-gray-100': message.user_id !== user.id,
                    'self-end bg-green-100': message.user_id === user.id,
                }"
            >
                <div class="mb-1">{{ message.content }}</div>
                <div class="text-sm text-gray-700">{{ message.created_at }}</div>
            </li>
        </ol>
    </section>
    <section>
        <h2 class="sr-only">Enviar un mensaje</h2>
        <form 
            action="#"
            class="flex gap-4 items-stretch"
            @submit.prevent="handleSubmit"
        >
            <label for="content" class="sr-only">Mensaje</label>
            <textarea
                id="content"
                class="w-full min-h-25 px-2 py-1 border border-gray-400 rounded"
                v-model="newMessage.content"
            ></textarea>
            <AppButton type="submit">Enviar</AppButton>
        </form>
    </section>
</template>