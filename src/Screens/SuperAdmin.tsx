import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Alert,
  Platform
} from 'react-native';
import { supabase } from '../../lib/supabase';
import * as LucideIcons from 'lucide-react-native';

function SuperAdminScreen({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const SUPER_ADMIN_EMAIL = 'admin@gmail.com';

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setLoadingUsers(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      Alert.alert("Acceso Denegado", "No has iniciado sesión.");
      navigation.navigate('Login');
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('username, email, role')
      .eq('id', session.user.id)
      .single();

    const isSuperUser =
      session.user.email?.toLowerCase() === SUPER_ADMIN_EMAIL ||
      profile?.email?.toLowerCase() === SUPER_ADMIN_EMAIL ||
      profile?.role?.toLowerCase() === 'admin';

    if (isSuperUser) {
      setIsAdmin(true);
      fetchAllUsers();
    } else {
      setIsAdmin(false);
      setLoadingUsers(false);
      Alert.alert("Acceso Denegado", "No tienes permisos de Super Admin.");
      navigation.goBack();
    }
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('username', { ascending: true });
    if (data) setUsers(data);
    setLoadingUsers(false);
  };

  const fetchPostsForUser = async (user: any) => {
    setSelectedUser(user);
    setLoadingPosts(true);
    const { data } = await supabase
      .from('posts')
      .select('*, likes(user_id), comments(*, users(username, avatar_url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setUserPosts(data);
    setLoadingPosts(false);
  };

  // ─── DELETE POST — todo via RPC, nunca DELETE directo desde el cliente ───
  const handleDeletePost = (postId: string) => {
    const confirmMessage = "¿Estás seguro de que deseas borrar este post como Super Admin? Esta acción no se puede deshacer.";

    const performDelete = async () => {
      try {
        const { error } = await supabase.rpc('delete_post_as_admin', {
          target_post_id: postId,
        });
        if (error) {
          Alert.alert('Error', 'No se pudo eliminar el post: ' + error.message);
          return;
        }
        Alert.alert("Éxito", "Post eliminado correctamente.");
        if (selectedUser) fetchPostsForUser(selectedUser);
      } catch (e: any) {
        Alert.alert("Error", e?.message || String(e));
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) performDelete();
      return;
    }
    Alert.alert("Confirmar Eliminación", confirmMessage, [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: performDelete },
    ]);
  };

  // ─── DELETE COMMENT — via RPC ───
  const handleDeleteComment = (commentId: string) => {
    const confirmMessage = "¿Estás seguro de que deseas borrar este comentario? Esta acción no se puede deshacer.";

    const performDelete = async () => {
      try {
        const { error } = await supabase.rpc('delete_comment_as_admin', {
          target_comment_id: commentId,
        });
        if (error) {
          Alert.alert('Error', 'No se pudo eliminar el comentario: ' + error.message);
          return;
        }
        Alert.alert("Éxito", "Comentario eliminado correctamente.");
        if (selectedUser) fetchPostsForUser(selectedUser);
      } catch (e: any) {
        Alert.alert("Error", e?.message || String(e));
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) performDelete();
      return;
    }
    Alert.alert("Confirmar Eliminación", confirmMessage, [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: performDelete },
    ]);
  };

  // ─── DELETE USER — via RPC ───
  const handleDeleteUser = (targetUserId: string) => {
    if (selectedUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      Alert.alert("Acción Denegada", "No puedes eliminar la cuenta de Administrador.");
      return;
    }

    const confirmMessage = `¿Estás seguro de que deseas eliminar por completo a @${selectedUser?.username}? Se borrarán permanentemente sus posts, comentarios y me gusta. Esta acción no se puede deshacer.`;

    const performDelete = async () => {
      try {
        const { error } = await supabase.rpc('delete_user_as_admin', {
          target_id: targetUserId,
        });
        if (error) {
          Alert.alert("Error", "No se pudo eliminar el usuario: " + error.message);
          return;
        }
        Alert.alert("Éxito", "Usuario y todos sus datos eliminados correctamente.");
        setSelectedUser(null);
        fetchAllUsers();
      } catch (err: any) {
        Alert.alert("Error", "Ocurrió un error inesperado: " + err.message);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) performDelete();
      return;
    }
    Alert.alert("Confirmar Eliminación de Usuario", confirmMessage, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar Usuario", style: "destructive", onPress: performDelete },
    ]);
  };

  if (loadingUsers) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Verificando credenciales de Admin...</Text>
      </View>
    );
  }

  if (!isAdmin) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <LucideIcons.ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Panel Super Admin</Text>
        <TouchableOpacity onPress={() => { setSelectedUser(null); fetchAllUsers(); }} style={styles.iconButton}>
          <LucideIcons.RefreshCw size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {!selectedUser ? (
        <View style={{ flex: 1 }}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Todos los usuarios registrados ({users.length})</Text>
          </View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userCard} onPress={() => fetchPostsForUser(item)}>
                <View style={styles.avatarContainer}>
                  {item.avatar_url ? (
                    <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                  ) : (
                    <LucideIcons.User size={20} color="#64748b" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileName}>{item.nombre || 'Sin nombre'} {item.apellido || ''}</Text>
                  <Text style={styles.profileUser}>@{item.username || 'usuario'}</Text>
                </View>
                <LucideIcons.ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios en la base de datos.</Text>}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.selectedUserHeader}>
            <TouchableOpacity style={styles.backToUsersBtn} onPress={() => setSelectedUser(null)}>
              <LucideIcons.ChevronLeft size={18} color="#2563eb" />
              <Text style={styles.backToUsersText}>Volver a usuarios</Text>
            </TouchableOpacity>

            <View style={[styles.userInfoRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatarLarge}>
                  {selectedUser.avatar_url ? (
                    <Image source={{ uri: selectedUser.avatar_url }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                  ) : (
                    <LucideIcons.User size={28} color="#64748b" />
                  )}
                </View>
                <View>
                  <Text style={styles.selectedName}>{selectedUser.nombre} {selectedUser.apellido}</Text>
                  <Text style={styles.selectedUsername}>@{selectedUser.username}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.deleteUserBtn} onPress={() => handleDeleteUser(selectedUser.id)}>
                <LucideIcons.UserX size={18} color="#dc2626" />
                <Text style={styles.deleteUserBtnText}>Eliminar Usuario</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loadingPosts ? (
            <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 30 }} />
          ) : (
            <FlatList
              data={userPosts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View style={styles.postCard}>
                  <View style={styles.postHeaderRow}>
                    <Text style={styles.timestamp}>ID: {item.id.substring(0, 8)}...</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(item.id)}>
                      <LucideIcons.Trash2 size={18} color="#dc2626" />
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.postContent}>{item.content}</Text>

                  {item.image_url && (
                    <Image source={{ uri: item.image_url }} style={styles.postImage} resizeMode="cover" />
                  )}

                  <View style={styles.postStatsRow}>
                    <Text style={styles.statText}>{item.likes?.length || 0} Likes</Text>
                    <Text style={styles.statText}>{item.comments?.length || 0} Comentarios</Text>
                  </View>

                  {item.comments && item.comments.length > 0 && (
                    <View style={styles.commentsContainer}>
                      <Text style={styles.commentsSectionTitle}>Comentarios:</Text>
                      {item.comments.map((comment: any) => (
                        <View key={comment.id} style={styles.adminCommentCard}>
                          <View style={styles.commentRow}>
                            <View style={styles.commentUserAndAvatar}>
                              <View style={styles.commentAvatarSmall}>
                                {comment.users?.avatar_url ? (
                                  <Image source={{ uri: comment.users.avatar_url }} style={styles.commentAvatarImg} />
                                ) : (
                                  <LucideIcons.User size={12} color="#64748b" />
                                )}
                              </View>
                              <Text style={styles.commentUsername}>
                                @{comment.users?.username || 'usuario'}:{' '}
                                <Text style={styles.commentBody}>{comment.content}</Text>
                              </Text>
                            </View>
                            <TouchableOpacity style={styles.deleteCommentBtn} onPress={() => handleDeleteComment(comment.id)}>
                              <LucideIcons.Trash2 size={14} color="#dc2626" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Este usuario no tiene publicaciones.</Text>}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  iconButton: { padding: 8 },
  sectionTitleContainer: { padding: 16, backgroundColor: '#f1f5f9' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatarContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  profileName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  profileUser: { fontSize: 14, color: '#64748b' },
  selectedUserHeader: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backToUsersBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backToUsersText: { color: '#2563eb', fontWeight: '600' },
  userInfoRow: { flexDirection: 'row', alignItems: 'center' },
  avatarLarge: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  selectedName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  selectedUsername: { fontSize: 14, color: '#64748b' },
  postCard: { backgroundColor: 'white', padding: 16, marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  postHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  timestamp: { fontSize: 12, color: '#94a3b8' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  deleteButtonText: { color: '#dc2626', fontWeight: '600', fontSize: 12, marginLeft: 4 },
  postContent: { fontSize: 15, color: '#1e293b', marginBottom: 10, lineHeight: 20 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  postStatsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  statText: { fontSize: 13, color: '#64748b', marginRight: 16 },
  deleteUserBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  deleteUserBtnText: { color: '#dc2626', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  commentsContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  commentsSectionTitle: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 6 },
  adminCommentCard: { backgroundColor: '#f8fafc', padding: 8, borderRadius: 6, marginBottom: 6 },
  commentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentUserAndAvatar: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  commentAvatarSmall: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  commentAvatarImg: { width: 20, height: 20, borderRadius: 10 },
  commentUsername: { fontSize: 12, fontWeight: '700', color: '#1e293b', flex: 1 },
  commentBody: { fontWeight: '400', color: '#475569' },
  deleteCommentBtn: { padding: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#64748b', fontSize: 15 },
});

export default SuperAdminScreen;