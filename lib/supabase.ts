import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
 
const supabasUrl = 'https://ezsnsowtkdwwrsxictzg.supabase.co'
const supabaseAnonkey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c25zb3d0a2R3d3JzeGljdHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODQ3MDMsImV4cCI6MjA5MjU2MDcwM30.yDXJLuz0NOeTbNOwFY9CZZR-7Qy0FIekCf9jbKM0wxo'
 

export const supabase = createClient(supabasUrl, supabaseAnonkey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});