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
import axios from "axios";
import nlp from "compromise";
const stopWords = new Set(["and", "or", "the", "is", "are"]);

function getKeywords(text: string) {
  return nlp(text)
    .nouns()
    .out("array")
    .flatMap((phrase: string) => phrase.split(/\s+/))
    .filter((word: string) => !stopWords.has(word.toLowerCase()));
}

export default function IdeaValidationPage() {
  const [idea, setIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
      console.log(response.data.feedback);
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
        <CardHeader>
          <h1>Validate Your Startup Idea</h1>
        </CardHeader>
        <CardBody>
          <Textarea
            className="min-h-[150px] mb-4"
            placeholder="Describe your startup idea..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button
            className="w-full"
            disabled={!idea || isAnalyzing}
            isLoading={isAnalyzing}
            onPress={handleAnalyze}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Idea"}
          </Button>
        </CardBody>
      </Card>

      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <h2>Analysis Results</h2>
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold mb-2">85%</div>
              <Progress className="mb-8" value={85} />

              <div className="grid md:grid-cols-2 gap-6">
                <MetricCard
                  description="Based on Google Trends data"
                  icon={Globe2}
                  title="Market Trends"
                  value={90}
                />
                <MetricCard
                  description="Market competition assessment"
                  icon={Users2}
                  title="Competition Analysis"
                  value={75}
                />
                <MetricCard
                  description="Total addressable market"
                  icon={Globe2}
                  title="Market Size"
                  value={88}
                />
                <MetricCard
                  description="Monthly search trends"
                  icon={Search}
                  title="Search Volume"
                  value={85}
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
                  <li>Consider focusing on enterprise customers initially</li>
                  <li>
                    Develop a clear differentiation strategy from existing
                    solutions
                  </li>
                  <li>
                    Build strategic partnerships with AI technology providers
                  </li>
                </ol>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2>Potential Risks</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <RiskItem text="High competition in the AI space" />
                  <RiskItem text="Rapidly evolving technology landscape" />
                  <RiskItem text="Need for significant initial investment" />
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
