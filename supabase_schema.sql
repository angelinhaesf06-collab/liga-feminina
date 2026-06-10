-- TABELA DE JOGADORES (Cadastro Global)
CREATE TABLE jogadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT UNIQUE NOT NULL,
    vitorias_totais INT DEFAULT 0,
    pontos_totais INT DEFAULT 0, -- Saldo de games histórico
    partidas_jogadas INT DEFAULT 0,
    torneios_ganhos INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE TORNEIOS (Sessões do Dia)
CREATE TABLE torneios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pin_sala TEXT NOT NULL, -- Ex: 8492
    status TEXT DEFAULT 'configuracao', -- 'configuracao', 'em_andamento', 'mata_mata', 'finalizado'
    qtd_jogadoras INT NOT NULL,
    limite_rodadas INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE PARTIDAS (Jogos de cada Rodada)
CREATE TABLE partidas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneio_id UUID REFERENCES torneios(id) ON DELETE CASCADE,
    rodada INT NOT NULL,
    quadra INT NOT NULL,
    jogador_a1 UUID REFERENCES jogadores(id),
    jogador_a2 UUID REFERENCES jogadores(id),
    jogador_b1 UUID REFERENCES jogadores(id),
    jogador_b2 UUID REFERENCES jogadores(id),
    placar_dupla_a INT,
    placar_dupla_b INT,
    finalizada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Realtime para a tabela de partidas e torneios
ALTER PUBLICATION supabase_realtime ADD TABLE partidas;
ALTER PUBLICATION supabase_realtime ADD TABLE torneios;

-- Políticas de Segurança (RLS) - Simples para o Protótipo
-- Permitir leitura pública (anon) e escrita (para a organizadora)
ALTER TABLE jogadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE torneios ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para anon" ON jogadores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para anon" ON torneios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para anon" ON partidas FOR ALL USING (true) WITH CHECK (true);
