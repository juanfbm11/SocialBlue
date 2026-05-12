import React, { useState } from "react";
import { 
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import StyledInput from "../components/StyledInput";
import GradientButton from "../components/GradientButton";
import BrandHeader from "../components/BrandHeader";
import GlassCard from "../components/GlassCard";

const BG_IMAGE = require('../../assets/bg.png');

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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

  const handleLogin = async () => {
    if (validate()) {
      setAuthLoading(true);
      setAuthError('');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: contrasena,
        });
        
        setAuthLoading(false);
        
        if (error) {
          setAuthError(error.message);
        } else {
          navigation.navigate("Home");
        }
      } catch (e: any) {
        setAuthLoading(false);
        setAuthError(e.message || "Error al iniciar sesión");
      }
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
                  padding: 24 
                }}
                showsVerticalScrollIndicator={false}
              >
                <View className="w-full max-w-[420px] items-center">
                  <BrandHeader />
                  <View className="w-full -mt-6">
                    <GlassCard className="w-full bg-white/85">
                      <Text className="text-xl font-bold text-slate-900 mb-8 text-center tracking-tight">
                        Accede a tu cuenta
                      </Text>
                      <StyledInput
                        label="Email"
                        placeholder="tu@email.com"
                        icon="Mail"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        error={errors.email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                      <StyledInput
                        label="Contraseña"
                        placeholder="••••••••"
                        icon="Lock"
                        value={contrasena}
                        onChangeText={(text) => {
                          setContrasena(text);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        error={errors.password}
                        secureTextEntry
                      />
                      <TouchableOpacity className="self-end mb-6">
                        <Text className="text-blue-700 font-bold">¿Olvidaste tu contraseña?</Text>
                      </TouchableOpacity>
                      <View className="w-full mt-2">
                        <GradientButton 
                          title="Iniciar Sesión" 
                          onPress={handleLogin} 
                        />
                        {authLoading && (
                          <ActivityIndicator size="small" color="#2563eb" style={{ marginTop: 15 }} />
                        )}
                        {authError ? (
                          <Text style={{ color: '#ef4444', textAlign: 'center', marginTop: 15, fontSize: 14 }}>
                            {authError}
                          </Text>
                        ) : null}
                        <View className="flex-row items-center justify-center mt-10">
                          <Text className="text-slate-600 font-medium">¿No tienes cuenta? </Text>
                          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                            <Text className="text-blue-700 font-bold">Regístrate gratis</Text>
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
