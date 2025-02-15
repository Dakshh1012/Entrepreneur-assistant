import React, { useState } from "react";
import axios from "axios";
const RecordingComponent: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [response, setResponse] = useState<{
    transcribed_text: string;
    sentiment_score: number;
    ai_feedback: string;
  } | null>(null);

  const handleRecording = async () => {
    setRecording(!recording);

    try {
      const res = await axios.post("http://127.0.0.1:5000/start_recording");

      setResponse(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎤 Startup Pitch Rater</h2>
      <button
        onClick={handleRecording}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        {recording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
      </button>

      {response && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>🔍 Analysis Result</h3>
          <p>
            <b>Transcription:</b> {response.transcribed_text}
          </p>
          <p>
            <b>Sentiment Score:</b> {response.sentiment_score}
          </p>
          <p>
            <b>AI Feedback:</b> {response.ai_feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordingComponent;
