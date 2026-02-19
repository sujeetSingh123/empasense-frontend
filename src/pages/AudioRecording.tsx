import { useState, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Upload, Play, Pause, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RecordingVisualizer } from "@/components/audio/RecordingVisualizer";
import { ApiResponsePanel } from "@/components/audio/ApiResponsePanel";
import { submitAudioToApi, type AudioApiResponse } from "@/lib/audio-api";

export default function AudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<AudioApiResponse | null>(null);
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
      setApiResponse(null);

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
    setIsSubmitting(true);
    setApiResponse(null);

    const result = await submitAudioToApi(audioBlob);
    setApiResponse(result);
    setIsSubmitting(false);

    toast({
      title: result.success ? "Analysis complete" : "Submission failed",
      description: result.success ? "API returned a response." : result.error,
      variant: result.success ? undefined : "destructive",
    });
  }, [audioBlob, toast]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setApiResponse(null);
      toast({ title: "Audio uploaded", description: file.name });
    }
  }, [toast]);

  const clearAudio = useCallback(() => {
    setAudioBlob(null);
    setApiResponse(null);
    setIsPlaying(false);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Audio Recording</h1>
          <p className="text-muted-foreground mt-1">Record or upload audio, then submit to your API for analysis</p>
        </div>

        {/* Recording Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-accent/30 border-b border-border">
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
                <p className="text-muted-foreground text-sm">No audio captured yet</p>
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
                  <CardDescription>Review your audio, then submit for analysis</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={clearAudio} className="text-muted-foreground hover:text-destructive">
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
                  {isPlaying ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Play</>}
                </Button>

                <Badge variant="secondary" className="text-xs">
                  {audioBlob instanceof File ? audioBlob.name : "recording.webm"}
                </Badge>

                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="gap-2 ml-auto"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  Submit to API
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Response */}
        <ApiResponsePanel response={apiResponse} isLoading={isSubmitting} />
      </div>
    </DashboardLayout>
  );
}
