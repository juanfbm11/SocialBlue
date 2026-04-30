export interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  users: { username: string }; // Relación de Supabase
}

export interface users{
  id: string;
  username: string;
  nombre:string;
  apellido: string;
  email: string;
  contrasena: string;
  created_at: string;
}