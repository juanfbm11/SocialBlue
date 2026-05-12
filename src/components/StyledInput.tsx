import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../theme';
import * as LucideIcons from 'lucide-react-native';

interface StyledInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof LucideIcons;
  error?: string;
  className?: string; // Support NativeWind
}

export default function StyledInput({ label, icon, error, className, ...props }: StyledInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = icon ? (LucideIcons as any)[icon] : null;

  return (
    <View style={styles.container} className={className}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error ? styles.inputWrapperError : null
      ]}>
        {IconComponent && (
          <IconComponent 
            size={20} 
            color={error ? theme.colors.error : (isFocused ? theme.colors.primary : theme.colors.textLight)} 
            style={styles.icon} 
          />
        )}
        <TextInput
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textLight}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b', // slate-800
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
