-- Limpar dados duplicados e inválidos

-- Remover pacote thali duplicado vazio
DELETE FROM pacotes_figurinhas 
WHERE id = '11ad753a-1f9e-4e3c-9531-1395bfb02010';

-- Remover figurinhas com URLs inválidas (placeholders que nunca foram gerados)
DELETE FROM figurinhas 
WHERE url_imagem LIKE '%_initial.png';