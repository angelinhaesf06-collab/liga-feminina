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
