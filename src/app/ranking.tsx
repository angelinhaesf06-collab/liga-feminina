import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Trophy, Award, Medal } from 'lucide-react-native';
import Colors from '../constants/Colors';

export default function RankingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Trophy size={48} color={Colors.accent} />
        <Text style={styles.title}>Hall da Fama</Text>
        <Text style={styles.subtitle}>Desempenho acumulado de todas as jogadoras da liga.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.rankingTable}>
          <RankingItem rank={1} name="Ana Silva" wins={42} titles={5} score={1240} />
          <RankingItem rank={2} name="Beatriz Santos" wins={38} titles={3} score={1150} />
          <RankingItem rank={3} name="Carla Oliveira" wins={35} titles={2} score={1020} />
          <RankingItem rank={4} name="Denise Lima" wins={30} titles={1} score={980} />
          <RankingItem rank={5} name="Elena Ferreira" wins={28} titles={1} score={950} />
          {/* Mais jogadoras... */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RankingItem({ rank, name, wins, titles, score }: any) {
  const isTop3 = rank <= 3;
  
  return (
    <View style={[styles.rankingCard, isTop3 && styles.topRankCard]}>
      <View style={styles.rankBadge}>
        {rank === 1 ? <Trophy size={20} color={Colors.accent} /> : 
         rank === 2 ? <Award size={20} color="#C0C0C0" /> :
         rank === 3 ? <Medal size={20} color="#CD7F32" /> :
         <Text style={styles.rankNumber}>{rank}º</Text>}
      </View>
      
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{name}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>{wins} Vitórias</Text>
          <View style={styles.dot} />
          <Text style={styles.statLabel}>{titles} Títulos</Text>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  rankingTable: {
    gap: 12,
  },
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRankCard: {
    borderColor: Colors.accent,
    backgroundColor: '#FFFEFA',
  },
  rankBadge: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
  },
});
