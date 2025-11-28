import { useState, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';

export const useAudioTranscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = useCallback(async (audioUrl: string): Promise<string | null> => {
    setIsLoading(true);
    setIsModelLoading(true);
    setError(null);

    try {
      // Inicializar o pipeline de reconhecimento de fala com Whisper
      const transcriber = await pipeline(
        'automatic-speech-recognition',
        'onnx-community/whisper-tiny',
        { device: 'webgpu' }
      );

      setIsModelLoading(false);

      // Transcrever o áudio
      const result = await transcriber(audioUrl);
      
      if (result && typeof result === 'object' && 'text' in result) {
        return result.text as string;
      }

      throw new Error('Formato de resposta inválido');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao transcrever áudio';
      setError(errorMessage);
      console.error('Erro na transcrição:', err);
      return null;
    } finally {
      setIsLoading(false);
      setIsModelLoading(false);
    }
  }, []);

  return {
    transcribeAudio,
    isLoading,
    isModelLoading,
    error,
  };
};
