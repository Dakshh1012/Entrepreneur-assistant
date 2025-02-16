/* eslint-disable prettier/prettier */
import { useState } from "react";
import { AlertCircle, Globe2, Search, Users2 } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Textarea,
  Progress,
} from "@heroui/react";
import nlp from "compromise";
import axios from "axios";
const stopWords = new Set(["and", "or", "the", "is", "are"]);

function getKeywords(text: string) {
  return nlp(text)
    .nouns()
    .out("array")
    .flatMap((phrase: string) => phrase.split(/\s+/))
    .filter((word: string) => !stopWords.has(word.toLowerCase()));
}

function getAnalysisObj(feedback: string) {
  const pitchScoreMatch = feedback.match(/Pitch Score:\s*(\d+)%/);
  const pitchScore = pitchScoreMatch ? parseInt(pitchScoreMatch[1]) : null;

  // Extract Market Analysis Percentages
  const marketTrendsMatch = feedback.match(/Market Trends:\s*(\d+)%/);
  const marketSizeMatch = feedback.match(/Market Size:\s*(\d+)%/);
  const competitionAnalysisMatch = feedback.match(
    /Competition Analysis:\s*(\d+)%/
  );
  const searchVolumeMatch = feedback.match(/Search Volume:\s*(\d+)%/);

  const marketAnalysis = {
    marketTrends: marketTrendsMatch ? parseInt(marketTrendsMatch[1]) : null,
    marketSize: marketSizeMatch ? parseInt(marketSizeMatch[1]) : null,
    competitionAnalysis: competitionAnalysisMatch
      ? parseInt(competitionAnalysisMatch[1])
      : null,
    searchVolume: searchVolumeMatch ? parseInt(searchVolumeMatch[1]) : null,
  };

  // Extract Suggestions
  const suggestionsMatch = feedback.match(/Suggestions:\n((?:- .+\n?)+)/);
  const suggestions = suggestionsMatch
    ? suggestionsMatch[1]
        .split("\n")
        .map((s) => s.replace(/^- /, "").trim())
        .filter((s) => s)
    : [];

  // Extract Potential Risks
  const risksMatch = feedback.match(/Potential Risks:\n((?:- .+\n?)+)/);
  const potentialRisks = risksMatch
    ? risksMatch[1]
        .split("\n")
        .map((r) => r.replace(/^- /, "").trim())
        .filter((r) => r)
    : [];

  return { pitchScore, marketAnalysis, suggestions, potentialRisks };
}

export default function IdeaValidationPage() {
  const [idea, setIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<{
    pitchScore: number | null;
    marketAnalysis: {
      marketTrends: number | null;
      marketSize: number | null;
      competitionAnalysis: number | null;
      searchVolume: number | null;
    };
    suggestions: string[];
    potentialRisks: string[];
  } | null>(null);
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const keywords = getKeywords(idea);

      const response = await axios.post("http://localhost:5000/analyze-idea", {
        business_idea: idea,
        keywords: keywords,
      });

      setIsAnalyzing(false);
      setShowResults(true);
      setAnalysis(getAnalysisObj(response.data.feedback));
    } catch (error) {
      console.error(
        "Error analyzing business idea:",
        error.response?.data?.error || error.message
      );
      setIsAnalyzing(false);

      return "An error occurred while analyzing the business idea.";
    }
  };

  return (
    <div className="w-full mx-auto p-8 space-y-6 h-screen">
      <Card className="min-h-1/2">
        <CardHeader className="flex flex-col">
          <h1 className="font-bold text-2xl">Validate Your Startup Idea</h1>
          <p>Get detailed analysis for your idea</p>
        </CardHeader>
        <CardBody className="flex flex-col items-center">
          <Textarea
            className="min-h-[150px] mb-4"
            placeholder="Describe your startup idea..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button
            className="w-42"
            disabled={!idea || isAnalyzing}
            isLoading={isAnalyzing}
            onPress={handleAnalyze}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Idea"}
          </Button>
        </CardBody>
      </Card>

      {showResults && analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <h2>Analysis Results</h2>
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold mb-2">
                {analysis.pitchScore}%
              </div>
              <Progress className="mb-8" value={analysis.pitchScore || 0} />

              <div className="grid md:grid-cols-2 gap-6">
                <MetricCard
                  description="Based on Google Trends data"
                  icon={Globe2}
                  title="Market Trends"
                  value={analysis.marketAnalysis.marketTrends || 0}
                />
                <MetricCard
                  description="Market competition assessment"
                  icon={Users2}
                  title="Competition Analysis"
                  value={analysis.marketAnalysis.competitionAnalysis || 0}
                />
                <MetricCard
                  description="Total addressable market"
                  icon={Globe2}
                  title="Market Size"
                  value={analysis.marketAnalysis.marketSize || 0}
                />
                <MetricCard
                  description="Monthly search trends"
                  icon={Search}
                  title="Search Volume"
                  value={analysis.marketAnalysis.searchVolume || 0}
                />
              </div>
            </CardBody>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2>Suggestions</h2>
              </CardHeader>
              <CardBody>
                <ol className="space-y-4 list-decimal list-inside">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ol>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2>Potential Risks</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {analysis.potentialRisks.map((risk, index) => (
                    <RiskItem key={index} text={risk} />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: any;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div className="font-medium">{title}</div>
      </div>
      <Progress value={value} />
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}

function RiskItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-destructive">
      <AlertCircle className="w-5 h-5" />
      <span>{text}</span>
    </div>
  );
}
