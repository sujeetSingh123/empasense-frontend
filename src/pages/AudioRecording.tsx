import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Upload, Play, Pause, Send, Trash2, Heart, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RecordingVisualizer } from "@/components/audio/RecordingVisualizer";
import { ApiResponsePanel } from "@/components/audio/ApiResponsePanel";
import { useAnalyzeEmotions } from "@/hooks/mutations/useAnalyzeEmotions";
import authBg from "@/assets/auth-bg.jpg";

export default function AudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const analyzeEmotions = useAnalyzeEmotions();
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setActiveStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
        setActiveStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setApiError(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({ title: "Recording started", description: "Speak clearly to capture your audio." });
    } catch {
      toast({ title: "Error", description: "Could not access microphone. Please check permissions.", variant: "destructive" });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      toast({ title: "Recording stopped", description: "Your audio has been saved." });
    }
  }, [isRecording, toast]);

  const togglePlayback = useCallback(() => {
    if (!audioBlob || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioBlob, isPlaying]);

  const handleSubmit = useCallback(async () => {
    if (!audioBlob) return;
    setApiError(null);

    analyzeEmotions.mutate(audioBlob, {
      onSuccess: (result) => {
        toast({
          title: result.success ? "Analysis complete" : "Submission failed",
          description: result.success ? "API returned a response." : result.error,
          variant: result.success ? undefined : "destructive",
        });
      },
      onError: (error) => {
        const message = error.message || "Unable to analyze emotions.";
        setApiError(message);
        toast({
          title: "Submission failed",
          description: message,
          variant: "destructive",
        });
      },
    });
  }, [analyzeEmotions, audioBlob, toast]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setApiError(null);
      toast({ title: "Audio uploaded", description: file.name });
    }
  }, [toast]);

  const clearAudio = useCallback(() => {
    setAudioBlob(null);
    setApiError(null);
    setIsPlaying(false);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: brand / project story (same style as Login) */}
      <div className="hidden w-1/2 lg:block">
        <div className="relative h-full">
          <img
            src={authBg}
            alt="EmpaSense audio analysis"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold">EmpaSense</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-center">
              Listen Beyond Words
            </h2>
            <p className="max-w-md text-center text-lg text-white/90 mb-6">
              This audio console powers EmpaSense&apos;s real-time empathy engine.
              Capture conversations, understand emotional tone, and turn every
              interaction into measurable emotional intelligence.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm max-w-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Activity className="h-4 w-4" />
                  Emotion Signals
                </div>
                <p className="text-white/80">
                  Detect sentiment, intensity, and engagement directly from voice patterns.
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Mic className="h-4 w-4" />
                  Coaching Ready
                </div>
                <p className="text-white/80">
                  Use insights to coach teams on empathy, active listening, and de‑escalation.
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Heart className="h-4 w-4" />
                  Empathy Score
                </div>
                <p className="text-white/80">
                  Feed analyzed audio directly into your empathy scoreboards and analytics.
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Send className="h-4 w-4" />
                  Secure by Design
                </div>
                <p className="text-white/80">
                  Audio is processed through secure APIs designed for enterprise teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: audio recording workspace */}
      <div className="flex w-full items-center justify-center p-6 lg:p-10 bg-muted/40">
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Audio Empathy Console</h1>
              <p className="text-muted-foreground mt-1">
                Record or upload audio, then let EmpaSense analyze emotional tone and empathy signals.
              </p>
            </div>
          </div>

          {/* Recording Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-accent/40 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Capture Audio</CardTitle>
                  <CardDescription>Record from microphone or upload an existing file</CardDescription>
                </div>
                {isRecording && (
                  <Badge variant="destructive" className="animate-pulse gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-destructive-foreground" />
                    REC {formatTime(recordingTime)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Visualizer */}
              <div className="flex justify-center">
                <RecordingVisualizer isRecording={isRecording} stream={activeStream} />
              </div>

              {!isRecording && !audioBlob && (
                <div className="flex flex-col items-center py-8 gap-2">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mic className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    No audio captured yet. Start a recording or upload an audio file to begin analysis.
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {!isRecording ? (
                  <Button onClick={startRecording} size="lg" className="gap-2 min-w-[160px]">
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} size="lg" variant="destructive" className="gap-2 min-w-[160px]">
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                )}

                {!isRecording && (
                  <>
                    <label htmlFor="audio-upload">
                      <Button asChild variant="outline" size="lg" className="gap-2 cursor-pointer">
                        <span>
                          <Upload className="h-4 w-4" />
                          Upload File
                        </span>
                      </Button>
                    </label>
                    <input id="audio-upload" type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview & Submit */}
          {audioBlob && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Audio Preview</CardTitle>
                    <CardDescription>Review your audio, then submit for empathy analysis</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearAudio}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio
                  ref={audioRef}
                  src={URL.createObjectURL(audioBlob)}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />

                <div className="flex items-center gap-4 flex-wrap">
                  <Button onClick={togglePlayback} variant="outline" className="gap-2">
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Play
                      </>
                    )}
                  </Button>

                  <Badge variant="secondary" className="text-xs">
                    {audioBlob instanceof File ? audioBlob.name : "recording.webm"}
                  </Badge>

                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="gap-2 ml-auto"
                    disabled={analyzeEmotions.isPending}
                  >
                    <Send className="h-4 w-4" />
                    {analyzeEmotions.isPending ? "Submitting..." : "Submit for Analysis"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Response */}
          <ApiResponsePanel
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            response={analyzeEmotions.data as never}
            isLoading={analyzeEmotions.isPending}
          />
          {apiError && (
            <p className="text-sm text-destructive">
              {apiError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
