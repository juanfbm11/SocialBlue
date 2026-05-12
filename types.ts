export interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  users: { 
    username: string;
    avatar_url?: string;
  };
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  users: { 
    username: string;
    avatar_url?: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}