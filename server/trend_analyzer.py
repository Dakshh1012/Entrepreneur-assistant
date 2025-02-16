from pytrends.request import TrendReq

class TrendAnalyzer:
    def __init__(self):
        self.pytrends = TrendReq(hl='en-US', tz=360)  # Initialize Pytrends

    def analyze_trends(self, keywords):
        """
        Analyze trends for the given keywords.
        :param keywords: List of keywords to analyze.
        :return: DataFrame with interest over time data.
        """
        try:
            # Build payload and fetch interest over time data
            self.pytrends.build_payload(keywords, timeframe='today 12-m', geo='US')
            interest_over_time_df = self.pytrends.interest_over_time()

            # Drop the 'isPartial' column (not needed)
            if 'isPartial' in interest_over_time_df.columns:
                interest_over_time_df = interest_over_time_df.drop(columns=['isPartial'])

            return interest_over_time_df
        except Exception as e:
            print(f"Error analyzing trends: {e}")
            return None
