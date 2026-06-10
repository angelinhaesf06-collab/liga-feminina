import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { LayoutGrid, ListOrdered, Share2 } from 'lucide-react-native';
import Colors from '../constants/Colors';

export default function TournamentScreen() {
  const [activeTab, setActiveTab] = useState<'rounds' | 'ranking'>('rounds');
  const [currentRound, setCurrentRound] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pinContainer}>
          <Text style={styles.pinLabel}>PIN DO DIA:</Text>
          <Text style={styles.pinValue}>8492</Text>
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
              {[1, 2, 3, 4].map((r) => (
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
              <MatchCard 
                court={1} 
                teamA={['Ana', 'Beatriz']} 
                teamB={['Carla', 'Denise']} 
                scoreA={6} 
                scoreB={4} 
              />
              <MatchCard 
                court={2} 
                teamA={['Elena', 'Fernanda']} 
                teamB={['Gabi', 'Helena']} 
                scoreA={null} 
                scoreB={null} 
              />
            </ScrollView>
          </View>
        ) : (
          <View style={styles.rankingContainer}>
            <View style={styles.rankingHeader}>
              <Text style={[styles.rankingHeaderText, { flex: 1 }]}>Jogadora</Text>
              <Text style={[styles.rankingHeaderText, { width: 40 }]}>VIT</Text>
              <Text style={[styles.rankingHeaderText, { width: 40 }]}>SAL</Text>
            </View>
            <ScrollView>
              <RankingRow rank={1} name="Ana" wins={3} diff={12} />
              <RankingRow rank={2} name="Beatriz" wins={3} diff={8} />
              <RankingRow rank={3} name="Carla" wins={2} diff={4} />
              <RankingRow rank={4} name="Denise" wins={1} diff={-2} />
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function MatchCard({ court, teamA, teamB, scoreA, scoreB }: any) {
  return (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.courtLabel}>QUADRA {court}</Text>
      </View>
      <View style={styles.matchContent}>
        <View style={styles.team}>
          <Text style={styles.playerNames}>{teamA.join(' + ')}</Text>
          <Text style={styles.score}>{scoreA ?? '-'}</Text>
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.team}>
          <Text style={[styles.playerNames, { textAlign: 'right' }]}>{teamB.join(' + ')}</Text>
          <Text style={styles.score}>{scoreB ?? '-'}</Text>
        </View>
      </View>
    </View>
  );
}

function RankingRow({ rank, name, wins, diff }: any) {
  return (
    <View style={styles.rankingRow}>
      <Text style={styles.rankText}>{rank}º</Text>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.statText}>{wins}</Text>
      <Text style={styles.statText}>{diff > 0 ? `+${diff}` : diff}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  vs: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.border,
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
