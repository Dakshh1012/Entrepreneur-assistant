import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
GEMINI_KEY = os.getenv('GEMINI_KEY')
genai.configure(api_key="AIzaSyA4PogB4QyXhiUbf-0eRF890GoTZBKlKcQ")

def generate_feedback(user_data, match):
    prompt = f"""
    We matched you with {match['name']} because:
    - Your technical expertise in {user_data['skills']['skill1']} aligns with theirs.
    - Your management style ({user_data['skills']['skill2']}) is compatible with theirs.
    - Your personality type ({user_data['personality']['personality1']}) matches their approach.
    - Your risk-taking tendency ({user_data['personality']['personality2']}) complements theirs.
    - Your vision ({user_data['vision']['vision1']}) is shared.
    - Your work preference ({user_data['vision']['vision2']}) aligns.

    Provide insights on how this partnership might work well.
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    
    return response.text
