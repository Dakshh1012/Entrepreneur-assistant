/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { useState, useRef } from "react";
import { Mic, Square, Play, FileText } from "lucide-react";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { Button } from "@heroui/react";
import { Progress } from "@heroui/react";
import axios from "axios";

import { cn, cleanFirstBulletPoint } from "../utlis";

type PitchAnalysis = {
  score: number;
  strengths: string[];
  improvements: string[];
  metrics: {
    clarity: number;
    confidence: number;
    pace: number;
    engagement: number;
  };
};

export default function FundraisingPage() {
  const flaskUrl = import.meta.env.VITE_FLASK_URL;
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      axios.post(`${flaskUrl}/start_recording`);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);

        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript(null); // Clear previous transcript
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    try {
      const response = await axios.post(`${flaskUrl}/stop_recording`);

      getAnalysisData(response.data.ai_feedback);
      // Assuming the transcript is included in the response
      setTranscript(
        response.data.transcribed_text || "No transcript available"
      );
    } catch (err) {
      console.error(err);
    }
    setIsAnalyzing(false);
  };

  const getAnalysisData = (feedback) => {
    const pitchScoreMatch = feedback.match(/Pitch Score:\s*(\d+)/);
    const pitchScore = pitchScoreMatch ? pitchScoreMatch[1] : null;
    const strengthsMatch = feedback.match(/▶ Strengths([\s\S]*?)\n\n⚠/);
    let strengths = strengthsMatch
      ? strengthsMatch[1]
          .trim()
          .split("\n- ")
          .filter((str) => str)
      : [];

    strengths = cleanFirstBulletPoint(strengths);

    const improvementsMatch = feedback.match(
      /⚠ Areas for Improvement([\s\S]*?)\n\nDetailed Metrics:/
    );
    let improvements = improvementsMatch
      ? improvementsMatch[1]
          .trim()
          .split("\n- ")
          .filter((str) => str)
      : [];

    improvements = cleanFirstBulletPoint(improvements);

    const metricsMatch = feedback.match(
      /Clarity:\s*(\d+)%\s*Confidence:\s*(\d+)%\s*Pace:\s*(\d+)%\s*Engagement:\s*(\d+)%/
    );
    const clarity = metricsMatch ? metricsMatch[1] : null;
    const confidence = metricsMatch ? metricsMatch[2] : null;
    const pace = metricsMatch ? metricsMatch[3] : null;
    const engagement = metricsMatch ? metricsMatch[4] : null;
    const analysis = {
      score: pitchScore,
      strengths,
      improvements,
      metrics: {
        clarity,
        confidence,
        pace,
        engagement,
      },
    };

    console.log(feedback);
    console.log(analysis);
    setAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-900 w-full">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Pitch Analysis
          </h1>
          <p className="text-lg text-muted-foreground">
            Record your pitch and get instant AI-powered feedback
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1 border-b bg-muted/50 flex flex-col">
            <h2 className="text-xl font-semibold">Pitch Recorder</h2>
            <p className="text-sm text-muted-foreground text-gray-600">
              Record your pitch in a quiet environment for best results
            </p>
          </CardHeader>
          <CardBody className="space-y-8 p-6">
            <div className="flex justify-center p-10 border-2 border-dashed rounded-xl bg-muted/5">
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing your pitch...
                  </p>
                </div>
              ) : !audioUrl ? (
                <Button
                  className={cn(
                    "gap-2 text-lg font-medium px-8",
                    isRecording && "animate-pulse bg-red-500 hover:bg-red-600"
                  )}
                  size="lg"
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-5 w-5" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      Start Recording
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-6 w-full max-w-md">
                  <div className="bg-muted/10 p-4 rounded-lg">
                    <audio controls className="w-full" src={audioUrl} />
                  </div>
                  {!isAnalyzing && (
                    <div className="flex justify-center gap-4">
                      <Button
                        size="lg"
                        variant="bordered"
                        onPress={() => {
                          setAudioUrl(null);
                          setAnalysis(null);
                          setTranscript(null);
                        }}
                      >
                        Record Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Transcript Section */}
            {transcript && !isAnalyzing && (
              <div className="space-y-4 bg-muted/5 p-6 rounded-xl">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcript
                </h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>
              </div>
            )}

            {analysis && !isAnalyzing && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full text-primary">
                    <Play className="h-4 w-4" />
                    Analysis Complete
                  </div>
                  <div className="text-3xl font-bold">
                    Pitch Score: {analysis.score}%
                  </div>
                  <Progress
                    className="h-3 w-64 mx-auto"
                    value={analysis.score}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-3">
                      {analysis.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Growth Opportunities
                    </h3>
                    <ul className="space-y-3">
                      {analysis.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6 bg-muted/5 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(analysis.metrics).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="text-sm font-medium capitalize">
                          {key}
                        </div>
                        <Progress className="h-2" value={value} />
                        <div className="text-sm text-muted-foreground">
                          {value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
