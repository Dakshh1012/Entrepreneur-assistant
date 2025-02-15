from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import google.generativeai as genai
import os

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load models
model = whisper.load_model("base")
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()
genai.configure(api_key="YOUR_GOOGLE_GEMINI_API_KEY")

@app.route('/analyze_pitch', methods=['POST'])
def analyze_pitch():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_path = "uploads/audio.wav"
    file.save(file_path)

    # Transcription
    result = model.transcribe(file_path)
    transcribed_text = result["text"]

    # Sentiment Analysis
    sentiment_score = sia.polarity_scores(transcribed_text)['compound']

    # AI Feedback
    prompt = f"Analyze this startup pitch and give a score (0-100) with feedback: {transcribed_text}"
    response = genai.chat(prompt)
    ai_feedback = response.text

    os.remove(file_path)  # Clean up

    return jsonify({
        "transcribed_text": transcribed_text,
        "sentiment_score": sentiment_score,
        "ai_feedback": ai_feedback
    })

if __name__ == '__main__':
    app.run(debug=True)
