import { Pressable, Text, View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

function CustomButton({ title, onPress, color = "#b34332", outline = false }: any) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.boton,
        outline
          ? { backgroundColor: "transparent", borderWidth: 2, borderColor: color }
          : { backgroundColor: color },
        pressed ? styles.botonPresionado : null,
      ]}
    >
      <Text style={[styles.botonTexto, outline ? { color: color } : { color: "#ffffff" }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El email no es válido";
      valid = false;
    }

    if (!contrasena.trim()) {
      newErrors.password = "La contraseña es requerida";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validate()) {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Iniciar Sesión</Text>
        <Text style={styles.subtitulo}>Bienvenido</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Ingresa tu email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          style={[styles.input, errors.email ? styles.inputError : null]}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Password */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#aaa"
          value={contrasena}
          onChangeText={(text) => {
            setContrasena(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
          }}
          style={[styles.input, errors.password ? styles.inputError : null]}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {/* Botones */}
        <CustomButton title="Iniciar Sesión" color="rgb(213, 132, 26)" onPress={handleLogin} />
        <CustomButton
          title="Registrarse"
          color="#1a17d3"
          outline={true}
          onPress={() => navigation.navigate("Registro")}
        />

        <Text style={styles.olvide}>¿Olvidaste tu contraseña?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "rgba(226,223,218,0.76)", width: "100%", maxWidth: 380, borderRadius: 16, padding: 24 },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitulo: { fontSize: 14, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  label: { fontSize: 13, marginBottom: 6, marginLeft: 2 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingVertical: 11, paddingHorizontal: 14, fontSize: 15, marginBottom: 4 },
  inputError: { borderColor: "#e24b4a", borderWidth: 1.5 },
  errorText: { fontSize: 12, color: "#e24b4a", marginBottom: 12, marginLeft: 2 },
  boton: { paddingVertical: 13, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  botonPresionado: { opacity: 0.75, transform: [{ scale: 0.95 }] },
  botonTexto: { fontSize: 15, fontWeight: "600" },
  olvide: { textAlign: "center", fontSize: 13, color: "#aaa", marginTop: 8 },
});
