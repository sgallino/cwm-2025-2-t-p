// Este servicio instancia la conexión con Supabase y la exporta.
import { createClient } from '@supabase/supabase-js';

// Preparamos las credenciales de nuestro backend.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Creamos la instancia del cliente de Supabase, y la exportamos.
export const supabase = createClient(supabaseUrl, supabaseKey);