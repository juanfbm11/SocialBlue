import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
 
const supabasUrl = 'https://ezsnsowtkdwwrsxictzg.supabase.co'
const supabaseAnonkey = 'sb_publishable_gWvcBDH4Sit2bgmOaquNQQ_RqtAqqDo'
 

export const supabase = createClient(supabasUrl, supabaseAnonkey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});