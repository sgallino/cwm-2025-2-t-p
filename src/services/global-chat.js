import { supabase } from "./supabase";

// Servicio con funciones para el chat general.
export async function saveNewGlobalMessage(newMessage) {
    const { error } = await supabase
        .from('global_chat_messages')
        .insert({
            user_id: newMessage.user_id,
            email: newMessage.email,
            content: newMessage.content,
        });
    
    if(error) {
        throw error;
    }

    return true;
}

export async function getLastGlobalMessages() {
    // Leemos los mensajes del chat global desde Supabase.
    // Para que las consultas funcionen, tienen que llamar a la función
    // Usando la keyword "await".
    const { data, error } = await supabase
        // El método "from" de Supabase permite indicar con qu tabla
        // quiero interactuar. En este caso, pedimos nuestra tabla de
        // "global_chat_messages".
        .from('global_chat_messages')
        // select() es el método que ejecuta la consulta con SELECT.
        .select();
    if(error) {
        console.error("Error al traer la data de Supabase.");
    }
    // Guardamos los mensajes recibidos.
    // messages.value = data;
    return data;
}


export function subscribeToNewGlobalMessages(callback) {
    // Configuramos el uso de la API de Realtime de Supabase.
    // Para usar cualquiera de los servicios de Realtime de Supabase,
    // tenemos que crear un "canal", usando el método .channel() que
    // recibe el nombre del canal como argumento.
    // El nombre es arbitrario. Pueden poner cualquier string que 
    // quieran, excepto "realtime".
    const chatChannel = supabase.channel('global_chat_messages');
    
    // Siguiente, configuramos el evento que queremos escuchar en el
    // canal. Podemos escuchar múltiples eventos diferentes.
    // Para cada uno, llamamos al método .on() en el canal.
    // Este método recibe 3 parámetros:
    // 1. Tipo de servicio de Realtime que queremos usar.
    // 2. El objeto con el detalle del evento.
    // 3. Callback con lo que queremos ejecutar.
    chatChannel.on(
        'postgres_changes',
        {
            // event lleva el tipo de evento. Para 'postgres_changes',
            // puede ser: '*', 'INSERT', 'UPDATE', 'DELETE'.
            event: 'INSERT',
            // Qué tabla queremos escuchar.
            table: 'global_chat_messages',
            // En qué schema figura.
            schema: 'public',
        },
        // El callback recibe un parámetro con el "payload" del
        // evento.
        payload => {
            // console.log("Payload recibido: ", payload);
            // Invocamos el callback que nos pasaron, y le mandamos
            // la data nueva del mensaje.
            callback(payload.new);
        }
    );

    // Por último, una vez configurado el evento que queremos escuchar,
    // procedemos a suscribirnos al canal.
    // Es importante tener presente que solo podemos suscribirnos si no
    // estamos suscritos al canal.
    chatChannel.subscribe();

    return () => chatChannel.unsubscribe();
}