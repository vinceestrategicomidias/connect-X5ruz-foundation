-- Remover políticas antigas da tabela notificacoes
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON notificacoes;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias notificações" ON notificacoes;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias notificações" ON notificacoes;

-- Criar políticas permissivas para protótipo
CREATE POLICY "Permitir leitura de notificacoes" 
ON notificacoes 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir insercao de notificacoes" 
ON notificacoes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualizacao de notificacoes" 
ON notificacoes 
FOR UPDATE 
USING (true);