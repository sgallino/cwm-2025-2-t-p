<script setup>
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { getLastGlobalMessages, saveNewGlobalMessage, subscribeToNewGlobalMessages } from '../services/global-chat';
import { subscribeToAuthState } from '../services/auth';
import useAuthState from '../componsables/useAuthState';
import AppLoading from '../components/AppLoading.vue';

// La función ref() permite crear una "referencia reactiva", que
// es un valor del "state" del componente.
// Llamamos el "state" del componente a los valores propios del
// componente que pueden variar durante la vida del mismo.
// Estos valores en Vue son "reactivos", lo que significa que el
// framework re-renderiza el componente cada vez que alguno de sus
// valores cambie.
// Importante: Los valores creados con ref() son envueltos en un
// objeto, con una propiedad "value" que lo contiene.
// Esto significa que para poder leer o interactuar con el valor en
// el script, tenemos que siempre pasar por la propiedad "value".
// Nota: Dentro del <template> no es necesario usar el value.
const { user } = useAuthState();
const { messages, loading } = useGlobalMessages();
const { newMessage, handleSubmit } = useNewGlobalMessageForm(user);

function useGlobalMessages() {
    const messages = ref([]);
    const loading = ref(false);
    
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
            loading.value = true;

            unsubscribeFromChat = subscribeToNewGlobalMessages(async newMessage => {
                messages.value.push(newMessage);

                // Movemos el scroll.
                await nextTick();
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            });

            messages.value = await getLastGlobalMessages();
                
            loading.value = false;

            // Una vez que se cargan los mensajes, movemos el scroll.
            /*
            # ¿Qué es el nextTick(), y por qué lo necesitamos acá?
            nextTick() retorna una promesa que se resuelve cuando Vue actualiza
            el renderizado del componente.

            Hay varios casos donde es importante usarlo para que las cosas
            funcionen bien. Como es el caso del scroll acá.
            Como vimos, si no ponemos el nextTick() (con su await), el 
            scroll no se mueve.
            La razón es que cuando en Vue se modifican datos que requieren que
            se actualice el DOM, como es el caso de recibir los mensajes de
            chat, *Vue no actualiza inmediatamente el DOM*.
            Como re-renderizar la página ante los cambios en el DOM es una
            tarea muy intensiva, Vue trata de provacar esto lo menos posible.
            Por eso, trata de agrupar múltiples cambios para realizarlos todos
            juntos.

            Pero hay casos, como este, donde necesitamos poder esperar a que
            un cambio ocurra para poder proceder. Para poder mover el scroll,
            necesitamos que los mensajes de hayan agregado en el DOM.
            Y, por esto, es que necesitamos llamar al nextTick().
            */
            await nextTick();
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            
        } catch (error) {
            loading.value = false;
            throw error;
        }
    });

    onUnmounted(() => unsubscribeFromChat());

    return {
        messages,
        loading,
    }
}

function useNewGlobalMessageForm(user) {
    const newMessage = ref({
        content: '',
    });

    async function handleSubmit() {
        const data = saveNewGlobalMessage({
            user_id: user.value.id,
            email: user.value.email,
            content: newMessage.value.content,
        });

        newMessage.value.content = "";
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <section ref="chat-container" class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-300 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>
            <ol 
                v-if="!loading"
                class="flex flex-col items-start gap-4"
            >
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="p-3 rounded bg-gray-100"
                >
                    <div class="mb-1">
                        <RouterLink 
                            class="font-bold text-blue-700 underline"
                            :to="`/usuario/${message.user_id}`"
                        >
                            {{ message.email }}
                        </RouterLink> 
                        dijo:
                    </div>
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
            <AppLoading v-else />
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-2xl">Enviar un mensaje</h2>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span for="email" class="block mb-1">Email</span>
                    <span class="font-bold">{{ user.email }}</span>
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
                    <!-- 
                    v-model define un "two-way data binding" entre un
                    valor del "state" y un control de formulario, como
                    input, select o textarea.
                    Esto significa que Vue mantiene en sincronía el valor
                    del state con el del control del form.
                    Es decir, si cambiamos el valor del "state", Vue 
                    actualiza el contenido del campo.
                    Asimismo, si el usuario cambia el valor del campo, Vue
                    actualiza la variable del "state".
                    -->
                    <textarea
                        id="content"
                        class="w-full min-h-25 px-2 py-1 border border-gray-400 rounded"
                        v-model="newMessage.content"
                    ></textarea>
                </div>
                <AppButton type="submit">Enviar</AppButton>
            </form>
        </section>
    </div>
</template>