# Instruções para Arquivo de Áudio de Ringing

## Localização do Arquivo
O sistema de telefonia espera encontrar o arquivo de som de ligação em:
```
public/ringing_connect.mp3
```

## Especificações do Áudio
- **Formato**: MP3
- **Duração recomendada**: 2-4 segundos
- **Loop**: O áudio será reproduzido em loop automaticamente pelo sistema
- **Volume**: O sistema já controla o volume em 50% (0.5)

## Como Adicionar o Arquivo

1. Encontre ou crie um arquivo de áudio de tom de telefone tocando
2. Certifique-se de que está no formato MP3
3. Renomeie o arquivo para `ringing_connect.mp3`
4. Coloque o arquivo na pasta `public/` do projeto

## Fontes Sugeridas para Áudio
- **Freesound.org**: https://freesound.org (busque por "phone ringing" ou "telephone ring")
- **Zapsplat.com**: https://www.zapsplat.com
- **Mixkit.co**: https://mixkit.co/free-sound-effects/phone/

## Fallback
Se o arquivo não for encontrado, o sistema usará um tom programático gerado via Web Audio API como fallback.

## Testar o Som
1. Adicione o arquivo na pasta `public/`
2. Inicie ou recarregue o aplicativo
3. Faça uma ligação de teste
4. O som deve tocar automaticamente quando o status for "Discando" ou "Chamando"
5. O som deve parar quando a ligação conectar ou encerrar
