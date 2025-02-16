import google.generativeai as genai

class GeminiFeedback:
    def __init__(self):
        """
        Initialize the Gemini model using a manually set API key.
        """
        self.api_key = "AIzaSyAOTkBOm3bjJJI0TXEtyoQhTODiYgH76rc"  # Manually set API key
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_feedback(self, business_idea, trends_data):
        """
        Generate feedback on the business idea based on trends data.
        :param business_idea: The user's business idea.
        :param trends_data: DataFrame with trends data.
        :return: Feedback as a string.
        """
        try:
            trends_summary = trends_data.to_string()

            prompt = f"""
            Analyze the following business idea based on the provided trends data:
            Business Idea: {business_idea}
            Trends Data: {trends_summary}

            Provide feedback on:
            1. Is the idea up-to-date with current trends?
            2. Where can the user improve?
            3. Any additional suggestions?
            """
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating feedback: {e}")
            return None
