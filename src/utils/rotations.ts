/**
 * Lógica de Rotação "Rei e Rainha da Areia"
 * Baseada em matrizes fixas para garantir que as duplas rotacionem 
 * e as jogadoras não repitam parcerias/oponentes excessivamente.
 */

export type MatchTemplate = {
  quadra: number;
  duplaA: [number, number];
  duplaB: [number, number];
};

export type RoundTemplate = MatchTemplate[];

// Templates de exemplo para 8 jogadoras (posições 0 a 7)
export const ROTATIONS_8_PLAYERS: RoundTemplate[] = [
  // Rodada 1
  [
    { quadra: 1, duplaA: [0, 1], duplaB: [2, 3] },
    { quadra: 2, duplaA: [4, 5], duplaB: [6, 7] },
  ],
  // Rodada 2
  [
    { quadra: 1, duplaA: [0, 2], duplaB: [4, 6] },
    { quadra: 2, duplaA: [1, 3], duplaB: [5, 7] },
  ],
  // Rodada 3
  [
    { quadra: 1, duplaA: [0, 4], duplaB: [1, 5] },
    { quadra: 2, duplaA: [2, 6], duplaB: [3, 7] },
  ],
  // Rodada 4
  [
    { quadra: 1, duplaA: [0, 7], duplaB: [3, 4] },
    { quadra: 2, duplaA: [1, 6], duplaB: [2, 5] },
  ],
];

// Função para embaralhar um array (Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Gera as partidas para um torneio baseado no número de jogadoras e rodadas.
 * @param playersIds Array de IDs das jogadoras presentes.
 * @param rounds Quantidade de rodadas.
 * @returns Array de partidas formatado para o banco de dados.
 */
export function generateMatches(playersIds: string[], rounds: number) {
  const shuffledPlayers = shuffle(playersIds);
  const matches: any[] = [];

  // Por enquanto usando apenas o template de 8 para demonstração
  // No futuro, adicionar templates para 10, 12, 16 e 24
  const template = ROTATIONS_8_PLAYERS;

  for (let r = 0; r < Math.min(rounds, template.length); r++) {
    const roundData = template[r];
    roundData.forEach((match) => {
      matches.push({
        rodada: r + 1,
        quadra: match.quadra,
        jogador_a1: shuffledPlayers[match.duplaA[0]],
        jogador_a2: shuffledPlayers[match.duplaA[1]],
        jogador_b1: shuffledPlayers[match.duplaB[0]],
        jogador_b2: shuffledPlayers[match.duplaB[1]],
      });
    });
  }

  return matches;
}
