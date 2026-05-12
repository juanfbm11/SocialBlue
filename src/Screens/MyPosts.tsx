import React, { useEffect, useState, useCallback } from 'react';
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
  Alert
} from 'react-native';
import { Post } from '../../types';
import { supabase } from '../../lib/supabase';
import * as LucideIcons from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function MyPostsScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      setUserId(session.user.id);
      fetchProfile(session.user.id);
      fetchMyPosts(session.user.id);
    } else {
      navigation.navigate('Login');
    }
  };

  async function fetchProfile(uid: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();
    if (data) setUserProfile(data);
  }

  async function fetchMyPosts(uid: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(username, avatar_url), likes(user_id), comments(*)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data);
    setLoading(false);
  }

  const changeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (result.canceled || !userId) return;

      setUploadingAvatar(true);
      const uri = result.assets[0].uri;
      const ext = uri.split('.').pop();
      const fileName = `${userId}/avatar.${ext}`;
      
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setUserProfile({ ...userProfile, avatar_url: publicUrl });
      Alert.alert("Éxito", "Foto de perfil actualizada");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const renderPost = ({ item }: { item: any }) => {
    const likesCount = item.likes?.length || 0;
    const commentsCount = item.comments?.length || 0;

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={[styles.avatarSmall, { backgroundColor: '#e2e8f0' }]}>
            {userProfile?.avatar_url ? (
              <Image source={{ uri: userProfile.avatar_url }} style={{ width: 44, height: 44, borderRadius: 22 }} />
            ) : (
              <LucideIcons.User size={24} color="#64748b" />
            )}
          </View>
          <View>
            <Text style={styles.username}>@{userProfile?.username || 'usuario'}</Text>
            <Text style={styles.timestamp}>Publicado por ti</Text>
          </View>
        </View>
        
        <Text style={styles.postContent}>{item.content}</Text>

        {item.image_url && (
          <Image 
            source={{ uri: item.image_url }} 
            style={styles.postImage} 
            resizeMode="cover"
          />
        )}
        
        <View style={styles.postActions}>
          <View style={styles.actionItem}>
            <LucideIcons.Heart size={20} color="#64748b" />
            <Text style={styles.actionText}>{likesCount}</Text>
          </View>
          <View style={styles.actionItem}>
            <LucideIcons.MessageCircle size={20} color="#64748b" />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <LucideIcons.ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={changeAvatar} style={styles.avatarContainer}>
              <View style={styles.avatarLarge}>
                {userProfile?.avatar_url ? (
                  <Image source={{ uri: userProfile.avatar_url }} style={styles.fullAvatar} />
                ) : (
                  <LucideIcons.User size={60} color="#94a3b8" />
                )}
                <View style={styles.editBadge}>
                  <LucideIcons.Camera size={16} color="white" />
                </View>
              </View>
              {uploadingAvatar && <ActivityIndicator style={styles.loader} color="#2563eb" />}
            </TouchableOpacity>
            
            <Text style={styles.profileName}>{userProfile?.nombre} {userProfile?.apellido}</Text>
            <Text style={styles.profileUser}>@{userProfile?.username}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onRefresh={() => userId && fetchMyPosts(userId)}
        refreshing={loading && posts.length > 0}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color="#2563eb" size="large" style={{marginTop: 50}} />
          ) : (
            <Text style={styles.emptyText}>No has publicado nada aún.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  iconButton: { padding: 8 },
  profileHeader: { alignItems: 'center', backgroundColor: 'white', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginBottom: 8 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarLarge: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'white', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  fullAvatar: { width: '100%', height: '100%', borderRadius: 60 },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#2563eb', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  loader: { position: 'absolute', top: 40, left: 40 },
  profileName: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
  profileUser: { fontSize: 16, color: '#64748b', marginTop: 4 },
  statsContainer: { flexDirection: 'row', marginTop: 24 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  postCard: { backgroundColor: 'white', padding: 20, marginVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarSmall: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  username: { fontWeight: '700', fontSize: 16, color: '#1e293b' },
  timestamp: { fontSize: 12, color: '#64748b' },
  postContent: { fontSize: 16, color: '#1e293b', lineHeight: 24, marginBottom: 16 },
  postImage: { width: '100%', height: 300, borderRadius: 12, marginBottom: 16 },
  postActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f8fafc', paddingTop: 16 },
  actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 32 },
  actionText: { marginLeft: 6, color: '#64748b', fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#64748b', fontSize: 16 },
});
