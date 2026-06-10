import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, CheckCircle2, User } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { playerService } from '../services/playerService';
import { tournamentService } from '../services/tournamentService';

const PLAYER_OPTIONS = [8, 10, 12, 16, 24];
const ROUND_OPTIONS = [4, 6];

export default function OrganizeScreen() {
  const [playerCount, setPlayerCount] = useState(8);
  const [rounds, setRounds] = useState(4);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    try {
      const data = await playerService.getAll();
      setAvailablePlayers(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as jogadoras.');
    } finally {
      setLoading(false);
    }
  }

  const togglePlayer = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== id));
    } else {
      if (selectedPlayers.length < playerCount) {
        setSelectedPlayers([...selectedPlayers, id]);
      } else {
        Alert.alert('Limite atingido', `Você selecionou o limite de ${playerCount} jogadoras.`);
      }
    }
  };

  const handleGenerateTournament = async () => {
    if (selectedPlayers.length !== playerCount) {
      Alert.alert('Atenção', `Selecione exatamente ${playerCount} jogadoras.`);
      return;
    }

    setCreating(true);
    try {
      const { tournament, pin } = await tournamentService.createTournament(selectedPlayers, rounds);
      Alert.alert('Sucesso', `Torneio criado! PIN do Dia: ${pin}`, [
        { text: 'OK', onPress: () => router.push('/tournament') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar torneio no banco de dados.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Quantidade de Atletas</Text>
          <View style={styles.optionsGrid}>
            {PLAYER_OPTIONS.map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.optionCard, playerCount === count && styles.optionCardActive]}
                onPress={() => {
                  setPlayerCount(count);
                  setSelectedPlayers([]); // Reseta seleção ao mudar número
                }}
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
            <Text style={styles.sectionTitle}>
              3. Selecionar ({selectedPlayers.length}/{playerCount})
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <UserPlus size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Novo</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <View style={styles.playerList}>
              {availablePlayers.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.playerCard,
                    selectedPlayers.includes(player.id) && styles.playerCardActive
                  ]}
                  onPress={() => togglePlayer(player.id)}
                >
                  <User size={18} color={selectedPlayers.includes(player.id) ? Colors.primary : Colors.secondary} />
                  <Text style={[
                    styles.playerName,
                    selectedPlayers.includes(player.id) && styles.playerNameActive
                  ]}>
                    {player.nome}
                  </Text>
                </TouchableOpacity>
              ))}
              {availablePlayers.length === 0 && (
                <Text style={styles.emptyText}>Nenhum(a) atleta cadastrado(a).</Text>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.generateButton, creating && { opacity: 0.7 }]}
          onPress={handleGenerateTournament}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <CheckCircle2 color={Colors.white} size={24} />
              <Text style={styles.generateButtonText}>Gerar Torneio e PIN</Text>
            </>
          )}
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
    backgroundColor: '#F7EFE6',
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
  playerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F7EFE6',
  },
  playerName: {
    fontSize: 14,
    color: Colors.text,
  },
  playerNameActive: {
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyText: {
    color: Colors.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
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

