import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { UserPlus, Trash2, User, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { playerService } from '../services/playerService';

export default function AthletesScreen() {
  const [name, setName] = useState('');
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAthletes();
  }, []);

  async function fetchAthletes() {
    try {
      const data = await playerService.getAll();
      setAthletes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os atletas.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAthlete() {
    if (!name.trim()) return;

    setSaving(true);
    try {
      await playerService.create(name.trim());
      setName('');
      fetchAthletes();
      Alert.alert('Sucesso', 'Atleta cadastrado(a) com sucesso!');
    } catch (error: any) {
      if (error.code === '23505') {
        Alert.alert('Erro', 'Este nome já está cadastrado.');
      } else {
        Alert.alert('Erro', 'Falha ao salvar atleta.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestão de Atletas</Text>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo do(a) atleta"
          placeholderTextColor={Colors.border}
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity 
          style={[styles.addButton, (!name.trim() || saving) && styles.addButtonDisabled]}
          onPress={handleAddAthlete}
          disabled={!name.trim() || saving}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <UserPlus size={20} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.subtitle}>Atletas Cadastrados ({athletes.length})</Text>
        
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={athletes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.athleteCard}>
                <View style={styles.athleteInfo}>
                  <User size={18} color={Colors.primary} />
                  <Text style={styles.athleteName}>{item.nome}</Text>
                </View>
                {/* Botão de excluir pode ser adicionado aqui futuramente */}
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum(a) atleta encontrado(a).</Text>
            }
            contentContainerStyle={styles.listContent}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  inputSection: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  athleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  athleteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.secondary,
    marginTop: 40,
    fontStyle: 'italic',
  },
});
