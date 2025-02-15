from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import google.generativeai as genai
import os
from genai_feedback import generate_feedback
from recommend import find_best_match
from database import users

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load models
model = whisper.load_model("base")
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

genai.configure(api_key="AIzaSyAOTkBOm3bjJJI0TXEtyoQhTODiYgH76rc")

@app.route('/analyze_pitch', methods=['POST'])
def analyze_pitch():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    os.makedirs("uploads", exist_ok=True)  # Ensure uploads directory exists
    file_path = "uploads/audio.wav"
    file.save(file_path)

    try:
        # Transcription
        result = model.transcribe(file_path)
        transcribed_text = result["text"]

        # Sentiment Analysis
        sentiment_score = sia.polarity_scores(transcribed_text)['compound']

        # AI Feedback
        prompt = f"Analyze this startup pitch and give a score (0-100) with feedback: {transcribed_text}"
        gen_model = genai.GenerativeModel("gemini-pro")
        response = gen_model.generate_content(prompt)
        ai_feedback = response.text

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        os.remove(file_path)  # Clean up

    return jsonify({
        "transcribed_text": transcribed_text,
        "sentiment_score": sentiment_score,
        "ai_feedback": ai_feedback
    })

@app.route("/assistant", methods=["POST"])
def chatbot():
    data = request.json
    user_prompt = data.get("prompt")

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        gen_model = genai.GenerativeModel("gemini-pro")
        response = gen_model.generate_content(user_prompt)
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request data"}), 400

    try:
        best_match = find_best_match(data, users)  # Ensure `users` is defined somewhere
        feedback = generate_feedback(data, best_match)
        return jsonify({"feedback": feedback})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
