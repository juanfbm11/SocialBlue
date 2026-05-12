import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as LucideIcons from 'lucide-react-native';

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LucideIcons.Globe color="white" size={48} strokeWidth={2} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.brandMain}>Social</Text>
        <Text style={styles.brandAccent}>Blue</Text>
      </View>
      <View style={styles.underline} />
      <Text style={styles.tagline}>
        Conecta con el mundo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    itemsCenter: 'center',
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMain: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -1,
  },
  brandAccent: {
    fontSize: 48,
    fontWeight: '900',
    color: '#60a5fa', // blue-400
    letterSpacing: -1,
  },
  underline: {
    height: 6,
    width: 64,
    backgroundColor: '#60a5fa',
    borderRadius: 3,
    marginTop: 12,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(219, 234, 254, 0.8)', // blue-100/80
    marginTop: 16,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
