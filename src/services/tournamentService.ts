import { supabase } from './supabase';
import { generateMatches } from '../utils/rotations';

export const tournamentService = {
  async createTournament(playersIds: string[], rounds: number) {
    // 1. Gerar PIN aleatório
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Criar o torneio
    const { data: tournament, error: tError } = await supabase
      .from('torneios')
      .insert([
        { 
          pin_sala: pin, 
          qtd_jogadoras: playersIds.length, 
          limite_rodadas: rounds,
          status: 'em_andamento'
        }
      ])
      .select()
      .single();

    if (tError) throw tError;

    // 3. Gerar as partidas iniciais
    const matches = generateMatches(playersIds, rounds);
    const matchesWithTournamentId = matches.map(m => ({ ...m, torneio_id: tournament.id }));

    const { error: mError } = await supabase
      .from('partidas')
      .insert(matchesWithTournamentId);

    if (mError) throw mError;

    return { tournament, pin };
  },

  async getTournamentByPin(pin: string) {
    const { data, error } = await supabase
      .from('torneios')
      .select('*, partidas(*)')
      .eq('pin_sala', pin)
      .eq('status', 'em_andamento')
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMatches(tournamentId: string) {
    const { data, error } = await supabase
      .from('partidas')
      .select(`
        *,
        jogador_a1:jogadores!jogador_a1(nome),
        jogador_a2:jogadores!jogador_a2(nome),
        jogador_b1:jogadores!jogador_b1(nome),
        jogador_b2:jogadores!jogador_b2(nome)
      `)
      .eq('torneio_id', tournamentId)
      .order('rodada', { ascending: true })
      .order('quadra', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getRankingDoDia(tournamentId: string) {
    const { data: matches, error } = await supabase
      .from('partidas')
      .select('*')
      .eq('torneio_id', tournamentId)
      .eq('finalizada', true);

    if (error) throw error;

    const stats: Record<string, { nome: string, vitorias: number, saldo: number }> = {};

    // Buscar nomes dos jogadores envolvidos no torneio para garantir que todos apareçam no ranking
    // (Simplificado: pegamos das partidas já que todos jogam)
    
    matches.forEach(m => {
      const players = [m.jogador_a1, m.jogador_a2, m.jogador_b1, m.jogador_b2];
      
      // Inicializa se não existir (precisaríamos buscar nomes reais aqui para ser perfeito)
      // Por simplicidade neste passo, o ranking mostrará IDs ou nomes se fizermos um join
    });

  async getTournamentById(id: string) {
    const { data, error } = await supabase
      .from('torneios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMatchScore(matchId: string, scoreA: number, scoreB: number) {
    const { data, error } = await supabase
      .from('partidas')
      .update({ 
        placar_dupla_a: scoreA, 
        placar_dupla_b: scoreB,
        finalizada: true 
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
