import React, { useEffect, useState } from "react";
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
} from "react-native";
import { supabase } from "../../lib/supabase";
import * as LucideIcons from "lucide-react-native";

export default function UserProfile({ route, navigation }: any) {
  const { userId: profileUserId } = route.params;

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setCurrentUserId(session.user.id);
    });

    fetchProfile();
    fetchPosts();
  }, [profileUserId]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", profileUserId)
      .single();
    if (data) setProfile(data);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*, likes(user_id), comments(*)")
      .eq("user_id", profileUserId)
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const isOwnProfile = currentUserId === profileUserId;

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <Text style={styles.postContent}>{item.content}</Text>

      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.postStats}>
        <View style={styles.statRow}>
          <LucideIcons.Heart size={16} color="#64748b" />
          <Text style={styles.statText}>{item.likes?.length || 0}</Text>
        </View>
        <View style={styles.statRow}>
          <LucideIcons.MessageCircle size={16} color="#64748b" />
          <Text style={styles.statText}>{item.comments?.length || 0}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <LucideIcons.ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isOwnProfile ? "Mi Perfil" : "Perfil"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        onRefresh={fetchPosts}
        refreshing={loading && posts.length > 0}
        ListHeaderComponent={
          <View style={styles.profileHeader}>
            {/* AVATAR */}
            <View style={styles.avatarLarge}>
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.fullAvatar}
                />
              ) : (
                <LucideIcons.User size={60} color="#94a3b8" />
              )}
            </View>

            {/* NOMBRE Y USUARIO */}
            <Text style={styles.profileName}>
              {profile?.nombre} {profile?.apellido}
            </Text>
            <Text style={styles.profileUser}>@{profile?.username}</Text>

            {isOwnProfile && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("MyPosts")}>
                <LucideIcons.Pencil size={16} color="#2563eb" />
                <Text style={styles.editButtonText}>Editar perfil</Text>
              </TouchableOpacity>
            )}

            {/* STATS */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              color="#2563eb"
              size="large"
              style={{ marginTop: 50 }}
            />
          ) : (
            <Text style={styles.emptyText}>
              Este usuario no ha publicado nada aún.
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  iconButton: { padding: 8 },

  profileHeader: {
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 8,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 16,
  },
  fullAvatar: { width: "100%", height: "100%", borderRadius: 60 },
  profileName: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
  profileUser: { fontSize: 16, color: "#64748b", marginTop: 4 },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#2563eb",
  },
  editButtonText: { color: "#2563eb", fontWeight: "600", marginLeft: 6 },

  statsContainer: { flexDirection: "row", marginTop: 24 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },

  postCard: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  postContent: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 24,
    marginBottom: 12,
  },
  postImage: { width: "100%", height: 280, borderRadius: 12, marginBottom: 12 },
  postStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
    paddingTop: 12,
  },
  statRow: { flexDirection: "row", alignItems: "center", marginRight: 24 },
  statText: {
    marginLeft: 6,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
    fontSize: 16,
  },
});
