import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Users, PlayCircle } from 'lucide-react-native';
import Colors from '../constants/Colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Trophy size={64} color={Colors.accent} />
          <Text style={styles.title}>Nossa Arena</Text>
          <Text style={styles.subtitle}>Liga de Beach Tennis</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/organize')}
          >
            <PlayCircle color={Colors.white} size={24} />
            <Text style={styles.primaryButtonText}>Organizar Torneio</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/join')}
          >
            <Users color={Colors.primary} size={24} />
            <Text style={styles.secondaryButtonText}>Acompanhar Jogos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.rankingLink}
          onPress={() => router.push('/athletes')}
        >
          <Text style={styles.rankingText}>Gerenciar Atletas (Reis e Rainhas)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.rankingLink}
          onPress={() => router.push('/ranking')}
        >
          <Text style={styles.rankingText}>Ver Ranking Geral da Liga</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.primary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  rankingLink: {
    marginTop: 48,
    padding: 12,
  },
  rankingText: {
    color: Colors.secondary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
