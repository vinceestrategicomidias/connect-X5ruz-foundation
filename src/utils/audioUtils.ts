/**
 * Cria um tom de ringing programaticamente usando Web Audio API
 * Usado como fallback caso o arquivo de áudio não esteja disponível
 */
export const createRingingTone = (): HTMLAudioElement => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const destination = audioContext.createMediaStreamDestination();
  
  // Criar dois tons para simular um telefone tocando (400Hz e 450Hz)
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator1.type = 'sine';
  oscillator1.frequency.value = 400;
  oscillator2.type = 'sine';
  oscillator2.frequency.value = 450;
  
  // Conectar osciladores ao ganho
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(destination);
  gainNode.gain.value = 0.3; // Volume moderado
  
  // Criar padrão de toque: 1 segundo tocando, 3 segundos de pausa
  let isPlaying = false;
  const startTime = audioContext.currentTime;
  
  const scheduleBeeps = () => {
    const currentTime = audioContext.currentTime - startTime;
    const cycleTime = currentTime % 4; // 4 segundos por ciclo
    
    if (cycleTime < 1 && !isPlaying) {
      // Tocar por 1 segundo
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      isPlaying = true;
    } else if (cycleTime >= 1 && isPlaying) {
      // Pausa por 3 segundos
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      isPlaying = false;
    }
  };
  
  // Iniciar osciladores
  oscillator1.start();
  oscillator2.start();
  
  // Agendar padrão de toque
  setInterval(scheduleBeeps, 100);
  
  // Criar elemento de áudio a partir do stream
  const audio = new Audio();
  audio.srcObject = destination.stream;
  audio.loop = true;
  
  return audio;
};

/**
 * Tenta carregar o arquivo de áudio de ringing
 * Se falhar, cria um tom programaticamente
 */
export const loadRingingAudio = (): HTMLAudioElement => {
  const audio = new Audio();
  
  // Tentar carregar o arquivo MP3
  audio.src = '/ringing_connect.mp3';
  audio.loop = true;
  audio.volume = 0.5;
  
  // Se o arquivo não existir, usar tom programático
  audio.addEventListener('error', () => {
    console.log('Arquivo de ringing não encontrado, usando tom programático');
    // Retornar para o tom programático
    return createRingingTone();
  }, { once: true });
  
  return audio;
};
