/* eslint-disable prettier/prettier */
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, RadioGroup, Radio, Progress } from "@heroui/react";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Record<number, Question[]> = {
  1: [
    {
      id: "tech_skills",
      question: "What's your technical expertise level?",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    {
      id: "business_skills",
      question: "How would you rate your business acumen?",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
  ],
  2: [
    {
      id: "work_style",
      question: "What's your preferred work style?",
      options: ["Independent", "Collaborative", "Mix of both", "Flexible"],
    },
    {
      id: "risk_tolerance",
      question: "How do you approach risk?",
      options: ["Conservative", "Moderate", "Aggressive", "Calculated"],
    },
  ],
  3: [
    {
      id: "vision_alignment",
      question: "What's your primary motivation?",
      options: ["Impact", "Innovation", "Financial Success", "Personal Growth"],
    },
    {
      id: "commitment",
      question: "What's your expected time commitment?",
      options: ["Part-time", "Full-time", "Flexible", "Project-based"],
    },
  ],
};

export default function CofounderTest() {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">
          Co-Founder Compatibility Test
        </h1>
        <p className="text-muted-foreground">
          Find your ideal co-founder match based on skills, personality, and
          vision
        </p>
      </div>

      {!showResults ? (
        <motion.div
          key={step}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: 20 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <Progress className="h-2" value={(step / 3) * 100} />
              <p className="mt-2 text-sm text-muted-foreground">
                Step {step} of 3:{" "}
                {step === 1 ? "Skills" : step === 2 ? "Personality" : "Vision"}
              </p>
            </div>

            <div className="space-y-8">
              {questions[step].map((q) => (
                <div key={q.id} className="space-y-4">
                  <h3 className="font-medium">{q.question}</h3>
                  <RadioGroup
                    value={answers[q.id] || ""}
                    onValueChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: value }))
                    }
                  >
                    {q.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Radio id={`${q.id}-${option}`} value={option} />
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              {step > 1 && (
                <Button
                  className="mr-2"
                  variant="bordered"
                  onPress={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              <Button onPress={handleNext}>
                {step === 3 ? "See Results" : "Next"}
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
        >
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Your Ideal Co-Founder Profile
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium">Recommended Skills</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="font-medium text-green-800">
                      Technical Skills
                    </div>
                    <p className="text-sm text-green-600">
                      Strong backend development
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="font-medium text-blue-800">
                      Business Skills
                    </div>
                    <p className="text-sm text-blue-600">
                      Marketing and sales expertise
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Personality Match</h3>
                <div className="rounded-lg bg-purple-50 p-4">
                  <ul className="space-y-2 text-sm text-purple-600">
                    <li>• Collaborative work style</li>
                    <li>• Balanced risk approach</li>
                    <li>• Strong communication skills</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Next Steps</h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Join founder networking events</li>
                    <li>2. Attend industry meetups</li>
                    <li>3. Connect with potential matches</li>
                  </ol>
                </div>
              </div>
            </div>

            <Button
              className="mt-6"
              onPress={() => {
                setStep(1);
                setShowResults(false);
                setAnswers({});
              }}
            >
              Retake Test
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
