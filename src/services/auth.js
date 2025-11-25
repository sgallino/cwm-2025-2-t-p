import { deleteFile, getFileURL, uploadFile } from "./storage";
import { supabase } from "./supabase";
import { createUserProfile, fetchUserProfileById, updateUserProfileById } from "./user-profiles";

/*
# Sistema de autenticación
En este servicio vamos a crear, además de las funciones para la 
autenticación, un sistema para proveer la data del usuario autenticado,
si es que lo hay.

Para lograrlo, vamos a necesitar varias cositas.

1. Tener una variable donde almacenar los datos del usuario.
2. Cuando un usuario se registra o autentica o cierra sesión, 
    actualizamos la variable.
3. Ofrecer una función que permita obtener los datos del usuario
    autenticado. Teniendo en cuenta que debe poder actualizarse
    fácilmente cuando los datos del usuario cambien.

Para este último punto, la forma convencional de hacerlo es usando
el patrón de diseño Observer.

https://refactoring.guru/design-patterns/observer

¿Qué es el patrón Observer?
El patrón Observer sirve para modelar una relación de uno a muchos,
donde muchos interesados (llamados "observers") necesitan o desean
enterarse de los cambios ocurridos sobre un elemento del sistema 
(llamado el "subject").

Para implementarlo, típicamente la mayor parte del trabajo recae en 
el subject.
El subject debe llevar un registro de quiénes son los que piden 
enterarse de los cambios, debe ofrecer una manera de "suscribirse"
a sus cambios, y debe "notificar" automáticamente a todos estos 
observers de los cambios ocurridos.

Nota: Si bien el término más común para el registro de un observer es
"suscribirse", también se habla de los términos "attach" (adjuntar),
"listen" (escuchar) y "watch" (observar).

Checklist para nuestro Observer:
- Un "subject". 🆗 La variable "user".
- Una lista de los "observers". 🆗 La variable "observers".
- Un método para suscribirse (agregarse como "observer"). 🆗
- Al menos un método para notificar a los observers cuando ocurra algún
    cambio en el "subject".
*/
let user = {
    id: null,
    email: null,
    display_name: null,
    bio: null,
    career: null,
    photo_url: null,
}
let observers = [];

// Obtenemos los datos del usuario autenticado cuando arranca la aplicación.
loadUserFromSupabase();

async function loadUserFromSupabase() {
    const { data, error } = await supabase.auth.getUser();

    if(error) {
        // console.warn('[auth.js loadUserFromSupabase] No hay un usuario autenticado.');
        return;
    }

    setUserState({
        id: data.user.id,
        email: data.user.email,
    });

    // Dejamos corriendo la instrucción cargar el resto del perfil.
    loadAuthUserProfile();
}

async function loadAuthUserProfile() {
    fetchUserProfileById(user.id)
        .then(profileData => {
            setUserState({
                ...user,
                display_name: profileData.display_name,
                bio: profileData.bio,
                career: profileData.career,
                photo_url: profileData.photo_url,
            });
        });
}

export async function register(email, password) {
    const { data, error } = await supabase
        // "auth" contiene un objeto con método para manejar la 
        // autenticación.
        // Entre ellos, está signUp() que registra un usuario.
        .auth
        .signUp({
            email,
            password,
        });

    if(error) {
        console.error('[auth.js register] Error al registrar el usuario: ', error);
        throw new Error(error.cause);
    }

    await createUserProfile({
        id: data.user.id,
        email: data.user.email,
    });

    // Actualizamos el usuario.
    setUserState({
        id: data.user.id,
        email: data.user.email,
    });
    // return data.user;
}

export async function login(email, password) {
    const { data, error } = await supabase
        .auth
        .signInWithPassword({
            email,
            password,
        });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw new Error(error.cause);
    }

    // Actualizamos el usuario.
    setUserState({
        id: data.user.id,
        email: data.user.email,
    });

    loadAuthUserProfile();
    // return data.user;
}

export async function logout() {
    supabase.auth.signOut();

    // Vaciamos el usuario.
    setUserState({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
    });
}

/**
 * 
 * @param {{display_name: string|null, bio: string|null, career: string|null}} data 
 */
export async function updateProfile(data) {
    try {
        // Llamamos al método que actualiza el perfil del usuario.
        // Lo hacemos desde acá para que:
        // 1. Ya quede fijado que use el id del usuario autenticado.
        // 2. Para poder sincronizar este cambio con los datos actuales
        //  del usuario en el sistema.
        await updateUserProfileById(user.id, data);

        // Actualizamos la data del perfil autenticado.
        setUserState({
            ...user,
            display_name: data.display_name,
            bio: data.bio,
            career: data.career,
        });
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {File} file 
 */
export async function updateProfileAvatar(file) {
    // Vamos a guardar el archivo que recibimos en una ruta que sea:
    //  {bucket}/{userId}/{UUID}.jpg
    // crypto es el objeto nativo de JS que ofrece un par de métodos
    // para manejar valores generados de manera criptográficamente
    // segura. Entre ellos, tenemos randomUUID() que genera un UUID
    // nuevo.
    try {
        const photo_url = `${user.id}/${crypto.randomUUID()}.jpg`;
        await uploadFile(photo_url, file);

        // Obtenemos el link de la imagen que se acaba de generar, 
        // lo guardamos en la tabla, y actualizamos los observers.
        // TODO: Ajustar los "composables".
        await updateUserProfileById(user.id, {
            photo_url,
        });

        // Dejamos borrando la imagen vieja.
        deleteFile(user.photo_url);

        setUserState({
            photo_url,
        });
    } catch (error) {
        // console.error('[auth.js] Error al subir el archivo.', error);
        
        throw error;
    }
}

/*---------------------------------------------------------------
| Funciones del Observer
+---------------------------------------------------------------*/
export function getUser() {
    return {...user};
}

/**
 * 
 * @param {() => {}} callback El Observer. Debe ser una función que va a recibir los datos del usuario cada vez que cambien.
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToAuthState(callback) {
    observers.push(callback); // Registramos el callback.

    // console.log("Nuevo observer agregado. El stack actual es: ", observers);

    notify(callback); // Le notificamos la data actual.

    // Siempre que creamos algún mecanismo para suscribirnos a algo
    // tenemos que dar algún mecanismo para cancelar esa suscripción.
    // En nuestra implementación, es relativamente simple resolverlo.
    // Lo que vamos a hacer es que esta función de suscripción retorne
    // una nueva función que cuando se ejecute cancele la suscripción
    // realizada (es decir, remueva el callback del stack).
    return () => {
        observers = observers.filter(obs => obs !== callback);
        // console.log('Observer removido. El stack actual es: ', observers);
    }
}

/**
 * Ejecuta el callback, y le pasa como argumento una copia de los datos
 * actuales del usuario.
 * 
 * @param {() => {}} callback 
 */
function notify(callback) {
    // Importante: Pasamos una copia para no pasar la referencia, que
    // permitiría que el que se suscribe modifique el valor de la 
    // variable user.
    callback({...user});
}

/**
 * Notifica a todos los observers del valor actual del usuario.
 */
function notifyAll() {
    // observers.forEach(callback => notify(callback));
    observers.forEach(notify); // Más cortito.
}

function setUserState(state) {
    user = {
        ...user,
        ...state,
    }
    notifyAll();
}