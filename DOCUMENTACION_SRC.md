# 📘 Documentación Detallada — `src/`

> **Proyecto:** SocialBlue — Red social móvil construida con React Native + Expo + Supabase.

---

## 📁 Estructura general de `src/`

```
src/
├── Screens/              # Pantallas de la aplicación
│   ├── Home.tsx          # Feed principal (posts, likes, comentarios)
│   ├── Login.tsx         # Inicio de sesión
│   ├── Registro.tsx      # Registro de cuenta nueva
│   ├── MyPosts.tsx       # Perfil propio + cambio de avatar
│   ├── Userprofile.tsx   # Perfil de otro usuario
│   └── SuperAdmin.tsx    # Panel de administración
├── components/           # Componentes reutilizables
│   ├── BrandHeader.tsx   # Encabezado con logo de la marca
│   ├── GlassCard.tsx     # Tarjeta con efecto glassmorphism
│   ├── GradientButton.tsx# Botón con degradado
│   └── StyledInput.tsx   # Input estilizado con icono y validación
├── navegacion/           # Configuración de navegación
│   └── StackNavegator.tsx
├── theme.ts              # Tokens de diseño globales (colores, espaciado, sombras)
└── global.css            # Directivas de Tailwind CSS (NativeWind)
```

---

## 🎨 `src/theme.ts`

Archivo de **design tokens** globales. Define los valores visuales centrales que se usan en todos los componentes.

```ts
export const theme = { ... }
```

### `theme.colors`
| Token | Valor | Uso |
|---|---|---|
| `primary` | `#2563eb` | Azul principal (botones, bordes activos) |
| `primaryLight` | `#60a5fa` | Azul claro (acentos, logo) |
| `secondary` | `#7c3aed` | Violeta (degradados) |
| `accent` | `#f59e0b` | Ámbar (acentos secundarios) |
| `background` | `#f8fafc` | Fondo general gris muy claro |
| `text` | `#1e293b` | Texto principal oscuro |
| `textLight` | `#64748b` | Texto secundario/placeholder |
| `white` | `#ffffff` | Blanco puro |
| `error` | `#ef4444` | Rojo de error |
| `success` | `#22c55e` | Verde de éxito |
| `glass` | `rgba(255,255,255,0.7)` | Fondo efecto vidrio |
| `glassBorder` | `rgba(255,255,255,0.4)` | Borde efecto vidrio |

### `theme.spacing`
Escala de espaciado numérico: `xs=4`, `sm=8`, `md=16`, `lg=24`, `xl=32`, `xxl=48`.

### `theme.borderRadius`
Escala de bordes redondeados: `sm=8`, `md=12`, `lg=16`, `xl=24`, `full=9999`.

### `theme.shadows`
Tres niveles de sombra (`sm`, `md`, `lg`) con `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` y `elevation`.

### `theme.gradients`
| Nombre | Colores |
|---|---|
| `primary` | `['#2563eb', '#7c3aed']` — Azul → Violeta |
| `background` | `['#f1f5f9', '#e2e8f0']` — Grises claros |
| `login` | `['#1e3a8a', '#581c87']` — Azul oscuro → Púrpura profundo |

---

## 🌐 `src/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Importa las tres capas de **Tailwind CSS** via **NativeWind**, permitiendo usar clases de utilidad (`className="..."`) en los componentes React Native de las pantallas Login y Registro.

---

## 🧩 Componentes reutilizables (`src/components/`)

---

### `BrandHeader.tsx`

**Propósito:** Muestra el encabezado visual de la marca SocialBlue en las pantallas de autenticación (Login y Registro).

**Props:** Ninguna (componente estático).

**Lo que renderiza:**
1. Un contenedor con alineación centrada.
2. Un `logoContainer` circular con fondo semi-transparente que contiene el ícono `Globe` de Lucide Icons (blanco, 48px).
3. El nombre de la marca en dos `Text` juntos: "Social" (blanco) y "Blue" (azul `#60a5fa`), ambos en `fontSize: 48` con `fontWeight: '900'`.
4. Una línea decorativa azul (`underline`) de 64px de ancho y 6px de alto.
5. El tagline `"Conecta con el mundo"` en letras pequeñas, mayúsculas y con espaciado de letras amplio.

**Detalle del estilo:**
- El `logoContainer` tiene `backdropFilter: 'blur(10px)'` solo en web (via `Platform.select`).
- La borde del logoContainer usa `rgba(255,255,255,0.3)` para un efecto glassmorphism sutil.

---

### `GlassCard.tsx`

**Propósito:** Contenedor con efecto **glassmorphism** — fondo semitransparente blanco con blur, bordes suaves y sombra elevada.

**Props:**
| Prop | Tipo | Descripción |
|---|---|---|
| `children` | `React.ReactNode` | Contenido interno de la tarjeta |
| `style?` | `ViewStyle` | Estilos adicionales opcionales |
| `className?` | `string` | Clases NativeWind opcionales |

**Estilos clave del `card`:**
- `backgroundColor: 'rgba(255,255,255,0.85)'` — fondo blanco translúcido
- `borderRadius: 32` — bordes muy redondeados
- `padding: 32` — padding generoso
- `borderColor: 'rgba(255,255,255,0.6)'` — borde casi invisible
- `elevation: 10` — sombra pronunciada en Android
- `backdropFilter: 'blur(20px)'` solo en web

---

### `GradientButton.tsx`

**Propósito:** Botón de acción principal con **degradado** azul→violeta, o variante de contorno (outline).

**Props:**
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — | Texto del botón |
| `onPress` | `() => void` | — | Función a ejecutar al presionar |
| `loading?` | `boolean` | `false` | Muestra spinner en lugar del texto |
| `style?` | `ViewStyle` | — | Estilo adicional |
| `variant?` | `'primary' \| 'outline'` | `'primary'` | Variante visual |
| `className?` | `string` | — | Clases NativeWind |

**Comportamiento:**
- **Variante `primary`:** Envuelve el `TouchableOpacity` en un `LinearGradient` de `expo-linear-gradient` usando `theme.gradients.primary` (`['#2563eb', '#7c3aed']`). Dirección diagonal (esquina superior izquierda → inferior derecha).
- **Variante `outline`:** Botón sin relleno con borde del color primario y texto azul.
- Cuando `loading=true`: Muestra `ActivityIndicator` en lugar del texto en ambas variantes.
- El botón tiene `disabled={loading}` para evitar doble tap.

**Dimensiones:** 100% de ancho, 54px de alto.

---

### `StyledInput.tsx`

**Propósito:** Campo de texto estilizado con soporte para etiqueta, ícono, estado de foco, y mensajes de error.

**Props:**
| Prop | Tipo | Descripción |
|---|---|---|
| `label?` | `string` | Etiqueta sobre el input |
| `icon?` | `keyof typeof LucideIcons` | Nombre del ícono de Lucide a mostrar |
| `error?` | `string` | Mensaje de error (cambia el borde a rojo) |
| `className?` | `string` | Clases NativeWind |
| `...props` | `TextInputProps` | Todas las props nativas de TextInput |

**Estado interno:**
- `isFocused: boolean` — controla si el input está enfocado actualmente (via `onFocus`/`onBlur`).

**Comportamiento visual:**
1. Muestra la `label` en negrita sobre el input si se provee.
2. El `inputWrapper` cambia de estilo según el estado:
   - **Normal:** borde `rgba(255,255,255,0.5)`, fondo `rgba(255,255,255,0.7)`
   - **Focused:** borde azul primario, fondo blanco sólido, sombra azul suave
   - **Error:** borde rojo `theme.colors.error`
3. El ícono cambia de color: rojo si hay error, azul si está enfocado, gris si está neutral.
4. Si `error` está definido, muestra el texto de error en rojo debajo del input.

---

## 🧭 Navegación (`src/navegacion/`)

---

### `StackNavegator.tsx`

**Propósito:** Define el árbol de navegación de toda la aplicación. Es el punto de entrada de la UI.

**Tecnología:** `@react-navigation/native` + `@react-navigation/native-stack`.

**Estado interno:**
- `session: Session | null` — sesión activa del usuario (de Supabase Auth).
- `loading: boolean` — mientras se obtiene la sesión inicial.

**Lógica de inicio (`useEffect`):**
1. `supabase.auth.getSession()` — obtiene la sesión actual al montar.
2. `supabase.auth.onAuthStateChange()` — escucha cambios de sesión en tiempo real (login/logout). Actualiza `session`.
3. Al desmontar, llama `subscription.unsubscribe()` para limpiar el listener.

**Mientras carga:** Muestra un `ActivityIndicator` centrado con fondo `#f8fafc`.

**Árbol de pantallas:**

```
NavigationContainer
└── Stack.Navigator (sin headers nativos)
    ├── [Con sesión activa]
    │   ├── "Home"        → HomeScreen
    │   ├── "MyPosts"     → MyPostsScreen
    │   ├── "SuperAdmin"  → SuperAdminScreen
    │   └── "UserProfile" → UserProfile
    └── [Sin sesión]
        ├── "Login"       → Login
        └── "Registro"    → Registro
```

> La pantalla inicial se determina automáticamente: si hay sesión, va a `Home`; si no, va a `Login`.

---

## 📱 Pantallas (`src/Screens/`)

---

### `Login.tsx`

**Propósito:** Pantalla de inicio de sesión con diseño visual de fondo imagen + glassmorphism.

**Estado interno:**
| Variable | Tipo | Descripción |
|---|---|---|
| `email` | `string` | Email ingresado |
| `contrasena` | `string` | Contraseña ingresada |
| `errors` | `{ email: string, password: string }` | Errores de validación de formulario |
| `authError` | `string` | Error devuelto por Supabase Auth |
| `authLoading` | `boolean` | Indica si se está procesando el login |

**Función `validate()`:**
Valida los campos antes de enviar:
- Email no vacío y formato válido (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- Contraseña no vacía.
- Retorna `true/false`. Si hay errores, actualiza `errors`.

**Función `handleLogin()`:**
1. Llama `validate()`. Si falla, no continúa.
2. Activa `authLoading` y limpia `authError`.
3. Llama `supabase.auth.signInWithPassword({ email, password })`.
4. Si Supabase devuelve error → muestra `authError`.
5. Si éxito → `navigation.navigate("Home")`.
6. Maneja excepciones inesperadas con try/catch.

**Estructura visual:**
```
View (fondo azul #1e3a8a)
└── ImageBackground (assets/bg.png, cover)
    └── View (overlay negro 50% opacidad)
        └── SafeAreaView
            └── KeyboardAvoidingView
                └── ScrollView (centrado)
                    └── View (max-w-[420px])
                        ├── BrandHeader
                        └── GlassCard
                            ├── Título "Accede a tu cuenta"
                            ├── StyledInput (email)
                            ├── StyledInput (contraseña, secureTextEntry)
                            ├── "¿Olvidaste tu contraseña?" (sin funcionalidad)
                            ├── GradientButton "Iniciar Sesión"
                            ├── ActivityIndicator (si authLoading)
                            ├── Texto de error (si authError)
                            └── Link a Registro
```

> Usa clases NativeWind (`className="..."`) para el layout y Tailwind de anchos máximos.

---

### `Registro.tsx`

**Propósito:** Pantalla de registro de nueva cuenta. Diseño idéntico a Login (fondo + glassmorphism).

**Estado interno:**
| Variable | Descripción |
|---|---|
| `username` | Nombre de usuario |
| `nombre` | Nombre del usuario (solo letras) |
| `apellido` | Apellido (solo letras) |
| `email` | Correo electrónico |
| `contrasena` | Contraseña (mínimo 6 caracteres) |
| `confirmarContrasena` | Confirmación de contraseña |
| `saving` | Spinner de carga mientras se registra |
| `errors` | Objeto con errores por campo |

**Regex de validación:** `soloLetras = /^[a-zA-ZÁÉÍÓÚñÑ\s]+$/` — solo permite letras, incluyendo caracteres españoles y espacios.

**Función `validate()`:**
Valida todos los campos:
- `username`: no vacío.
- `nombre` / `apellido`: no vacíos y solo letras (con `soloLetras`).
- `email`: no vacío y formato válido.
- `contrasena`: no vacía y al menos 6 caracteres.
- `confirmarContrasena`: debe coincidir con `contrasena`.

**Función `handleGuardar()`:**
1. Valida con `validate()`. Si falla, se detiene.
2. Llama `supabase.auth.signUp({ email, password, options: { data: { username, nombre, apellido } } })`.
3. Si hay `authError` → muestra alerta.
4. Inserta el perfil en la tabla `users` con: `id`, `username`, `nombre`, `apellido`, `email`, `contrasena`.
   > ⚠️ La contraseña se guarda en texto plano en la tabla `users`. Supabase Auth ya la maneja hasheada; esta columna es redundante y representa un riesgo de seguridad.
5. Muestra alerta de éxito y navega a `Login`.

**Estructura visual:** igual a Login, con un formulario de 6 campos (nombre y apellido en fila horizontal con `flex-row`).

---

### `Home.tsx`

**Propósito:** Pantalla principal y más compleja de la app. Es el feed social donde se ven todos los posts, se publican nuevos, se dan likes y comentarios.

**Componentes internos (memoizados con `memo`):**

#### Sub-componente `PostInput`
Área de creación de post. Recibe por props:
- `newPost` / `setNewPost` — texto del post
- `selectedImage` / `setSelectedImage` — imagen seleccionada (URI)
- `pickImage` — función para abrir galería
- `handleCreatePost` — función de publicación
- `uploading` — spinner de carga
- `userAvatar` — URL del avatar del usuario actual

Muestra:
- Avatar del usuario (imagen o ícono `User`)
- `TextInput` multilinea con placeholder "¿Qué estás pensando?"
- Preview de imagen seleccionada con botón ✕ para eliminarla
- Icono de galería (abre `pickImage`)
- Botón "Publicar" (azul, deshabilitado si no hay contenido ni imagen, spinner si `uploading`)

#### Sub-componente `PostCard`
Tarjeta de un post. Props:
- `item` — datos del post (contenido, imagen, usuario, likes, comentarios)
- `userId` — ID del usuario actual (para saber si ya dio like)
- `onLike` / `onComment` / `onToggleComments` / `onPressUser` — callbacks
- `isCommentsVisible` — si los comentarios están expandidos
- `isSuperAdmin` — muestra botones de eliminación
- `onDeletePost` / `onDeleteComment` — callbacks de admin

Estructura de la tarjeta:
```
View (postCard)
├── Header: Avatar + @usuario + timestamp + [Botón "Eliminar" si isSuperAdmin]
├── Text (contenido del post)
├── Image (si item.image_url existe)
├── Acciones: ❤️ likes | 💬 comentarios | "Ver/Ocultar comentarios"
└── Lista de comentarios (si isCommentsVisible)
    └── Por cada comentario: Avatar + @usuario: texto + [Trash si isSuperAdmin]
```

**Estado de `HomeScreen`:**
| Variable | Tipo | Descripción |
|---|---|---|
| `posts` | `any[]` | Lista de posts del feed |
| `loading` | `boolean` | Carga inicial |
| `newPost` | `string` | Texto del nuevo post |
| `refreshing` | `boolean` | Pull-to-refresh activo |
| `userId` | `string \| null` | ID del usuario logueado |
| `userAvatar` | `string \| null` | URL del avatar del usuario actual |
| `isSuperAdmin` | `boolean` | Si el usuario es administrador |
| `selectedImage` | `string \| null` | URI de imagen para el nuevo post |
| `uploading` | `boolean` | Subiendo imagen/post |
| `commentModalVisible` | `boolean` | Modal de comentar abierto |
| `commentText` | `string` | Texto del comentario en redacción |
| `selectedPostId` | `string \| null` | ID del post al que se va a comentar |
| `visibleComments` | `{ [postId]: boolean }` | Control de qué posts tienen comentarios visibles |

**Funciones clave:**

##### `fetchUser()`
- Obtiene la sesión de Supabase.
- Consulta la tabla `users` para obtener `avatar_url` y `role`.
- Determina si es `isSuperAdmin` si el email es `"admin@gmail.com"` **O** si el campo `role` es `"admin"`.

##### `fetchPosts()`
Hace una query con **relaciones anidadas** (Supabase joins):
```sql
SELECT *, users(username, avatar_url), likes(user_id),
  comments(*, users(username, avatar_url))
FROM posts ORDER BY created_at DESC
```
Pobla el estado `posts`. Mientras carga, muestra un `ActivityIndicator`.

##### `pickImage()`
Usa `expo-image-picker` para abrir la galería del dispositivo:
- Permite editar (recortar) con aspecto 4:3.
- Calidad 0.7 (compresión).
- Guarda la URI local en `selectedImage`.

##### `handleCreatePost()`
Flujo de publicación:
1. Valida que haya texto o imagen.
2. Cierra el teclado.
3. Si hay imagen seleccionada:
   - Hace `fetch(uri)` → `blob`.
   - Detecta el tipo MIME y extensión.
   - Sube a Supabase Storage en el bucket `post-images` con la ruta `{userId}/posts/{timestamp}.{ext}`.
   - Obtiene la URL pública.
4. Verifica que la sesión siga activa.
5. Inserta en la tabla `posts`: `{ content, user_id, image_url }`.
6. Limpia el formulario y recarga el feed.

##### `handleLike(postId, userHasLiked)`
- Si ya dio like: elimina de `likes` con `.delete().match({ post_id, user_id })`.
- Si no: inserta en `likes` con `{ post_id, user_id }`.
- Recarga posts después.

##### `openCommentModal(postId)` / `submitComment()`
- `openCommentModal`: guarda `selectedPostId` y abre el modal.
- `submitComment`: inserta en `comments` `{ post_id, user_id, content }`. Cierra modal y recarga posts.

##### `handleDeletePost(postId)` (solo SuperAdmin)
Flujo de eliminación segura con confirmación (`Alert.alert` en móvil, `window.confirm` en web):
1. Elimina todos los `likes` del post.
2. Elimina todos los `comments` del post.
3. Verifica que no queden likes ni comentarios referenciando el post.
4. Elimina el post de la tabla `posts`.

##### `handleDeleteComment(commentId)` (solo SuperAdmin)
Con confirmación, elimina directamente de la tabla `comments` por ID.

##### `toggleComments(postId)`
Alterna la visibilidad de los comentarios de un post específico en `visibleComments`.

##### `handlePressUser(profileUserId)`
Navega a la pantalla `"UserProfile"` pasando el `userId` del perfil a ver.

##### `handleLogout()`
Llama `supabase.auth.signOut()`, lo que activa el listener en `StackNavegator` y redirige automáticamente al flujo de Login.

**UI principal:**
```
SafeAreaView
├── StatusBar
├── Header: "SocialBlue" (logo) + iconos User (→MyPosts) y LogOut
├── [Si isSuperAdmin] Botón azul "Ir a Panel Super Admin"
├── PostInput (área de creación)
├── FlatList de posts (con pull-to-refresh)
│   └── PostCard por cada item
└── Modal de comentarios (slide-up)
    ├── KeyboardAvoidingView
    ├── Título "Comentar" + botón cerrar
    ├── TextInput multilinea (autoFocus)
    └── Botón "Enviar"
```

---

### `MyPosts.tsx`

**Propósito:** Pantalla de perfil propio. Muestra el avatar, nombre, conteo de posts y una lista de las publicaciones del usuario logueado. Permite cambiar la foto de perfil.

**Estado interno:**
| Variable | Descripción |
|---|---|
| `posts` | Posts propios del usuario |
| `loading` | Cargando posts |
| `userId` | ID del usuario logueado |
| `userProfile` | Datos del perfil (nombre, username, avatar_url...) |
| `uploadingAvatar` | Subiendo nueva foto de perfil |

**Funciones:**

##### `fetchUser()`
Obtiene la sesión. Si hay sesión: guarda `userId`, llama `fetchProfile` y `fetchMyPosts`. Si no hay sesión: redirige a `Login`.

##### `fetchProfile(uid)`
Consulta `users` con `select('*')` para obtener todos los datos del perfil del usuario.

##### `fetchMyPosts(uid)`
Consulta `posts` del usuario con joins:
```sql
SELECT *, users(username, avatar_url), likes(user_id), comments(*)
FROM posts WHERE user_id = uid ORDER BY created_at DESC
```

##### `changeAvatar()`
Flujo de cambio de avatar:
1. Abre la galería con `expo-image-picker` (aspecto 1:1 — cuadrado, calidad 0.5).
2. Convierte la URI a blob.
3. Sube a Supabase Storage en `post-images/{userId}/avatar.{ext}` con `upsert: true` (sobreescribe el avatar anterior).
4. Obtiene la URL pública.
5. Actualiza la columna `avatar_url` en la tabla `users`.
6. Actualiza el estado local `userProfile`.

**UI:**
```
SafeAreaView
├── Header: ← + "Mi Perfil"
└── FlatList
    ├── ListHeaderComponent (perfil):
    │   ├── Avatar grande (tocable → changeAvatar) con badge de cámara
    │   ├── ActivityIndicator si uploadingAvatar
    │   ├── Nombre completo + @username
    │   └── Stats: número de Posts
    └── renderPost (por cada post):
        ├── Avatar pequeño + @usuario + "Publicado por ti"
        ├── Contenido del post
        ├── Imagen (si existe)
        └── Estadísticas: ❤️ N  💬 N
```

---

### `Userprofile.tsx`

**Propósito:** Perfil público de cualquier usuario. Accesible al pulsar el nombre/avatar de un usuario en el feed.

**Recibe por `route.params`:** `userId` — el ID del usuario cuyo perfil se va a ver.

**Estado interno:**
| Variable | Descripción |
|---|---|
| `profile` | Datos del perfil del usuario objetivo |
| `posts` | Posts del usuario objetivo |
| `loading` | Estado de carga |
| `currentUserId` | ID del usuario logueado (para comparar) |

**Cálculo:** `isOwnProfile = currentUserId === profileUserId`
- Si es el propio perfil → muestra botón "Editar perfil" que navega a `MyPosts`.
- El título del header cambia: "Mi Perfil" vs "Perfil".

**`useEffect` con dependencia `[profileUserId]`:** Recarga el perfil si cambia el usuario a ver (útil si se navega entre perfiles).

**Funciones:**
- `fetchProfile()`: Consulta `users` por ID.
- `fetchPosts()`: Consulta posts del usuario con likes y comentarios.

**UI:**
```
SafeAreaView
├── Header: ← + "Mi Perfil" / "Perfil"
└── FlatList
    ├── ListHeaderComponent:
    │   ├── Avatar grande (no tocable en perfil ajeno)
    │   ├── Nombre + @username
    │   ├── [Si isOwnProfile] Botón "Editar perfil" → MyPosts
    │   └── Stats: número de Posts
    └── renderPost (por cada post):
        ├── Contenido del post
        ├── Imagen (si existe)
        └── Stats: ❤️ N  💬 N
```

---

### `SuperAdmin.tsx`

**Propósito:** Panel de control exclusivo para el administrador. Permite ver todos los usuarios, sus posts y eliminar contenido o cuentas completas.

> 🔒 **Protección de acceso:** Al montar, verifica las credenciales del administrador. Si no es admin, redirige de vuelta con `navigation.goBack()`.

**Constante:** `SUPER_ADMIN_USERNAME = 'admin@gmail.com'`

**Estado interno:**
| Variable | Descripción |
|---|---|
| `users` | Lista de todos los usuarios |
| `selectedUser` | Usuario actualmente seleccionado para ver detalles |
| `userPosts` | Posts del usuario seleccionado |
| `loadingUsers` | Cargando la lista de usuarios |
| `loadingPosts` | Cargando posts del usuario seleccionado |
| `isAdmin` | Si el usuario actual tiene permisos de admin |

**Función `checkAdminAccess()`:**
1. Obtiene la sesión activa.
2. Si no hay sesión → alerta y navega a `Login`.
3. Consulta la tabla `users` para obtener `username`, `email` y `role`.
4. Considera admin si:
   - `session.user.email === 'admin@gmail.com'` **O**
   - `profile.username === 'admin@gmail.com'` **O**
   - `profile.email === 'admin@gmail.com'` **O**
   - `profile.role === 'admin'`
5. Si es admin → `setIsAdmin(true)` + `fetchAllUsers()`.
6. Si no es admin → alerta + `navigation.goBack()`.

**Función `fetchAllUsers()`:**
Obtiene todos los registros de la tabla `users` ordenados por `username` ascendente.

**Función `fetchPostsForUser(user)`:**
Guarda el usuario seleccionado y consulta sus posts con likes y comentarios anidados.

**Función `handleDeletePost(postId)`:**
Igual al flujo en `Home.tsx`:
1. Confirmación (Alert/confirm).
2. Elimina likes del post.
3. Elimina comentarios del post.
4. Verifica que no queden registros dependientes.
5. Elimina el post.
6. Recarga los posts del usuario seleccionado.

**Función `handleDeleteComment(commentId)`:**
Elimina directamente el comentario de la tabla `comments`.

**Función `handleDeleteUser(targetUserId)`:**
Eliminación en cascada de un usuario completo:
1. Protección: no puede eliminar al propio admin.
2. Confirmación.
3. Obtiene todos los IDs de posts del usuario.
4. Elimina likes y comentarios de esos posts.
5. Elimina likes hechos por el usuario en posts ajenos.
6. Elimina comentarios hechos por el usuario en posts ajenos.
7. Elimina todos los posts del usuario.
8. Elimina el registro del usuario de la tabla `users`.
9. Limpia `selectedUser` y recarga la lista de usuarios.

> ⚠️ No elimina la cuenta de Supabase Auth (solo el perfil en la tabla `users`). El usuario podría seguir autenticándose.

**UI (dos vistas condicionales):**

**Vista 1: Lista de usuarios** (cuando `!selectedUser`)
```
View
├── Sección: "Todos los usuarios registrados (N)"
└── FlatList de usuarios
    └── Por cada usuario:
        ├── Avatar (imagen o icono User)
        ├── Nombre completo + @username
        └── ChevronRight → selecciona usuario
```

**Vista 2: Detalle de usuario** (cuando `selectedUser`)
```
View
├── Botón "← Volver a usuarios"
├── Info del usuario: Avatar grande + Nombre + @username
├── Botón rojo "Eliminar Usuario"
└── FlatList de posts del usuario
    └── Por cada post:
        ├── ID del post (truncado) + Botón "Eliminar"
        ├── Contenido del post
        ├── Imagen (si existe)
        ├── Stats: N Likes, N Comentarios
        └── Sección de comentarios:
            └── Por cada comentario:
                ├── Avatar + @usuario: texto
                └── Botón trash para eliminar comentario
```

---

## 🔗 Flujo de datos con Supabase

```
┌─────────────────────────────────────────────────────┐
│                     SUPABASE                        │
│                                                     │
│  Auth           Storage          Database           │
│  ─────          ───────          ────────           │
│  signUp()       post-images/     users              │
│  signIn()       ├── {uid}/       ├── id             │
│  signOut()      │   avatar.jpg   ├── username       │
│  getSession()   └── {uid}/posts/ ├── nombre         │
│  onAuthStateChange()  └── {ts}.jpg ├── apellido     │
│                                  ├── email          │
│                                  ├── avatar_url     │
│                                  └── role           │
│                                                     │
│                                  posts              │
│                                  ├── id             │
│                                  ├── content        │
│                                  ├── image_url      │
│                                  ├── user_id (FK)   │
│                                  └── created_at     │
│                                                     │
│                                  likes              │
│                                  ├── post_id (FK)   │
│                                  └── user_id (FK)   │
│                                                     │
│                                  comments           │
│                                  ├── id             │
│                                  ├── post_id (FK)   │
│                                  ├── user_id (FK)   │
│                                  └── content        │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de navegación

```
[Sin sesión]                     [Con sesión]
    │                                │
    ▼                                ▼
  Login ──────────────────────────► Home ──────────────► MyPosts
    │                                │                       │
    ▼                                ▼                       │
 Registro ─── (tras éxito) ───► SuperAdmin (solo admins)    │
                                     │                       │
                                     ▼                       │
                               UserProfile ◄────────────────┘
                          (al pulsar cualquier usuario)
```

---

## ⚙️ Librerías externas utilizadas en `src/`

| Librería | Uso |
|---|---|
| `react` | Hooks (`useState`, `useEffect`, `useCallback`, `memo`) |
| `react-native` | Componentes UI nativos |
| `react-native-safe-area-context` | SafeAreaView con control de edges |
| `@react-navigation/native` + `native-stack` | Sistema de navegación entre pantallas |
| `@supabase/supabase-js` | Auth, base de datos y storage |
| `expo-image-picker` | Selección de imágenes de la galería del dispositivo |
| `expo-linear-gradient` | Degradados en `GradientButton` |
| `lucide-react-native` | Librería de iconos vectoriales |
| `nativewind` | Clases de utilidad Tailwind en React Native |
