-- ============================================================
-- SOCIALBLUE — POLÍTICAS RLS COMPLETAS PARA SUPABASE
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- ============================================================


-- ============================================================
-- 1. TABLA: users
-- ============================================================

-- Asegúrate de que RLS esté habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores para empezar limpio
DROP POLICY IF EXISTS "users_select_all"      ON users;
DROP POLICY IF EXISTS "users_insert_own"      ON users;
DROP POLICY IF EXISTS "users_update_own"      ON users;
DROP POLICY IF EXISTS "users_delete_admin"    ON users;

-- Cualquier usuario autenticado puede VER todos los perfiles
CREATE POLICY "users_select_all"
ON users FOR SELECT
TO authenticated
USING (true);

-- Un usuario puede INSERTAR su propio perfil (al registrarse)
CREATE POLICY "users_insert_own"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Un usuario puede ACTUALIZAR su propio perfil (ej: cambiar avatar)
CREATE POLICY "users_update_own"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Solo el admin puede ELIMINAR usuarios
-- (admin = email 'admin@gmail.com' o role = 'admin')
CREATE POLICY "users_delete_admin"
ON users FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@gmail.com'
  OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);


-- ============================================================
-- 2. TABLA: posts
-- ============================================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_all"      ON posts;
DROP POLICY IF EXISTS "posts_insert_own"      ON posts;
DROP POLICY IF EXISTS "posts_delete_own"      ON posts;
DROP POLICY IF EXISTS "posts_delete_admin"    ON posts;

-- Cualquier usuario autenticado puede VER todos los posts
CREATE POLICY "posts_select_all"
ON posts FOR SELECT
TO authenticated
USING (true);

-- Un usuario puede PUBLICAR sus propios posts
CREATE POLICY "posts_insert_own"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Un usuario puede ELIMINAR sus propios posts
CREATE POLICY "posts_delete_own"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- El admin puede ELIMINAR cualquier post
CREATE POLICY "posts_delete_admin"
ON posts FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@gmail.com'
  OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);


-- ============================================================
-- 3. TABLA: likes
-- ============================================================

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_select_all"      ON likes;
DROP POLICY IF EXISTS "likes_insert_own"      ON likes;
DROP POLICY IF EXISTS "likes_delete_own"      ON likes;
DROP POLICY IF EXISTS "likes_delete_admin"    ON likes;

-- Cualquier usuario autenticado puede VER los likes
CREATE POLICY "likes_select_all"
ON likes FOR SELECT
TO authenticated
USING (true);

-- Un usuario puede DAR LIKE (insertar su propio like)
CREATE POLICY "likes_insert_own"
ON likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Un usuario puede QUITAR su propio like
CREATE POLICY "likes_delete_own"
ON likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- El admin puede ELIMINAR cualquier like (necesario para borrar posts)
CREATE POLICY "likes_delete_admin"
ON likes FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@gmail.com'
  OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);


-- ============================================================
-- 4. TABLA: comments
-- ============================================================

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_all"    ON comments;
DROP POLICY IF EXISTS "comments_insert_own"    ON comments;
DROP POLICY IF EXISTS "comments_delete_own"    ON comments;
DROP POLICY IF EXISTS "comments_delete_admin"  ON comments;

-- Cualquier usuario autenticado puede VER los comentarios
CREATE POLICY "comments_select_all"
ON comments FOR SELECT
TO authenticated
USING (true);

-- Un usuario puede COMENTAR (insertar su propio comentario)
CREATE POLICY "comments_insert_own"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Un usuario puede ELIMINAR su propio comentario
CREATE POLICY "comments_delete_own"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- El admin puede ELIMINAR cualquier comentario
CREATE POLICY "comments_delete_admin"
ON comments FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@gmail.com'
  OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);


-- ============================================================
-- 5. STORAGE: bucket "post-images"
-- ============================================================
-- Ve a: Storage > Policies > post-images
-- O ejecuta estos comandos directamente:

-- Eliminar TODAS las políticas de storage anteriores (limpieza total)
DROP POLICY IF EXISTS "storage_select_public"    ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_own"       ON storage.objects;
DROP POLICY IF EXISTS "storage_update_own"       ON storage.objects;
DROP POLICY IF EXISTS "storage_update_admin"     ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_own"       ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_admin"     ON storage.objects;

-- ──────────────────────────────────────────────────────────
-- SELECT: cualquier usuario autenticado puede ver imágenes
-- ──────────────────────────────────────────────────────────
CREATE POLICY "storage_select_public"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'post-images');

-- ──────────────────────────────────────────────────────────
-- INSERT: el usuario solo puede subir dentro de su carpeta
-- Rutas válidas: {uid}/avatar.jpg  |  {uid}/posts/123.jpg
--
-- Usamos  name LIKE auth.uid() || '/%'
-- porque es más robusto que storage.foldername()[1]
-- ──────────────────────────────────────────────────────────
CREATE POLICY "storage_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND name LIKE (auth.uid()::text || '/%')
);

-- ──────────────────────────────────────────────────────────
-- UPDATE (upsert): cuando el archivo ya existe Supabase
-- ejecuta UPDATE en lugar de INSERT.
-- USING  → verifica que el objeto ya es tuyo (por owner)
-- WITH CHECK → verifica que la nueva ruta también es tuya
-- ──────────────────────────────────────────────────────────
CREATE POLICY "storage_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'post-images'
  AND name LIKE (auth.uid()::text || '/%')
);

-- UPDATE admin: puede sobreescribir cualquier imagen
CREATE POLICY "storage_update_admin"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@gmail.com'
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  )
)
WITH CHECK (bucket_id = 'post-images');

-- ──────────────────────────────────────────────────────────
-- DELETE: el usuario borra sus propios archivos (por owner)
-- ──────────────────────────────────────────────────────────
CREATE POLICY "storage_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND owner = auth.uid()
);

-- DELETE admin: puede borrar cualquier imagen
CREATE POLICY "storage_delete_admin"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@gmail.com'
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  )
);


-- ============================================================
-- VERIFICACIÓN FINAL
-- Deberías ver todas las políticas creadas arriba
-- ============================================================
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('users', 'posts', 'likes', 'comments', 'objects')
ORDER BY tablename, cmd;
