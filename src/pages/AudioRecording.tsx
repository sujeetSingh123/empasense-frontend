import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Upload, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly to capture your audio.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast({
        title: "Recording stopped",
        description: "Your audio has been saved.",
      });
    }
  };

  const togglePlayback = () => {
    if (!audioBlob || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAnalyze = () => {
    if (!audioBlob) {
      toast({
        title: "No audio",
        description: "Please record or upload audio first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analyzing audio",
      description: "Processing your audio for empathy analysis...",
    });

    setTimeout(() => {
      navigate("/empathy-scoreboard");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      toast({
        title: "Audio uploaded",
        description: "Your audio file has been loaded successfully.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Audio Recording</h1>
          <p className="text-muted-foreground mt-1">Record or upload audio for empathy analysis</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Record Audio</CardTitle>
              <CardDescription>Use your microphone to record audio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isRecording ? "bg-destructive/20 animate-pulse" : "bg-primary/20"
                }`}>
                  <Mic className={`h-12 w-12 ${isRecording ? "text-destructive" : "text-primary"}`} />
                </div>
                
                {isRecording && (
                  <div className="text-2xl font-bold">{formatTime(recordingTime)}</div>
                )}

                <div className="flex gap-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} size="lg" className="gap-2">
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} size="lg" variant="destructive" className="gap-2">
                      <Square className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Audio</CardTitle>
              <CardDescription>Choose an existing audio file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Upload className="h-12 w-12 text-secondary" />
                </div>
                
                <div className="flex gap-4">
                  <label htmlFor="audio-upload">
                    <Button asChild size="lg" className="gap-2 cursor-pointer">
                      <span>
                        <Upload className="h-4 w-4" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {audioBlob && (
                  <p className="text-sm text-muted-foreground">Audio file loaded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {audioBlob && (
          <Card>
            <CardHeader>
              <CardTitle>Audio Preview</CardTitle>
              <CardDescription>Review your audio before analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio
                ref={audioRef}
                src={audioBlob ? URL.createObjectURL(audioBlob) : ""}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              
              <div className="flex items-center justify-between">
                <Button onClick={togglePlayback} variant="outline" className="gap-2">
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
                
                <Button onClick={handleAnalyze} size="lg" className="gap-2">
                  Analyze Empathy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
