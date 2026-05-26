import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import * as LucideIcons from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const PostInput = memo(
  ({
    newPost,
    setNewPost,
    selectedImage,
    setSelectedImage,
    pickImage,
    handleCreatePost,
    uploading,
    userAvatar,
  }: any) => {
    return (
      <View style={styles.inputArea}>
        <View style={styles.inputRow}>
          <View
            style={[
              styles.avatar,
              {
                width: 36,
                height: 36,
                backgroundColor: "#e2e8f0",
              },
            ]}>
            {userAvatar ? (
              <Image
                source={{ uri: userAvatar }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
            ) : (
              <LucideIcons.User size={20} color="#64748b" />
            )}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="¿Qué estás pensando?"
            value={newPost}
            onChangeText={setNewPost}
            multiline
            blurOnSubmit={false}
          />
        </View>

        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />

            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => setSelectedImage(null)}>
              <LucideIcons.X size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputFooter}>
          <View style={styles.footerIcons}>
            <TouchableOpacity style={styles.footerIcon} onPress={pickImage}>
              <LucideIcons.Image size={24} color="#2563eb" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.publishButton,
              !newPost.trim() &&
                !selectedImage && {
                  opacity: 0.5,
                },
            ]}
            onPress={handleCreatePost}
            disabled={(!newPost.trim() && !selectedImage) || uploading}>
            {uploading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.publishButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const PostCard = memo(
  ({
    item,
    userId,
    onLike,
    onComment,
    onToggleComments,
    isCommentsVisible,
    onPressUser,
  }: any) => {
    const likesCount = item.likes?.length || 0;
    const commentsCount = item.comments?.length || 0;

    const userHasLiked = item.likes?.some(
      (like: any) => like.user_id === userId,
    );

    const avatarUrl = item.users?.avatar_url;

    return (
      <View style={styles.postCard}>
        {/* HEADER */}
        <TouchableOpacity
          style={styles.postHeader}
          onPress={() => onPressUser(item.user_id)}
          activeOpacity={0.7}>
          <View style={[styles.avatar, { backgroundColor: "#e2e8f0" }]}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />
            ) : (
              <LucideIcons.User size={24} color="#64748b" />
            )}
          </View>

          <View>
            <Text style={styles.username}>
              @{item.users?.username || "usuario"}
            </Text>

            <Text style={styles.timestamp}>Publicado hace poco</Text>
          </View>
        </TouchableOpacity>

        {/* CONTENIDO */}
        <Text style={styles.postContent}>{item.content}</Text>

        {/* IMAGEN */}
        {item.image_url && (
          <Image
            source={{ uri: item.image_url }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        {/* ACCIONES */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onLike(item.id, userHasLiked)}>
            <LucideIcons.Heart
              size={20}
              color={userHasLiked ? "#ef4444" : "#64748b"}
              fill={userHasLiked ? "#ef4444" : "transparent"}
            />

            <Text
              style={[
                styles.actionText,
                userHasLiked && {
                  color: "#ef4444",
                },
              ]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onComment(item.id)}>
            <LucideIcons.MessageCircle size={20} color="#64748b" />

            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onToggleComments(item.id)}>
            <Text style={styles.viewCommentsText}>
              {isCommentsVisible ? "Ocultar" : "Ver comentarios"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* COMENTARIOS */}
        {isCommentsVisible &&
          item.comments?.map((comment: any) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentRow}>
                <View
                  style={[
                    styles.commentAvatar,
                    {
                      backgroundColor: "#e2e8f0",
                    },
                  ]}>
                  {comment.users?.avatar_url ? (
                    <Image
                      source={{
                        uri: comment.users.avatar_url,
                      }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                      }}
                    />
                  ) : (
                    <LucideIcons.User size={14} color="#64748b" />
                  )}
                </View>

                <TouchableOpacity onPress={() => onPressUser(comment.user_id)}>
                  <Text style={styles.commentUser}>
                    @{comment.users?.username}:{" "}
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    );
  },
);

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const [commentText, setCommentText] = useState("");

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [visibleComments, setVisibleComments] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      setUserId(session.user.id);

      const { data } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setUserAvatar(data.avatar_url);
      }

      if (session.user.email?.toLowerCase() === "admin@gmail.com") {
        setIsSuperAdmin(true);
      }
    }
  };

  const fetchPosts = async () => {
    if (!refreshing) {
      setLoading(true);
    }

    const { data } = await supabase
      .from("posts")
      .select(
        `
        *,
        users(username, avatar_url),
        likes(user_id),
        comments(
          *,
          users(username, avatar_url)
        )
      `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setPosts(data);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

  const handleCreatePost = useCallback(async () => {
    if (!newPost.trim() && !selectedImage) return;

    if (!userId) return;

    Keyboard.dismiss();

    setUploading(true);

    let imageUrl = null;

    if (selectedImage) {
      try {
        const ext = selectedImage.split(".").pop();

        const fileName = `${userId}/posts/${Date.now()}.${ext}`;

        const response = await fetch(selectedImage);

        const blob = await response.blob();

        await supabase.storage.from("post-images").upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

        imageUrl = supabase.storage.from("post-images").getPublicUrl(fileName)
          .data.publicUrl;
      } catch (e) {
        Alert.alert("Error al subir imagen");
      }
    }

    const { error } = await supabase.from("posts").insert([
      {
        content: newPost,
        user_id: userId,
        image_url: imageUrl,
      },
    ]);

    setUploading(false);

    if (!error) {
      setNewPost("");
      setSelectedImage(null);
      fetchPosts();
    }
  }, [newPost, selectedImage, userId]);

  const handleLike = useCallback(
    async (postId: string, userHasLiked: boolean) => {
      if (!userId) return;

      if (userHasLiked) {
        await supabase.from("likes").delete().match({
          post_id: postId,
          user_id: userId,
        });
      } else {
        await supabase.from("likes").insert([
          {
            post_id: postId,
            user_id: userId,
          },
        ]);
      }

      fetchPosts();
    },
    [userId],
  );

  const openCommentModal = useCallback(
    (postId: string) => {
      if (!userId) return;

      setSelectedPostId(postId);
      setCommentModalVisible(true);
    },
    [userId],
  );

  const submitComment = useCallback(async () => {
    if (!commentText.trim() || !selectedPostId || !userId) return;

    const { error } = await supabase.from("comments").insert([
      {
        post_id: selectedPostId,
        user_id: userId,
        content: commentText,
      },
    ]);

    if (!error) {
      setCommentText("");
      setCommentModalVisible(false);

      Keyboard.dismiss();

      fetchPosts();
    }
  }, [commentText, selectedPostId, userId]);

  const toggleComments = useCallback((postId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const handlePressUser = (profileUserId: string) => {
    navigation.navigate("UserProfile", {
      userId: profileUserId,
    });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Social
          <Text style={{ color: "#2563eb" }}>Blue</Text>
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("MyPosts")}>
            <LucideIcons.User size={24} color="#1e293b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <LucideIcons.LogOut size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ADMIN */}
      {isSuperAdmin && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate("SuperAdmin")}>
          <LucideIcons.ShieldCheck size={20} color="white" />

          <Text style={styles.adminButtonText}>Ir a Panel Super Admin</Text>
        </TouchableOpacity>
      )}

      {/* INPUT */}
      <PostInput
        newPost={newPost}
        setNewPost={setNewPost}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        pickImage={pickImage}
        handleCreatePost={handleCreatePost}
        uploading={uploading}
        userAvatar={userAvatar}
      />

      {/* POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            userId={userId}
            onLike={handleLike}
            onComment={openCommentModal}
            onToggleComments={toggleComments}
            isCommentsVisible={visibleComments[item.id]}
            onPressUser={handlePressUser}
          />
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* MODAL */}
      <Modal visible={commentModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comentar</Text>

              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <LucideIcons.X size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Escribe algo..."
              multiline
              value={commentText}
              onChangeText={setCommentText}
              autoFocus
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitComment}>
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  headerRight: {
    flexDirection: "row",
  },

  logo: {
    fontSize: 22,
    fontWeight: "900",
  },

  iconButton: {
    marginLeft: 15,
  },

  inputArea: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  inputRow: {
    flexDirection: "row",
  },

  textInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },

  previewContainer: {
    marginTop: 15,
    position: "relative",
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },

  removeImage: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },

  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
  },

  footerIcons: {
    flexDirection: "row",
  },

  footerIcon: {
    marginRight: 20,
  },

  publishButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  publishButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  postCard: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  username: {
    fontWeight: "bold",
    fontSize: 16,
  },

  timestamp: {
    fontSize: 12,
    color: "#64748b",
  },

  postContent: {
    fontSize: 16,
    marginBottom: 15,
  },

  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 15,
  },

  postActions: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 15,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },

  actionText: {
    marginLeft: 6,
    fontWeight: "600",
    color: "#64748b",
  },

  viewCommentsText: {
    color: "#2563eb",
    fontWeight: "600",
  },

  commentItem: {
    marginTop: 10,
    paddingLeft: 10,
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
  },

  commentContent: {
    fontWeight: "normal",
    color: "#475569",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  commentInput: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 15,
  },

  submitButton: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#2563eb",
  },

  adminButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
