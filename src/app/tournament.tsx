import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LayoutGrid, ListOrdered, Share2, Save } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { tournamentService } from '../services/tournamentService';

export default function TournamentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tournament, setTournament] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rounds' | 'ranking'>('rounds');
  const [currentRound, setCurrentRound] = useState(1);
  const [editingScores, setEditingScores] = useState<Record<string, { a: string, b: string }>>({});

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  async function fetchData() {
    try {
      const tData = await tournamentService.getTournamentById(id);
      const mData = await tournamentService.getMatches(id);
      setTournament(tData);
      setMatches(mData);
      
      // Inicializar scores de edição
      const scores: any = {};
      mData.forEach(m => {
        scores[m.id] = { 
          a: m.placar_dupla_a?.toString() || '', 
          b: m.placar_dupla_b?.toString() || '' 
        };
      });
      setEditingScores(scores);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do torneio.');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateScore = async (matchId: string) => {
    const score = editingScores[matchId];
    if (score.a === '' || score.b === '') {
      Alert.alert('Atenção', 'Preencha ambos os placares.');
      return;
    }

    try {
      await tournamentService.updateMatchScore(matchId, parseInt(score.a), parseInt(score.b));
      fetchData(); // Atualiza dados e ranking
      Alert.alert('Sucesso', 'Placar atualizado!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar o placar.');
    }
  };

  const calculateRanking = () => {
    const ranking: Record<string, { nome: string, wins: number, diff: number }> = {};
    
    matches.filter(m => m.finalizada).forEach(m => {
      const players = [
        { id: m.jogador_a1_id, nome: m.jogador_a1.nome, isA: true },
        { id: m.jogador_a2_id, nome: m.jogador_a2.nome, isA: true },
        { id: m.jogador_b1_id, nome: m.jogador_b1.nome, isA: false },
        { id: m.jogador_b2_id, nome: m.jogador_b2.nome, isA: false },
      ];

      const winA = m.placar_dupla_a > m.placar_dupla_b;
      const diff = Math.abs(m.placar_dupla_a - m.placar_dupla_b);

      players.forEach(p => {
        if (!ranking[p.id]) ranking[p.id] = { nome: p.nome, wins: 0, diff: 0 };
        const won = (p.isA && winA) || (!p.isA && !winA);
        if (won) {
          ranking[p.id].wins += 1;
          ranking[p.id].diff += diff;
        } else {
          ranking[p.id].diff -= diff;
        }
      });
    });

    return Object.values(ranking).sort((a, b) => b.wins - a.wins || b.diff - a.diff);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} /></View>;

  const filteredMatches = matches.filter(m => m.rodada === currentRound);
  const rankingData = calculateRanking();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pinContainer}>
          <Text style={styles.pinLabel}>PIN DO DIA:</Text>
          <Text style={styles.pinValue}>{tournament?.pin_sala}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'rounds' && styles.tabActive]}
          onPress={() => setActiveTab('rounds')}
        >
          <LayoutGrid size={20} color={activeTab === 'rounds' ? Colors.primary : Colors.secondary} />
          <Text style={[styles.tabText, activeTab === 'rounds' && styles.tabTextActive]}>Rodadas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ranking' && styles.tabActive]}
          onPress={() => setActiveTab('ranking')}
        >
          <ListOrdered size={20} color={activeTab === 'ranking' ? Colors.primary : Colors.secondary} />
          <Text style={[styles.tabText, activeTab === 'ranking' && styles.tabTextActive]}>Ranking do Dia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'rounds' ? (
          <View style={{ flex: 1 }}>
            <View style={styles.roundSelector}>
              {[1, 2, 3, 4, 5, 6].slice(0, tournament?.limite_rodadas).map((r) => (
                <TouchableOpacity 
                  key={r}
                  style={[styles.roundButton, currentRound === r && styles.roundButtonActive]}
                  onPress={() => setCurrentRound(r)}
                >
                  <Text style={[styles.roundButtonText, currentRound === r && styles.roundButtonTextActive]}>
                    R{r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView contentContainerStyle={styles.matchesList}>
              {filteredMatches.map(m => (
                <View key={m.id} style={styles.matchCard}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.courtLabel}>QUADRA {m.quadra}</Text>
                    {m.finalizada && <Text style={styles.finishedLabel}>FINALIZADO</Text>}
                  </View>
                  <View style={styles.matchContent}>
                    <View style={styles.team}>
                      <Text style={styles.playerNames}>{m.jogador_a1.nome} + {m.jogador_a2.nome}</Text>
                      <TextInput
                        style={styles.scoreInput}
                        keyboardType="number-pad"
                        value={editingScores[m.id]?.a}
                        onChangeText={(val) => setEditingScores({...editingScores, [m.id]: {...editingScores[m.id], a: val}})}
                        placeholder="-"
                      />
                    </View>
                    <Text style={styles.vs}>VS</Text>
                    <View style={styles.team}>
                      <Text style={[styles.playerNames, { textAlign: 'right' }]}>{m.jogador_b1.nome} + {m.jogador_b2.nome}</Text>
                      <TextInput
                        style={[styles.scoreInput, { textAlign: 'right' }]}
                        keyboardType="number-pad"
                        value={editingScores[m.id]?.b}
                        onChangeText={(val) => setEditingScores({...editingScores, [m.id]: {...editingScores[m.id], b: val}})}
                        placeholder="-"
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.saveScoreButton}
                      onPress={() => handleUpdateScore(m.id)}
                    >
                      <Save size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.rankingContainer}>
            <View style={styles.rankingHeader}>
              <Text style={[styles.rankingHeaderText, { flex: 1 }]}>Atleta</Text>
              <Text style={[styles.rankingHeaderText, { width: 40 }]}>VIT</Text>
              <Text style={[styles.rankingHeaderText, { width: 40 }]}>SAL</Text>
            </View>
            <ScrollView>
              {rankingData.map((row, index) => (
                <View key={index} style={styles.rankingRow}>
                  <Text style={styles.rankText}>{index + 1}º</Text>
                  <Text style={styles.nameText}>{row.nome}</Text>
                  <Text style={styles.statText}>{row.wins}</Text>
                  <Text style={styles.statText}>{row.diff > 0 ? `+${row.diff}` : row.diff}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  pinValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F7EFE6',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 4,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#F7EFE6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  roundSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roundButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roundButtonText: {
    fontWeight: '700',
    color: Colors.secondary,
  },
  roundButtonTextActive: {
    color: Colors.white,
  },
  matchesList: {
    padding: 16,
    gap: 16,
  },
  matchCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  courtLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 2,
  },
  finishedLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
    gap: 8,
  },
  playerNames: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
    height: 36,
  },
  scoreInput: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    backgroundColor: '#FDFBF7',
    padding: 8,
    borderRadius: 8,
    width: 50,
  },
  vs: {
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.border,
  },
  saveScoreButton: {
    marginLeft: 12,
    padding: 10,
    backgroundColor: '#F7EFE6',
    borderRadius: 10,
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankingHeader: {
    flexDirection: 'row',
    backgroundColor: '#F7EFE6',
    padding: 16,
  },
  rankingHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.secondary,
    textAlign: 'center',
  },
  rankingRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  rankText: {
    width: 32,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  statText: {
    width: 40,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
});
