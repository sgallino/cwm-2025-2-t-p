import { supabase } from "./supabase";

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, display_name: string|null, bio: string|null, career: string|null}>}
 */
export async function fetchUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        // Pedimos que el "id" sea igual al id que recibimos.
        .eq('id', id)
        // Aclaramos que solo queremos traer un único registro.
        .limit(1)
        .single();
    
    if(error) {
        console.error('[user-profiles.js fetchUserProfileById] Error al buscar el perfil del usuario.', error);
        throw new Error(error.message);
    }

    // console.log('Data del perfil del usuario: ', id, data);
    // Retornamos el registro que trajimos.
    return data;
}

/**
 * 
 * @param {{id: string, email: string, display_name?: string|null, bio?: string|null, career?: string|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario:', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} id 
 * @param {{display_name?: string|null, bio?: string|null, career?: string|null, photo_url?: string|null}} data 
 */
export async function updateUserProfileById(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id);

    if(error) {
        console.error('[user-profiles.js updateUserProfileById] Error al actualizar el perfil del usuario. ', error);
        throw new Error(error.message);
    }
}