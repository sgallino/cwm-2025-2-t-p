// Este servicio se encarga del manejo de los archivos en Supabase
// Storage.

import { supabase } from "./supabase";

/**
 * 
 * @param {string} filepath 
 * @param {File} file 
 * @param {string} bucket 
 */
export async function uploadFile(filepath, file, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(filepath, file);
    
    if(error) {
        console.error('[storage.js uploadFile] Error al subir el archivo: ', error);
        throw new Error(error.message);
    }
}

export async function deleteFile(filepath, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove(filepath);
    
    if(error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo: ', error);
        throw new Error(error.message);
    }
}

export function getFileURL(filepath, bucket = 'avatars') {
    const { data, error } = supabase 
        .storage
        .from(bucket)
        .getPublicUrl(filepath);

    // getPublicUrl nos retorna un objeto con la propiedad "data",
    // que contiene a su vez la propiedad publicUrl con la ruta.
    return data.publicUrl;
}