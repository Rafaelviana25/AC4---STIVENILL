import { createClient } from '@supabase/supabase-js';

// Função para limpar as chaves de qualquer caractere invisível ou espaço
const cleanKey = (key: string) => {
  if (!key) return '';
  return key.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "").replace(/\s/g, '');
};

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = cleanKey(rawUrl).replace(/\/$/, '');
let supabaseAnonKey = cleanKey(rawKey);

// Se o usuário colou "sb_ey..." (prefixo sb_ concatenado com JWT), removemos o prefixo.
if (supabaseAnonKey.startsWith('sb_ey')) {
  supabaseAnonKey = supabaseAnonKey.substring(3);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'ac4-session-v4'
  }
});
