import { supabase } from "./supabase";

/*
Vamos a crear un simple mecanismo de caché local para guardar los datos
de las conversaciones privadas que trajimos.
Este caché va a perdurar hasta que el usuario refresque la página.
Nuestro caché va a ser un simple objeto ("POJO" - "Plain Old Javascript Object").
Por cada conversación vamos a crear una clave, que esté compuesta por
los ids de ambos usuarios, ordenados y unidos por un "_".
Por ejemplo "userId1_userId2".
*/
let privateChatCache = {}

function addToPrivateChatCache(senderId, receiverId, value) {
    const key = [senderId, receiverId].sort().join('_');
    privateChatCache[key] = value;
}

function getFromPrivateChatCache(senderId, receiverId) {
    const key = [senderId, receiverId].sort().join('_');
    return privateChatCache[key] ?? null;
}

async function fetchOrCreatePrivateChatFor(senderId, receiverId) {
    // Primero buscamos en el caché. Solo si no existe vamos a la red.
    const cached = getFromPrivateChatCache(senderId, receiverId);
    if(cached) return cached;

    let privateChat = await fetchPrivateChatFor(senderId, receiverId);

    if(!privateChat) {
        privateChat = await createPrivateChatFor(senderId, receiverId);
    }

    // Grabamos en el caché el chat que trajimos.
    addToPrivateChatCache(senderId, receiverId, privateChat);

    return privateChat;
}

async function fetchPrivateChatFor(senderId, receiverId) {
    const [userId1, userId2] = [senderId, receiverId].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .select()
        .eq('user_id1', userId1)
        .eq('user_id2', userId2);
    
    if(error) {
        console.error('[private-chat.js fetchPrivateChatFor] Error al enviar el mensaje de la conversación privada.', error);
        throw new Error(error.message);
    }

    return data[0] ?? null;
}

async function createPrivateChatFor(senderId, receiverId) {
    const [userId1, userId2] = [senderId, receiverId].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: userId1,
            user_id2: userId2,
        })
        // Traemos el registro que acabamos de insertar.
        .select();

    if(error) {
        console.error('[private-chat.js createPrivateChatFor] Error al crear la conversación privada.', error);
        throw new Error(error.message);
    }

    return data[0];
}

export async function saveNewPrivateChatMessage(senderId, receiverId, content) {
    // Para poder grabar el mensaje, necesitamos tener el chat privado
    // en el que va.
    // Obtenemos el chat privado.
    const privateChat = await fetchOrCreatePrivateChatFor(senderId, receiverId);

    const { error } = await supabase
        .from('private_chat_messages')
        .insert({
            chat_id: privateChat.id,
            user_id: senderId,
            content,
        });

    if(error) {
        console.error('[private-chat.js saveNewPrivateChatMessage] Error al enviar el mensaje de la conversación privada.', error);
        throw new Error(error.message);
    }
}

export async function getLastPrivateMessages(senderId, receiverId) {
    const privateChat = await fetchOrCreatePrivateChatFor(senderId, receiverId);

    const { data, error } = await supabase
        .from('private_chat_messages')
        .select()
        .eq('chat_id', privateChat.id);

    if(error) {
        console.error('[private-chat.js getLastPrivateMessages] Error al traer los últimos mensajes de la conversación privada.', error);
        throw new Error(error.message);
    }

    return data;
}

export async function subscribeToNewPrivateChatMessages(senderId, receiverId, callback) {
    const privateChat = await fetchOrCreatePrivateChatFor(senderId, receiverId);

    const privateChannel = supabase.channel('private_chat_messages');

    privateChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            table: 'private_chat_messages',
            // Nosotros no queremos traer *todos* los mensajes de chat
            // de *todas* las conversaciones.
            // Para hacer esto, necesitamos pedir "filtrar" los 
            // resultados que lleguen usando la propiedad "filter".
            filter: 'chat_id=eq.' + privateChat.id,
        },
        payload => {
            callback(payload.new);
        }
    );

    privateChannel.subscribe();

    return () => {
        privateChannel.unsubscribe();
    }
}


// ----------------------------------------------------------------
// async function testCantReadAPrivateChatInWhichImNotAPartOf() {
//     // Preparamos los ids de dos usuarios que no sean con el que estamos
//     // autenticados. Además, necesitan tener una conversación entre 
//     // ellos.
//     const userId = '23ebc055-9c15-4713-8fb4-94d1eabec338';
//     const saraId = 'a26a4a2e-03a8-45e8-96a0-daf79ac041c0';

//     const { data, error } = await supabase
//         .from('private_chats')
//         .select()
//         .eq('user_id1', userId)
//         .eq('user_id2', saraId);
    
//     if(error) {
//         console.error('[Test] No se pudo correr correctamente el test para probar si puedo o no leer una conversación privada en la que no participamos.');
//         return;
//     }

//     if(data.length > 0) {
//         console.warn('❌ [Test] Pudimos leer la conversación de la cual no participamos.', data);
//     } else {
//         console.log('✔ [Test] No pudimos leer la conversación de la cual no participamos.');
//     }
// }

// async function testCantCreateAPrivateChatInWhichImNotAPartOf() {
//     const userId = '23ebc055-9c15-4713-8fb4-94d1eabec338';
//     const saraId = 'a26a4a2e-03a8-45e8-96a0-daf79ac041c0';

//     const { error } = await supabase
//         .from('private_chats')
//         .insert({
//             user_id1: userId,
//             user_id2: saraId,
//         });

//     if(error) {
//         console.log('✔ [Test] No pudimos crear una conversación de la cual no participamos.');
//     } else {
//         console.warn('❌ [Test] Pudimos crear una conversación de la cual no participamos.');
//     }
// }

// async function testCantReadAPrivateChatMessagesIfImNotAPartOfIt() {
//     const chatId = 14;

//     const { data, error } = await supabase
//         .from('private_chat_messages')
//         .select()
//         .eq('chat_id', chatId);

//     if(error) {
//         console.error('[Test] No se pudo correr correctamente el test para probar si puedo o no leer los mensajes de una conversación privada en la que no participamos.');
//         return;
//     }

//     if(data.length > 0) {
//         console.warn('❌ [Test] Pudimos leer los mensajes de una conversación de la cual no participamos.', data);
//     } else {
//         console.log('✔ [Test] No pudimos leer los mensajes de una conversación de la cual no participamos.');
//     }
// }

// async function testCantCreateAPrivateChatIfImNotAPartOf() {
//     const chatId = 14;
//     const saraId = 'a26a4a2e-03a8-45e8-96a0-daf79ac041c0';

//     const { data, error } = await supabase
//         .from('private_chat_messages')
//         .insert({
//             chat_id: chatId,
//             user_id: saraId,
//             content: 'Hola :D',
//         });

//     if(error) {
//         console.error('[Test] No se pudo correr correctamente el test para probar si puedo o no leer los mensajes de una conversación privada en la que no participamos.');
//         return;
//     }

//     if(data.length > 0) {
//         console.warn('❌ [Test] Pudimos enviar el mensaje de una conversación de la cual no participamos.');
//     } else {
//         console.log('✔ [Test] No  pudimos enviar el mensaje de una conversación de la cual no participamos.');
//     }
// }

// async function testCantCreateAPrivateChatMessagesIfImNotTheSenderId() {
//     const chatId = 20;
//     const saraId = 'a26a4a2e-03a8-45e8-96a0-daf79ac041c0';

//     const { error } = await supabase
//         .from('private_chat_messages')
//         .insert({
//             chat_id: chatId,
//             user_id: saraId,
//             content: "Yay :D",
//         });

//     if(error) {
//         console.log('✔ [Test] No pudimos enviar el mensaje de una conversación de la cual participamos si no lo firmamos.')
//     } else {
//         console.warn('❌ [Test] Pudimos enviar el mensaje de una conversación de la cual participamos si no lo firmamos.');
//     }
// }


// testCantReadAPrivateChatInWhichImNotAPartOf();
// testCantCreateAPrivateChatInWhichImNotAPartOf();
// testCantReadAPrivateChatMessagesIfImNotAPartOfIt();
// testCantCreateAPrivateChatIfImNotAPartOf();
// testCantCreateAPrivateChatMessagesIfImNotTheSenderId();