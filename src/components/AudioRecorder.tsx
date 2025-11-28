import { useState, useRef, useEffect } from "react";
import { Mic, X, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

export const AudioRecorder = ({ onAudioRecorded, disabled }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsPreviewing(true);
        
        // Parar stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast.success("Gravação iniciada");
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      toast.error("Não foi possível acessar o microfone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    
    setIsPreviewing(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    chunksRef.current = [];
  };

  const sendRecording = () => {
    if (audioBlob) {
      onAudioRecorded(audioBlob, recordingTime);
      cancelRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isPreviewing) {
    return (
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 border border-border">
        <div className="flex-1 flex items-center gap-3">
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            controls
            className="flex-1 h-8"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {formatTime(recordingTime)}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={cancelRecording}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={sendRecording}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 bg-destructive/10 rounded-lg p-3 border border-destructive/20 animate-pulse">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-medium">Gravando...</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatTime(recordingTime)}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={cancelRecording}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={stopRecording}
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={disabled}
      onClick={startRecording}
      className={cn(
        "transition-colors",
        !disabled && "hover:bg-primary hover:text-primary-foreground"
      )}
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
};
