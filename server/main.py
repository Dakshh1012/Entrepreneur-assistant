from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import google.generativeai as genai
import os
import re
import threading
import pyaudio
import wave
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
from trend_analyzer import TrendAnalyzer
from server.gemini_feedback_market import GeminiFeedback
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
        prompt = f"""
Analyze this startup pitch and give a score (0-100) with feedback.
Format the response as follows:

Pitch Score: <score>

▶ Strengths
- <Strength 1>
- <Strength 2>
- <Strength 3>

⚠ Areas for Improvement
- <Improvement 1>
- <Improvement 2>
- <Improvement 3>

Detailed Metrics:
Clarity: <score>%
Confidence: <score>%
Pace: <score>%
Engagement: <score>%

Text to analyze:
{transcribed_text}
"""

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
trend_analyzer = TrendAnalyzer()
gemini_feedback = GeminiFeedback()
@app.route('/analyze-idea', methods=['POST'])
def analyze_idea():
    try:
        # Step 1: Get user input
        data = request.json
        business_idea = data.get('business_idea', '')
        keywords = data.get('keywords', [])

        # Step 2: Analyze trends using Pytrends
        trends_data = trend_analyzer.analyze_trends(keywords)
        if trends_data is None:
            return jsonify({'error': 'Failed to analyze trends'}), 500

        # Step 3: Generate feedback using Gemini
        feedback = gemini_feedback.generate_feedback(business_idea, trends_data)
        if feedback is None:
            return jsonify({'error': 'Failed to generate feedback'}), 500

        # Step 4: Return the feedback
        return jsonify({'feedback': feedback}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/analyze-idea', methods=['POST'])
def analyze_idea():
    try:
        # Step 1: Get user input
        data = request.json
        business_idea = data.get('business_idea', '')
        keywords = data.get('keywords', [])

        # Step 2: Analyze trends using Pytrends
        trends_data = trend_analyzer.analyze_trends(keywords)
        if trends_data is None:
            return jsonify({'error': 'Failed to analyze trends'}), 500

        # Step 3: Generate feedback using Gemini
        prompt = f"""
Generate a structured analysis report for a business idea using the idea given and trend analytics. The response should follow this strict format to ensure easy extraction using regex:

Pitch Score: [numeric_value]%

Market Analysis:
- Market Trends: [numeric_value]%
- Market Size: [numeric_value]%
- Competition Analysis: [numeric_value]%
- Search Volume: [numeric_value]%

Suggestions:
- [First suggestion]
- [Second suggestion]
- [Third suggestion]

Potential Risks:
- [First risk]
- [Second risk]
- [Third risk]

Ensure that all sections are clearly labeled and formatted exactly as shown above. Avoid using extra explanations, and stick to this structured format.
Business idea:
{business_idea}
"""
        feedback = gemini_feedback.generate_feedback(prompt,trends_data)
        if feedback is None:
            return jsonify({'error': 'Failed to generate feedback'}), 500
        # Step 4: Return the feedback
        return jsonify({'feedback': feedback}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def generate_formal_email(context):
    """Uses Gemini AI to generate a formal email based on user input."""
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(f"Write a professional email for the following context: {context}")
    return response.text.strip()

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        # Step 1: Get user input
        data = request.json
        recipient = data.get('recipient')
        context = data.get('context')

        if not recipient or not context:
            return jsonify({"error": "Recipient and context are required"}), 400

        # Step 2: Generate the email content using Gemini AI
        formal_email = generate_formal_email(context)

        # Step 3: Send the email
        sender_email = "dakshjain182183@gmail.com"
        app_password = "mexf cqpn rozz dfwq"

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient
        msg['Subject'] = "Important Email"
        msg.attach(MIMEText(formal_email, 'plain'))

        # Step 4: Connect to Gmail SMTP server and send email
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender_email, app_password)
        server.sendmail(sender_email, recipient, msg.as_string())
        server.quit()

        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
