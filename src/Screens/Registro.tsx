import React, { useState } from "react";
import {
  StyleSheet, Text, View, TextInput, Pressable,
  ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function UsuariosFormScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [fecha] = useState(new Date());
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({
    username: "", nombre: "", apellido: "", email: "",
    contrasena: "", confirmarContrasena: ""
  });

  const soloLetras = /^[a-zA-ZÁÉÍÓÚñÑ\s]+$/;
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const validate = () => {
    let valid = true;
    const newErrors = {
      username: "", nombre: "", apellido: "", email: "",
      contrasena: "", confirmarContrasena: ""
    };

    if (!username.trim()) {
      newErrors.username = "El usuario es requerido";
      valid = false;
    }
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
      valid = false;
    } else if (!soloLetras.test(nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras";
      valid = false;
    }
    if (!apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
      valid = false;
    } else if (!soloLetras.test(apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras";
      valid = false;
    }
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El email no es válido";
      valid = false;
    }
    if (!contrasena.trim()) {
      newErrors.contrasena = "La contraseña es requerida";
      valid = false;
    } else if (contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }
    if (!confirmarContrasena.trim()) {
      newErrors.confirmarContrasena = "Debes confirmar tu contraseña";
      valid = false;
    } else if (contrasena !== confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleGuardar = async () => {
  if (!validate()) return;

  setSaving(true);

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { username, nombre, apellido, email, contrasena }
      ]);

    if (error) {
      console.log("Supabase error:", error);
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Éxito", "Usuario registrado correctamente");
    handleLimpiar();

  } catch (err: any) {
    console.log("Catch error:", err);
    Alert.alert("Error", err.message || "Error inesperado");
  } finally {
    setSaving(false);
  }
};

  const handleLimpiar = () => {
    setUsername(""); setNombre(""); setApellido(""); setEmail("");
    setContrasena(""); setConfirmarContrasena("");
    setErrors({ username: "", nombre: "", apellido: "", email: "", contrasena: "", confirmarContrasena: "" });
    navigation.navigate("Login");
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Nuevo usuario</Text>
        <Text style={styles.headerSub}>Ingresa tus datos para registrarte</Text>
      </View>

      <View style={styles.card}>

        {/* Username */}
        <Field label="Usuario">
          <TextInput
            value={username}
            onChangeText={(text) => { setUsername(text); if (errors.username) setErrors((p) => ({ ...p, username: "" })); }}
            style={[styles.input, errors.username ? styles.inputError : null]}
            autoCapitalize="none"
          />
        </Field>
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

        {/* Nombre */}
        <Field label="Nombre">
          <TextInput
            value={nombre}
            onChangeText={(text) => { setNombre(text); if (errors.nombre) setErrors((p) => ({ ...p, nombre: "" })); }}
            style={[styles.input, errors.nombre ? styles.inputError : null]}
          />
        </Field>
        {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}

        {/* Apellido */}
        <Field label="Apellido">
          <TextInput
            value={apellido}
            onChangeText={(text) => { setApellido(text); if (errors.apellido) setErrors((p) => ({ ...p, apellido: "" })); }}
            style={[styles.input, errors.apellido ? styles.inputError : null]}
          />
        </Field>
        {errors.apellido ? <Text style={styles.errorText}>{errors.apellido}</Text> : null}

        {/* Email */}
        <Field label="Email">
          <TextInput
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={(text) => { setEmail(text); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
            style={[styles.input, errors.email ? styles.inputError : null]}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </Field>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Contraseña */}
        <Field label="Contraseña">
          <TextInput
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#aaa"
            value={contrasena}
            onChangeText={(text) => { setContrasena(text); if (errors.contrasena) setErrors((p) => ({ ...p, contrasena: "" })); }}
            style={[styles.input, errors.contrasena ? styles.inputError : null]}
            secureTextEntry
          />
        </Field>
        {errors.contrasena ? <Text style={styles.errorText}>{errors.contrasena}</Text> : null}

        {/* Confirmar Contraseña */}
        <Field label="Confirmar contraseña">
          <TextInput
            placeholder="Repite tu contraseña"
            placeholderTextColor="#aaa"
            value={confirmarContrasena}
            onChangeText={(text) => { setConfirmarContrasena(text); if (errors.confirmarContrasena) setErrors((p) => ({ ...p, confirmarContrasena: "" })); }}
            style={[styles.input, errors.confirmarContrasena ? styles.inputError : null]}
            secureTextEntry
          />
        </Field>
        {errors.confirmarContrasena ? <Text style={styles.errorText}>{errors.confirmarContrasena}</Text> : null}

        {/* Fecha */}
        <Field label="Fecha de registro">
          <TouchableOpacity style={styles.fechaBtn}>
            <Text style={styles.fechaTexto}>{fechaFormateada}</Text>
          </TouchableOpacity>
        </Field>

      </View>

      <View style={styles.footer}>
        <Pressable style={styles.btnCancelar} onPress={handleLimpiar}>
          <Text style={styles.btnCancelarTexto}>Cancelar</Text>
        </Pressable>
        <Pressable style={[styles.btnGuardar, saving && { opacity: 0.6 }]} onPress={handleGuardar} disabled={saving}>
          <Text style={styles.btnGuardarTexto}>{saving ? "Guardando..." : "Registrarse"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const AMBER = "#b37d08";

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f5f5f5", flexGrow: 1 },
  header: { backgroundColor: AMBER, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 18 },
  headerTitulo: { fontSize: 22, fontWeight: "bold", color: "#412402" },
  headerSub: { fontSize: 13, color: "#633806", marginTop: 2 },
  card: { backgroundColor: "#fff", margin: 16, borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: "#ddd" },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  input: { borderWidth: 0.5, borderColor: "#d7bf66", borderRadius: 8, paddingVertical: 9, paddingHorizontal: 12, fontSize: 14, color: "#1a1a1a", backgroundColor: "#fafafa" },
  inputError: { borderColor: "#e74c3c", borderWidth: 1.5 },
  errorText: { color: "#bc3324", fontSize: 11, marginTop: 2, marginLeft: 4, marginBottom: 6 },
  fechaBtn: { borderWidth: 0.5, borderColor: "#ccc", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "#f5f5f5" },
  fechaTexto: { fontSize: 14, color: "#333", textTransform: "capitalize" },
  footer: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 32 },
  btnCancelar: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 0.5, borderColor: "#ccc", alignItems: "center" },
  btnCancelarTexto: { fontSize: 14, color: "#666" },
  btnGuardar: { flex: 2, paddingVertical: 12, borderRadius: 8, backgroundColor: AMBER, alignItems: "center" },
  btnGuardarTexto: { fontSize: 14, fontWeight: "600", color: "#412402" },
});