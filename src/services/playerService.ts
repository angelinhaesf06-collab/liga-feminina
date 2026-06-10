import { supabase } from './supabase';

export const playerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .order('nome');
    if (error) throw error;
    return data;
  },

  async create(nome: string) {
    const { data, error } = await supabase
      .from('jogadores')
      .insert([{ nome }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getRankingGeral() {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .order('vitorias_totais', { ascending: false })
      .order('pontos_totais', { ascending: false });
    if (error) throw error;
    return data;
  }
};
