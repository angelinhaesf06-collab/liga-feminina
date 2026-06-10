import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, UserPlus, CheckCircle2 } from 'lucide-react-native';
import Colors from '../constants/Colors';

const PLAYER_OPTIONS = [8, 10, 12, 16, 24];
const ROUND_OPTIONS = [4, 6];

export default function OrganizeScreen() {
  const [playerCount, setPlayerCount] = useState(12);
  const [rounds, setRounds] = useState(4);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Quantidade de Jogadoras</Text>
          <View style={styles.optionsGrid}>
            {PLAYER_OPTIONS.map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.optionCard, playerCount === count && styles.optionCardActive]}
                onPress={() => setPlayerCount(count)}
              >
                <Text style={[styles.optionText, playerCount === count && styles.optionTextActive]}>
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Número de Rodadas</Text>
          <View style={styles.optionsGrid}>
            {ROUND_OPTIONS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.optionCard, rounds === r && styles.optionCardActive]}
                onPress={() => setRounds(r)}
              >
                <Text style={[styles.optionText, rounds === r && styles.optionTextActive]}>
                  {r} Rodadas
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>3. Selecionar Jogadoras</Text>
            <TouchableOpacity style={styles.addButton}>
              <UserPlus size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Nova</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.playerListPlaceholder}>
            <Text style={styles.placeholderText}>
              Lista de jogadoras cadastradas aparecerá aqui...
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.generateButton}
          onPress={() => router.push('/tournament')}
        >
          <CheckCircle2 color={Colors.white} size={24} />
          <Text style={styles.generateButtonText}>Gerar Torneio e PIN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F7EFE6', // Versão muito clara do caramelo
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  optionTextActive: {
    color: Colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  playerListPlaceholder: {
    backgroundColor: Colors.white,
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.secondary,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    marginTop: 16,
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
