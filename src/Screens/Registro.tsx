import React, { useState } from "react";
import {
  Text, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassCard from "../components/GlassCard";
import StyledInput from "../components/StyledInput";
import GradientButton from "../components/GradientButton";
import BrandHeader from "../components/BrandHeader";
import { supabase } from "../../lib/supabase";

const BG_IMAGE = require('../../assets/bg.png');

export default function Registro({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({
    username: "", nombre: "", apellido: "", email: "",
    contrasena: "", confirmarContrasena: ""
  });

  const soloLetras = /^[a-zA-ZÁÉÍÓÚñÑ\s]+$/;

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
      newErrors.nombre = "Solo letras";
      valid = false;
    }
    if (!apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
      valid = false;
    } else if (!soloLetras.test(apellido)) {
      newErrors.apellido = "Solo letras";
      valid = false;
    }
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email no válido";
      valid = false;
    }
    if (!contrasena.trim()) {
      newErrors.contrasena = "Requerida";
      valid = false;
    } else if (contrasena.length < 6) {
      newErrors.contrasena = "Mínimo 6 caracteres";
      valid = false;
    }
    if (contrasena !== confirmarContrasena) {
      newErrors.confirmarContrasena = "No coinciden";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleGuardar = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: contrasena,
        options: {
          data: {
            username,
            nombre,
            apellido,
          }
        }
      });

      if (authError) {
        Alert.alert("Error de autenticación", authError.message);
        return;
      }

      const { error: dbError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user?.id, 
          username, 
          nombre, 
          apellido, 
          email 
        }]);

      if (dbError) {
        console.error("Error creating profile:", dbError.message);
      }

      Alert.alert("Éxito", "Usuario registrado correctamente.");
      navigation.navigate("Login");

    } catch (err: any) {
      Alert.alert("Error", err.message || "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1e3a8a' }}>
      <ImageBackground
        source={BG_IMAGE}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.5)' }}>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView 
                contentContainerStyle={{ 
                  flexGrow: 1, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  paddingHorizontal: 24, 
                  paddingVertical: 60 
                }}
                showsVerticalScrollIndicator={false}
              >
                <View className="w-full max-w-[520px] items-center">
                  <BrandHeader />
                  <View className="w-full -mt-6">
                    <GlassCard className="w-full bg-white/85">
                      <Text className="text-xl font-bold text-slate-900 mb-8 text-center tracking-tight">
                        Crea tu cuenta
                      </Text>
                      <View className="flex-row">
                        <View className="flex-1">
                          <StyledInput
                            label="Nombre"
                            placeholder="Juan"
                            value={nombre}
                            onChangeText={(t) => { setNombre(t); if (errors.nombre) setErrors(p => ({...p, nombre: ""})); }}
                            error={errors.nombre}
                          />
                        </View>
                        <View className="flex-1 ml-4">
                          <StyledInput
                            label="Apellido"
                            placeholder="Pérez"
                            value={apellido}
                            onChangeText={(t) => { setApellido(t); if (errors.apellido) setErrors(p => ({...p, apellido: ""})); }}
                            error={errors.apellido}
                          />
                        </View>
                      </View>
                      <StyledInput
                        label="Usuario"
                        placeholder="@usuario"
                        icon="User"
                        value={username}
                        onChangeText={(t) => { setUsername(t); if (errors.username) setErrors(p => ({...p, username: ""})); }}
                        error={errors.username}
                        autoCapitalize="none"
                      />
                      <StyledInput
                        label="Email"
                        placeholder="correo@ejemplo.com"
                        icon="Mail"
                        value={email}
                        onChangeText={(t) => { setEmail(t); if (errors.email) setErrors(p => ({...p, email: ""})); }}
                        error={errors.email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                      <StyledInput
                        label="Contraseña"
                        placeholder="••••••••"
                        icon="Lock"
                        value={contrasena}
                        onChangeText={(t) => { setContrasena(t); if (errors.contrasena) setErrors(p => ({...p, contrasena: ""})); }}
                        error={errors.contrasena}
                        secureTextEntry
                      />
                      <StyledInput
                        label="Confirmar"
                        placeholder="••••••••"
                        icon="ShieldCheck"
                        value={confirmarContrasena}
                        onChangeText={(t) => { setConfirmarContrasena(t); if (errors.confirmarContrasena) setErrors(p => ({...p, confirmarContrasena: ""})); }}
                        error={errors.confirmarContrasena}
                        secureTextEntry
                      />
                      <View className="mt-4">
                        <GradientButton 
                          title="Registrarse" 
                          onPress={handleGuardar} 
                          loading={saving}
                        />
                        <View className="flex-row items-center justify-center mt-8">
                          <Text className="text-slate-600 font-medium">¿Ya tienes cuenta? </Text>
                          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="text-blue-700 font-bold">Inicia sesión</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </GlassCard>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}