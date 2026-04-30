import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Post } from '../../types';
import { supabase } from '../../lib/supabase';


export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  // 1. CAMBIA ESTO: Pon un ID real de un usuario que ya tengas en tu tabla 'users'
  const MOCK_USER_ID = 'TU_UUID_AQUI'; 

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(username)')
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data as any);
    setLoading(false);
  }

  async function handleCreatePost() {
    if (!newPost.trim()) return;
    const { error } = await supabase
      .from('posts')
      .insert([{ content: newPost, user_id: MOCK_USER_ID }]);
    
    if (!error) {
      setNewPost('');
      fetchPosts();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SocialBlue</Text>

      <View style={styles.inputBox}>
        <TextInput 
          style={styles.input}
          placeholder="¿Qué está pasando?"
          value={newPost}
          onChangeText={setNewPost}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.postBtn} onPress={handleCreatePost}>
          <Text style={styles.postBtnText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#007AFF" size="large" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.user}>@{item.users?.username || 'usuario'}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <View style={styles.footer}>
                <TouchableOpacity><Text style={styles.actionText}>💙 Like</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.actionText}>💬 Comentar</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingTop: 60 },
  logo: { fontSize: 26, fontWeight: '900', color: '#007AFF', paddingHorizontal: 20, marginBottom: 15 },
  inputBox: { backgroundColor: '#FFF', padding: 15, marginHorizontal: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 2 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  postBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  postBtnText: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 18, marginHorizontal: 15, marginVertical: 8, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  user: { fontWeight: 'bold', color: '#007AFF', marginBottom: 5 },
  content: { fontSize: 16, color: '#444', lineHeight: 22 },
  footer: { flexDirection: 'row', marginTop: 15, borderTopWidth: 0.5, borderColor: '#EEE', paddingTop: 10, gap: 20 },
  actionText: { color: '#666', fontWeight: '600' }
});