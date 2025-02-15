from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import google.generativeai as genai
import os
import threading
import pyaudio
import wave
import time
from dotenv import load_dotenv
load_dotenv()
# Constants
AUDIO_FILE = "./audio.wav"
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 10 
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
GEMINI_KEY = os.getenv('GEMINI_KEY')
genai.configure(api_key=GEMINI_KEY)

# Global variables
recording = False
audio_thread = None
frames = []
p = pyaudio.PyAudio()

# Ensure uploads directory exists
os.makedirs(os.path.dirname(AUDIO_FILE), exist_ok=True)

# Recording function
def record_audio():
    global recording, frames, p

    frames = []
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while recording:
        data = stream.read(CHUNK)
        frames.append(data)

    stream.stop_stream()
    stream.close()

    # Ensure the directory exists before saving
    # os.makedirs(os.path.dirname(AUDIO_FILE), exist_ok=True)

    # Save the recording
    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
    print(f"✅ Audio file saved at: {AUDIO_FILE}")

# Start recording API
@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording, audio_thread
    if not recording:
        recording = True
        audio_thread = threading.Thread(target=record_audio)
        audio_thread.start()
        return jsonify({"message": "Recording started"}), 200
    return jsonify({"message": "Already recording"}), 400

# Stop recording API
@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global recording, audio_thread
    if recording:
        recording = False
        audio_thread.join()  # Ensure recording finishes before analyzing
        time.sleep(1)  # Allow file system to sync
        return analyze_pitch()
    return jsonify({"message": "Not currently recording"}), 400

@app.route('/analyze_pitch', methods=['POST'])
def analyze_pitch():
    file_path = AUDIO_FILE

    # Double-check file exists before proceeding
    if not os.path.exists(file_path):
        return jsonify({"error": "Audio file not found"}), 404

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
