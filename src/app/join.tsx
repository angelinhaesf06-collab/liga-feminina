import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Hash } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { tournamentService } from '../services/tournamentService';

export default function JoinScreen() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (pin.length >= 4) {
      setLoading(true);
      try {
        const tournament = await tournamentService.getTournamentByPin(pin);
        router.push({
          pathname: '/tournament',
          params: { id: tournament.id }
        });
      } catch (error) {
        Alert.alert('Erro', 'PIN não encontrado ou torneio finalizado.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Hash size={48} color={Colors.primary} />
          <Text style={styles.title}>Acompanhar Torneio</Text>
          <Text style={styles.subtitle}>Insira o PIN do dia para ver as rodadas e o ranking em tempo real.</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0000"
            placeholderTextColor={Colors.border}
            keyboardType="number-pad"
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />
          
          <TouchableOpacity 
            style={[styles.button, (pin.length < 4 || loading) && styles.buttonDisabled]}
            onPress={handleJoin}
            disabled={pin.length < 4 || loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Entrar na Sala</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  inputContainer: {
    gap: 24,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
